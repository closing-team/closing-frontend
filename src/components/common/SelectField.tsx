import { useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label?: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder = "항목을 선택하세요",
  disabled,
  className = "",
}: SelectFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <div className={className}>
      {label && (
        <label
          className={`mb-2 ml-0.5 block text-title-3 ${disabled ? "text-gray-400" : "text-gray-900"}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((v) => !v)}
          className={`flex h-[52px] w-full items-center justify-between rounded-lg border bg-white pl-4 pr-2 text-body-1 disabled:border-transparent disabled:bg-gray-100 ${
            open ? "border-primary-500" : "border-gray-200"
          } ${selected ? "text-gray-900" : "text-gray-400"}`}
        >
          {selected?.label ?? placeholder}
          <span className="flex h-8 w-8 items-center justify-center">
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
            />
            <ul className="absolute inset-x-0 z-20 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              {options.map((option) => (
                <li key={option.value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={`flex h-[52px] w-full items-center px-4 text-left text-body-2 active:bg-gray-30 ${
                      option.value === value
                        ? "text-primary-500"
                        : "text-gray-900"
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
    </div>
  );
}
