import { useEffect, useRef, useState } from "react";
import { PlusMdIcon, XMdIcon } from "../../assets/icons";

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
  maxSizeMB = 10,
  accept = ["image/jpeg", "image/png"],
  label = "파일 첨부(선택)",
}: FileAttachFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAdd = files.length < max;

  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());
  const previewUrlsRef = useRef(previewUrls);

  useEffect(() => {
    return () => {
      previewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = "";

    const valid = picked.filter(
      (file) => accept.includes(file.type) && file.size <= maxSizeMB * 1024 * 1024,
    );
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
