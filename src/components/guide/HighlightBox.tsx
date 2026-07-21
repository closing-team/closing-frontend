type ValueSize = "title-3" | "title-2";
type ValueColor = "gray-900" | "primary-500";

export interface HighlightRow {
  label: string;
  value: string;
  valueSize?: ValueSize;
  valueColor?: ValueColor;
}

interface HighlightBoxProps {
  rows: HighlightRow[];
  note?: string;
}

const VALUE_SIZE_CLASS: Record<ValueSize, string> = {
  "title-3": "text-title-3",
  "title-2": "text-title-2",
};

const VALUE_COLOR_CLASS: Record<ValueColor, string> = {
  "gray-900": "text-gray-900",
  "primary-500": "text-primary-500",
};

export default function HighlightBox({ rows, note }: HighlightBoxProps) {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-gray-30 p-4">
      {rows.map((row, i) => (
        <div
          key={i}
          className={`flex flex-col gap-1 ${
            i > 0 ? "mt-4 border-t border-gray-100 pt-4" : ""
          }`}
        >
          <p className="text-body-2 text-gray-900">{row.label}</p>
          <p
            className={`${VALUE_SIZE_CLASS[row.valueSize ?? "title-3"]} ${
              VALUE_COLOR_CLASS[row.valueColor ?? "gray-900"]
            }`}
          >
            {row.value}
          </p>
        </div>
      ))}
      {note && (
        <div className="mt-4 flex gap-1 border-t border-gray-100 pt-4">
          <span className="flex shrink-0 items-center pt-2">
            <span className="h-px w-[3px] rounded-full bg-gray-500" />
          </span>
          <p className="flex-1 text-body-3 text-gray-700">{note}</p>
        </div>
      )}
    </div>
  );
}
