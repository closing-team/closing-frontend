import { ImageIcon, PlusMdIcon } from "../../assets/icons";

interface PhotoUploaderProps {
  count: number;
  onChange: (count: number) => void;
  max?: number;
  label?: string;
}

export default function PhotoUploader({
  count,
  onChange,
  max = 10,
  label = "실물 사진",
}: PhotoUploaderProps) {
  const canAdd = count < max;

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
          onClick={() => canAdd && onChange(count + 1)}
          className="flex aspect-square w-[100px] shrink-0 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 bg-gray-30 text-gray-400 disabled:opacity-50"
        >
          <PlusMdIcon className="h-6 w-6" />
          <span className="text-caption-3">
            {count} / {max}
          </span>
        </button>

        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-square w-[100px] shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-200"
          >
            <ImageIcon className="h-7 w-7" />
          </div>
        ))}
      </div>
    </div>
  );
}
