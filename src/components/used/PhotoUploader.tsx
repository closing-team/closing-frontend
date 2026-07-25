import { useEffect, useMemo, useRef } from "react";
import { PlusMdIcon, XFilledIcon } from "../../assets/icons";

interface PhotoUploaderProps {
  files: File[];
  onChange: (files: File[]) => void;
  max?: number;
  label?: string;
}

export default function PhotoUploader({
  files,
  onChange,
  max = 10,
  label = "실물 사진",
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAdd = files.length < max;
  const previewUrls = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files],
  );

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) {
      onChange([...files, ...selected].slice(0, max));
    }
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <p className="mb-[13px] ml-0.5 text-subtitle-2 text-gray-900">
        {label}{" "}
        <span className="text-caption-2 text-gray-500">(최대 {max}장)</span>
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          aria-label="사진 추가"
          disabled={!canAdd}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square w-[100px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 bg-gray-30 text-gray-400 disabled:opacity-50"
        >
          <PlusMdIcon className="h-6 w-6" />
          <span className="text-caption-3">
            {files.length} / {max}
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFilesSelected}
        />

        {previewUrls.map((url, i) => (
          <div
            key={i}
            className="relative aspect-square w-[100px] shrink-0 overflow-hidden rounded-lg bg-gray-100"
          >
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              aria-label="사진 삭제"
              onClick={() => handleRemove(i)}
              className="absolute right-1 top-1 text-gray-900"
            >
              <XFilledIcon className="h-5 w-5" />
            </button>
            {i === 0 && (
              <div className="absolute bottom-0 flex w-[100px] items-center justify-center gap-2.5 bg-primary-500 px-2.5 py-1">
                <span className="text-caption-2 text-white">대표 사진</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
