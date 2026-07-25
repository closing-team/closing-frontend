import Dropdown from "../common/Dropdown";
import type { UsedSort } from "../../types/used";

interface SortDropdownProps {
  value: UsedSort;
  onChange: (sort: UsedSort) => void;
  showDistance?: boolean;
}

const SORT_OPTIONS: { key: UsedSort; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "latest", label: "최신순" },
  { key: "distance", label: "거리순" },
  { key: "priceLow", label: "낮은 가격순" },
  { key: "priceHigh", label: "높은 가격순" },
];

export default function SortDropdown({
  value,
  onChange,
  showDistance = true,
}: SortDropdownProps) {
  const options = showDistance
    ? SORT_OPTIONS
    : SORT_OPTIONS.filter((o) => o.key !== "distance");

  return (
    <Dropdown
      variant="muted"
      hideSelectedFromList={false}
      options={options}
      value={value}
      onChange={(key) => onChange(key as UsedSort)}
    />
  );
}
