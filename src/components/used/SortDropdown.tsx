import { useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";
import type { UsedSort } from "../../types/used";

interface SortDropdownProps {
  value: UsedSort;
  onChange: (sort: UsedSort) => void;
  distanceEnabled: boolean;
  onDistanceRequest: () => void;
}

const SORT_OPTIONS: { key: UsedSort; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "latest", label: "최신순" },
  { key: "distance", label: "거리순" },
  { key: "priceLow", label: "저가순" },
  { key: "priceHigh", label: "고가순" },
];

export default function SortDropdown({
  value,
  onChange,
  distanceEnabled,
  onDistanceRequest,
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = SORT_OPTIONS.find(
    (option) => option.key === value,
  )?.label;

  const handleSelect = (key: UsedSort) => {
    if (key === "distance" && !distanceEnabled) {
      onDistanceRequest();
      setOpen(false);
      return;
    }
    onChange(key);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-caption-2 text-gray-600"
      >
        {currentLabel}
        <ChevronDownIcon className="h-4 w-4" />
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="정렬 옵션 닫기"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div className="absolute right-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-xl bg-white shadow-lg">
            {SORT_OPTIONS.map((option) => {
              const disabled = option.key === "distance" && !distanceEnabled;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelect(option.key)}
                  className={`block w-full px-3 py-2 text-left text-caption-2 ${
                    option.key === value
                      ? "text-primary-500"
                      : disabled
                        ? "text-gray-200"
                        : "text-gray-600"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
