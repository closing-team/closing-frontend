import { useEffect, useMemo, useRef } from "react";
import { PlusMdIcon, XFilledIcon } from "../../assets/icons";

export type PhotoItem = { kind: "existing"; url: string } | { kind: "new"; file: File };

interface PhotoUploaderProps {
  items: PhotoItem[];
  onChange: (items: PhotoItem[]) => void;
  max?: number;
  label?: string;
}

export default function PhotoUploader({
  items,
  onChange,
  max = 10,
  label = "실물 사진",
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canAdd = items.length < max;

  const newFileUrls = useMemo(() => {
    const map = new Map<File, string>();
    for (const item of items) {
      if (item.kind === "new") map.set(item.file, URL.createObjectURL(item.file));
    }
    return map;
  }, [items]);

  useEffect(() => {
    return () => {
      newFileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newFileUrls]);

  const previewUrl = (item: PhotoItem) =>
    item.kind === "existing" ? item.url : (newFileUrls.get(item.file) ?? "");

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).map(
      (file): PhotoItem => ({ kind: "new", file }),
    );
    if (selected.length > 0) {
      onChange([...items, ...selected].slice(0, max));
    }
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
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
            {items.length} / {max}
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

        {items.map((item, i) => (
          <div
            key={i}
            className="relative aspect-square w-[100px] shrink-0 overflow-hidden rounded-lg bg-gray-100"
          >
            <img
              src={previewUrl(item)}
              alt=""
              className="h-full w-full object-cover"
            />
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
