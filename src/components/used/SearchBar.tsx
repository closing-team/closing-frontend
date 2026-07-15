import { useState } from "react";
import { ChevronLeftIcon, XFilledIcon, SearchIcon } from "../../assets/icons";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  onBack?: () => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value,
  onChange,
  onSearch,
  onBack,
  placeholder = "필요한 대형 집기, 업종 검색",
  className = "",
}: SearchBarProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`flex h-14 items-center gap-2 bg-white py-2.5 ${onBack ? "pl-1.5" : "pl-4"} pr-4 ${className}`}
    >
      {onBack && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
          className="-ml-1 p-1 text-gray-900"
        >
          <ChevronLeftIcon />
        </button>
      )}
      <div
        className={`flex h-10 flex-1 items-center justify-between rounded-lg border bg-gray-30 py-2 pl-3 pr-2 ${
          focused ? "border-primary-500" : "border-transparent"
        }`}
      >
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch?.();
          }}
          placeholder={placeholder}
          className="w-full min-w-0 text-body-2 text-gray-900 outline-none placeholder:text-gray-400"
        />
        <div className="flex shrink-0 items-center gap-1">
          {value && (
            <button
              type="button"
              aria-label="지우기"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onChange("")}
              className={`flex h-6 w-6 shrink-0 items-center justify-center ${focused ? "text-primary-300" : "text-gray-200"}`}
            >
              <XFilledIcon className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            aria-label="검색"
            onClick={onSearch}
            className="flex h-6 w-6 shrink-0 items-center justify-center text-gray-600"
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
