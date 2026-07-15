import { useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";

export interface DropdownOption {
  key: string;
  label: string;
  disabled?: boolean;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Dropdown({
  options,
  value,
  onChange,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.key === value);

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 items-center gap-1 rounded-md border border-gray-200 bg-white py-1.5 pl-3 pr-2 text-subtitle-2 text-gray-900"
      >
        {selected?.label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul className="absolute right-0 top-full z-20 mt-1 w-28 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
            {options
              .filter((o) => o.key !== value)
              .map((option) => (
                <li key={option.key}>
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.key);
                      setOpen(false);
                    }}
                    className={`block w-full px-3 py-2 text-left text-caption-1 active:bg-gray-30 ${
                      option.disabled ? "text-gray-200" : "text-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
}
