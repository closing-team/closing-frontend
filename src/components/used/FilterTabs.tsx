import type { UsedFilter } from "../../types/used";

interface FilterTabsProps {
  value: UsedFilter;
  onChange: (filter: UsedFilter) => void;
  nearbyLabel: string;
}

const FILTERS: { key: UsedFilter; label?: string }[] = [
  { key: "all", label: "전체" },
  { key: "nearby" },
  { key: "parcel", label: "택배만" },
  { key: "direct", label: "직거래만" },
];

export default function FilterTabs({
  value,
  onChange,
  nearbyLabel,
}: FilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map(({ key, label }) => {
        const active = value === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className={`shrink-0 rounded-full border px-4 py-2 text-subtitle-2 transition-colors ${
              active
                ? "border-primary-500 bg-primary-500 text-white"
                : "border-gray-200 bg-white text-gray-600"
            }`}
          >
            {key === "nearby" ? nearbyLabel : label}
          </button>
        );
      })}
    </div>
  );
}
