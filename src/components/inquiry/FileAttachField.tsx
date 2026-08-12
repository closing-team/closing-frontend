import { useEffect, useRef, useState } from "react";
import { PlusMdIcon, XMdIcon } from "../../assets/icons";
import {
  filterValidImageFiles,
  MAX_UPLOAD_IMAGE_SIZE_MB,
} from "../../utils/fileValidation";

const OVERSIZED_FILE_WARNING_MS = 2000;

interface FileAttachFieldProps {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  maxSizeMB?: number;
  accept?: string[];
  label?: string;
}

export default function FileAttachField({
  files,
  onChange,
  max = 3,
  maxSizeMB = MAX_UPLOAD_IMAGE_SIZE_MB,
  accept = ["image/jpeg", "image/png"],
  label = "파일 첨부(선택)",
}: FileAttachFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAdd = files.length < max;

  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());
  const previewUrlsRef = useRef(previewUrls);
  const [showOversizedWarning, setShowOversizedWarning] = useState(false);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  useEffect(() => {
    if (!showOversizedWarning) return;
    const timer = window.setTimeout(
      () => setShowOversizedWarning(false),
      OVERSIZED_FILE_WARNING_MS,
    );
    return () => window.clearTimeout(timer);
  }, [showOversizedWarning]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";

    const { valid, rejectedCount } = filterValidImageFiles(picked, {
      maxSizeMB,
      accept,
    });
    setShowOversizedWarning(rejectedCount > 0);

    const remaining = max - files.length;
    if (remaining <= 0 || valid.length === 0) return;

    const added = valid.slice(0, remaining);
    const next = new Map(previewUrls);
    added.forEach((file) => next.set(file, URL.createObjectURL(file)));
    previewUrlsRef.current = next;
    setPreviewUrls(next);
    onChange([...files, ...added]);
  };

  const handleRemove = (index: number) => {
    const removedFile = files[index];
    const next = new Map(previewUrls);
    const url = next.get(removedFile);
    if (url) URL.revokeObjectURL(url);
    next.delete(removedFile);
    previewUrlsRef.current = next;
    setPreviewUrls(next);
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="mb-3 ml-0.5 text-title-3 text-gray-900">{label}</p>

      <div className="flex items-center gap-5">
        <button
          type="button"
          aria-label="파일 추가"
          disabled={!canAdd}
          onClick={() => canAdd && inputRef.current?.click()}
          className="flex size-[70px] shrink-0 flex-col items-center justify-center gap-0.5 rounded-lg border border-dashed border-gray-200 bg-gray-30 text-gray-400 disabled:opacity-50"
        >
          <PlusMdIcon className="h-6 w-6" />
          <span className="text-caption-3">
            {files.length} / {max}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(",")}
          multiple
          className="hidden"
          onChange={handleFilesSelected}
        />

        <p className="text-body-3 text-gray-500">
          {maxSizeMB}MB 이하의 이미지 파일(JPG, PNG)만
          <br />
          최대 {max}장까지 등록할 수 있습니다.
        </p>
      </div>

      {showOversizedWarning && (
        <p className="mt-2 ml-0.5 text-caption-2 text-warning-600" role="alert">
          {maxSizeMB}MB 이하의 이미지 파일(JPG, PNG)만 첨부할 수 있습니다.
        </p>
      )}

      {files.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="relative size-[70px] shrink-0 overflow-hidden rounded-lg bg-gray-100"
            >
              <img
                src={previewUrls.get(file)}
                alt=""
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                aria-label="첨부 파일 삭제"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white"
              >
                <XMdIcon className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
