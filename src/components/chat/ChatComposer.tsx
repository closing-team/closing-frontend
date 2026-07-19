import { useEffect, useRef, useState } from "react";
import {
  PlusMdIcon,
  SendDisabledIcon,
  SendEnabledIcon,
  XMdIcon,
} from "../../assets/icons";
import type { PendingChatMessage } from "../../types/chat";

interface ChatComposerProps {
  onSend: (message: PendingChatMessage) => void | Promise<void>;
}

export default function ChatComposer({ onSend }: ChatComposerProps) {
  const [value, setValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [failedMessage, setFailedMessage] = useState<PendingChatMessage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ownedPreviewUrlRef = useRef<string | null>(null);
  const canSend = value.trim().length > 0 || selectedFile !== null;

  const revokeOwnedPreview = () => {
    const ownedPreviewUrl = ownedPreviewUrlRef.current;

    if (ownedPreviewUrl) {
      URL.revokeObjectURL(ownedPreviewUrl);
      ownedPreviewUrlRef.current = null;
    }

    setPreviewUrl(null);
  };

  useEffect(
    () => () => {
      const ownedPreviewUrl = ownedPreviewUrlRef.current;
      if (ownedPreviewUrl) {
        URL.revokeObjectURL(ownedPreviewUrl);
      }
    },
    [],
  );

  const clearAfterSuccessfulSend = () => {
    ownedPreviewUrlRef.current = null;
    setValue("");
    setSelectedFile(null);
    setPreviewUrl(null);
    setFailedMessage(null);
  };

  const send = async (message?: PendingChatMessage) => {
    const text = value.trim();
    const pendingMessage =
      message ??
      (selectedFile && previewUrl
        ? {
            type: "image" as const,
            content: previewUrl,
            file: selectedFile,
            ...(text ? { caption: text } : {}),
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
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isSending) {
      return;
    }

    const [file] = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    revokeOwnedPreview();
    const nextPreviewUrl = URL.createObjectURL(file);
    ownedPreviewUrlRef.current = nextPreviewUrl;
    setSelectedFile(file);
    setPreviewUrl(nextPreviewUrl);
    setFailedMessage(null);
  };

  return (
    <section className="border-t border-gray-100 bg-white px-3 py-4" aria-label="메시지 작성">
      {previewUrl && (
        <div className="mb-3 flex items-start gap-2">
          <div className="relative h-14 w-14">
            <img
              src={previewUrl}
              alt="선택한 이미지 미리보기"
              className="h-14 w-14 rounded object-cover"
            />
            <button
              type="button"
              aria-label="이미지 선택 취소"
              onClick={() => {
                if (isSending) {
                  return;
                }

                revokeOwnedPreview();
                setSelectedFile(null);
                setFailedMessage(null);
              }}
              disabled={isSending}
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <XMdIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {failedMessage && (
        <div className="mb-3 flex items-center justify-between gap-3" role="alert">
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
          disabled={isSending}
          className="flex h-10 w-10 shrink-0 items-center justify-center text-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => {
            if (!isSending) {
              fileInputRef.current?.click();
            }
          }}
        >
          <PlusMdIcon className="h-6 w-6" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          aria-label="이미지 첨부"
          className="sr-only"
          disabled={isSending}
          onChange={handleFileChange}
        />
        <textarea
          aria-label="메시지 입력"
          value={value}
          onChange={(event) => {
            if (isSending) {
              return;
            }

            setValue(event.target.value);
            setFailedMessage(null);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void send();
            }
          }}
          placeholder="메시지를 입력하세요..."
          rows={1}
          disabled={isSending}
          className="h-10 min-w-0 flex-1 resize-none rounded-lg bg-gray-30 px-4 py-2.5 text-body-2 text-gray-900 outline-none placeholder:text-gray-400 focus-visible:ring-2 focus-visible:ring-primary-500"
        />
        <button
          type="button"
          aria-label="전송"
          disabled={!canSend || isSending}
          onClick={() => void send()}
          className="flex h-10 w-10 shrink-0 items-center justify-center disabled:cursor-not-allowed"
        >
          {canSend && !isSending ? (
            <SendEnabledIcon className="h-6 w-6" />
          ) : (
            <SendDisabledIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </section>
  );
}
