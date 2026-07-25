import Chip from "../common/Chip";
import type { UsedFilter } from "../../types/used";

interface FilterTabsProps {
  value: UsedFilter;
  onChange: (filter: UsedFilter) => void;
  nearbyLabel: string;
  showNearby?: boolean;
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
  showNearby = true,
}: FilterTabsProps) {
  const filters = showNearby
    ? FILTERS
    : FILTERS.filter((f) => f.key !== "nearby");

  return (
    <div className="flex gap-1.5 overflow-x-auto px-4 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {filters.map(({ key, label }) => (
        <Chip
          key={key}
          label={key === "nearby" ? nearbyLabel : (label ?? "")}
          selected={value === key}
          onClick={() => onChange(key)}
        />
      ))}
    </div>
  );
}
