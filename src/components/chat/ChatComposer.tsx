import { useEffect, useRef, useState } from "react";
import {
  PlusMdIcon,
  SendDisabledIcon,
  SendEnabledIcon,
  XMdIcon,
} from "../../assets/icons";
import Toast from "../common/Toast";
import { MAX_CHAT_IMAGES_PER_MESSAGE, MAX_CHAT_IMAGE_SIZE_MB } from "../../constants/chat";
import type { PendingChatMessage } from "../../types/chat";

const MAX_TEXTAREA_HEIGHT = 60;
const IMAGE_WARNING_MS = 2000;
const TOO_MANY_IMAGES_MESSAGE = `사진은 최대 ${MAX_CHAT_IMAGES_PER_MESSAGE}장까지 보낼 수 있습니다.`;
const OVERSIZED_IMAGE_MESSAGE = `${MAX_CHAT_IMAGE_SIZE_MB}MB 이하의 이미지만 보낼 수 있습니다.`;

interface SelectedImage {
  file: File;
  previewUrl: string;
}

interface ChatComposerProps {
  onSend: (message: PendingChatMessage) => void | Promise<void>;
  allowImages?: boolean;
}

export default function ChatComposer({
  onSend,
  allowImages = true,
}: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [failedMessage, setFailedMessage] = useState<PendingChatMessage | null>(null);
  const [imageWarning, setImageWarning] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ownedPreviewUrlsRef = useRef(new Set<string>());
  const canSend =
    value.trim().length > 0 || (allowImages && selectedImages.length > 0);
  const canAddMoreImages = selectedImages.length < MAX_CHAT_IMAGES_PER_MESSAGE;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  useEffect(() => {
    if (!imageWarning) return;
    const timer = window.setTimeout(() => setImageWarning(null), IMAGE_WARNING_MS);
    return () => window.clearTimeout(timer);
  }, [imageWarning]);

  const revokeOwnedPreview = (previewUrl: string) => {
    if (ownedPreviewUrlsRef.current.has(previewUrl)) {
      URL.revokeObjectURL(previewUrl);
      ownedPreviewUrlsRef.current.delete(previewUrl);
    }
  };

  useEffect(
    () => () => {
      ownedPreviewUrlsRef.current.forEach((previewUrl) =>
        URL.revokeObjectURL(previewUrl),
      );
      ownedPreviewUrlsRef.current.clear();
    },
    [],
  );

  const clearAfterSuccessfulSend = () => {
    selectedImages.forEach(({ previewUrl }) => revokeOwnedPreview(previewUrl));
    setValue("");
    setSelectedImages([]);
    setFailedMessage(null);
  };

  const send = async (message?: PendingChatMessage) => {
    const text = value.trim();
    const pendingMessage =
      message ??
      (selectedImages.length > 0
        ? {
            type: "image" as const,
            files: selectedImages.map(({ file }) => file),
          }
        : text
          ? { type: "text" as const, content: text }
          : null);

    if (!pendingMessage || isSending) {
      return;
    }

    setIsSending(true);
    try {
      await onSend(pendingMessage);
      clearAfterSuccessfulSend();
    } catch {
      setFailedMessage(pendingMessage);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => textareaRef.current?.focus());
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSending) {
      return;
    }

    const pickedFiles = Array.from(event.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );
    event.target.value = "";

    if (pickedFiles.length === 0) {
      return;
    }

    const availableSlots = MAX_CHAT_IMAGES_PER_MESSAGE - selectedImages.length;
    if (availableSlots <= 0) {
      setImageWarning(TOO_MANY_IMAGES_MESSAGE);
      return;
    }

    const validSizeFiles = pickedFiles.filter(
      (file) => file.size <= MAX_CHAT_IMAGE_SIZE_MB * 1024 * 1024,
    );
    const files = validSizeFiles.slice(0, availableSlots);

    if (validSizeFiles.length > availableSlots) {
      setImageWarning(TOO_MANY_IMAGES_MESSAGE);
    } else if (validSizeFiles.length < pickedFiles.length) {
      setImageWarning(OVERSIZED_IMAGE_MESSAGE);
    } else {
      setImageWarning(null);
    }

    if (files.length === 0) {
      return;
    }

    const additions = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      ownedPreviewUrlsRef.current.add(previewUrl);
      return { file, previewUrl };
    });
    setValue("");
    setSelectedImages((current) => [...current, ...additions]);
    setFailedMessage(null);
  };

  return (
    <section
      className="flex flex-col gap-2 border-t border-gray-100 bg-white px-3 py-4"
      aria-label="메시지 작성"
    >
      {selectedImages.length > 0 && (
        <div className="flex items-start gap-3 overflow-x-auto px-0.5 pt-2">
          {selectedImages.map(({ file, previewUrl }) => (
            <div key={previewUrl} className="relative h-14 w-14 shrink-0">
              <img
                src={previewUrl}
                alt={`${file.name} 미리보기`}
                className="h-14 w-14 rounded object-cover"
              />
              <button
                type="button"
                aria-label={`${file.name} 선택 취소`}
                onClick={() => {
                  if (isSending) return;
                  revokeOwnedPreview(previewUrl);
                  setSelectedImages((current) =>
                    current.filter((image) => image.previewUrl !== previewUrl),
                  );
                  setFailedMessage(null);
                }}
                disabled={isSending}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <XMdIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {imageWarning && <Toast message={imageWarning} variant="danger" />}

      {failedMessage && (
        <div className="flex items-center justify-between gap-3" role="alert">
          <span className="text-caption-2 text-warning-600">메시지를 전송할 수 없습니다.</span>
          <button
            type="button"
            className="shrink-0 text-caption-2 font-semibold text-primary-500"
            onClick={() => send(failedMessage)}
            disabled={isSending}
          >
            재시도
          </button>
        </div>
      )}

      <div className="flex items-end gap-2">
        <button
          type="button"
          aria-label="이미지 선택"
          disabled={isSending || !allowImages || !canAddMoreImages}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!isSending && allowImages && canAddMoreImages) {
              fileInputRef.current?.click();
            }
          }}
        >
          <PlusMdIcon className="h-6 w-6 shrink-0" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          aria-label="이미지 첨부"
          className="sr-only"
          disabled={isSending || !allowImages || !canAddMoreImages}
          onChange={handleFileChange}
        />
        <div
          className={`flex min-h-10 min-w-0 flex-1 items-center justify-between rounded-lg border bg-gray-30 py-2 pl-3 pr-2 ${
            isFocused ? "border-primary-500" : "border-gray-200"
          }`}
        >
          <textarea
            ref={textareaRef}
            aria-label="메시지 입력"
            value={value}
            onChange={(event) => {
              if (isSending) {
                return;
              }

              setValue(event.target.value);
              setFailedMessage(null);
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) {
                return;
              }

              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send();
              }
            }}
            placeholder={
              selectedImages.length > 0
                ? "이미지만 전송할 수 있습니다."
                : "메시지를 입력하세요..."
            }
            rows={1}
            disabled={isSending || selectedImages.length > 0}
            style={{ maxHeight: MAX_TEXTAREA_HEIGHT }}
            className="w-full flex-1 resize-none overflow-y-auto text-[14px] font-normal leading-[1.4] tracking-[-0.28px] text-gray-900 outline-none placeholder:text-gray-400 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400"
          />
        </div>
        <button
          type="button"
          aria-label="전송"
          disabled={!canSend || isSending}
          onClick={() => void send()}
          className={`flex h-10 w-10 shrink-0 items-center justify-center disabled:cursor-not-allowed ${
            canSend && !isSending ? "text-primary-500" : "text-gray-400"
          }`}
        >
          {canSend && !isSending ? (
            <SendEnabledIcon className="h-6 w-6 shrink-0" />
          ) : (
            <SendDisabledIcon className="h-6 w-6 shrink-0" />
          )}
        </button>
      </div>
    </section>
  );
}
