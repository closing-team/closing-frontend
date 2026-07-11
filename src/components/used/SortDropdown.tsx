import { useState } from 'react';
import chevronDownIcon from '../../assets/icons/chevron-down.svg';
import type { UsedSort } from '../../types/used';

interface SortDropdownProps {
  value: UsedSort;
  onChange: (sort: UsedSort) => void;
  // 위치 권한 미허용 시 거리순 비활성 — 선택 시 권한 재요청
  distanceEnabled: boolean;
  onDistanceRequest: () => void;
}

const SORT_OPTIONS: { key: UsedSort; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'latest', label: '최신순' },
  { key: 'distance', label: '거리순' },
  { key: 'priceLow', label: '저가순' },
  { key: 'priceHigh', label: '고가순' },
];

// 정렬 드롭다운 — 인기순 / 최신순 / 거리순 / 저가순 / 고가순
export default function SortDropdown({ value, onChange, distanceEnabled, onDistanceRequest }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const currentLabel = SORT_OPTIONS.find((option) => option.key === value)?.label;

  const handleSelect = (key: UsedSort) => {
    if (key === 'distance' && !distanceEnabled) {
      // 위치 권한이 없으면 정렬을 바꾸지 않고 권한부터 요청
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
        className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
      >
        {currentLabel}
        <img src={chevronDownIcon} alt="" className="h-4 w-4" />
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
              const disabled = option.key === 'distance' && !distanceEnabled;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handleSelect(option.key)}
                  className={`block w-full px-3 py-2 text-left text-xs font-medium ${
                    option.key === value
                      ? 'text-primary'
                      : disabled
                        ? 'text-bg-200'
                        : 'text-gray-600'
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
