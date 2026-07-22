import { useState } from "react";
import { ChevronDownIcon } from "../../assets/icons";

export interface DropdownOption {
  key: string;
  label: string;
  disabled?: boolean;
}

type DropdownVariant = "default" | "muted" | "field";

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (key: string) => void;
  variant?: DropdownVariant;
  hideSelectedFromList?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}

const TRIGGER_SHAPE_CLASS: Record<DropdownVariant, string> = {
  default: "h-8 rounded-md border border-gray-200 bg-white py-1.5 pl-3 pr-2",
  muted: "h-8 rounded-md border border-gray-200 bg-white py-1.5 pl-3 pr-2",
  field: "h-[52px] w-full rounded-lg border border-gray-200 bg-white pl-4 pr-2 py-2",
};

const TRIGGER_TEXT_CLASS: Record<DropdownVariant, string> = {
  default: "text-subtitle-2 text-gray-900",
  muted: "text-caption-2 text-gray-600",
  field: "text-body-1 text-gray-900",
};

const LIST_SHAPE_CLASS: Record<DropdownVariant, string> = {
  default: "right-0 w-28",
  muted: "right-0 w-28",
  field: "left-0 w-full",
};

const LIST_ITEM_TEXT_CLASS: Record<DropdownVariant, string> = {
  default: "text-caption-1",
  muted: "text-caption-1",
  field: "text-body-1",
};

export default function Dropdown({
  options,
  value,
  onChange,
  variant = "default",
  hideSelectedFromList = true,
  placeholder,
  label,
  className = "",
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.key === value);
  const listOptions = hideSelectedFromList
    ? options.filter((o) => o.key !== value)
    : options;
  const isField = variant === "field";

  return (
    <div className={`relative ${isField ? "w-full" : "inline-block"} ${className}`}>
      {label && (
        <label className="mb-2 ml-0.5 block text-title-3 text-gray-900">
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center ${isField ? "justify-between gap-2" : "gap-1"} ${TRIGGER_SHAPE_CLASS[variant]} ${
          selected
            ? TRIGGER_TEXT_CLASS[variant]
            : isField
              ? "text-body-1 text-gray-400"
              : TRIGGER_TEXT_CLASS[variant]
        }`}
      >
        <span className={isField ? "truncate text-left" : undefined}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDownIcon
          className={`${isField ? "h-6 w-6" : "h-3.5 w-3.5"} shrink-0 text-gray-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <ul
            className={`absolute top-full z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg ${LIST_SHAPE_CLASS[variant]}`}
          >
            {listOptions.map((option) => (
              <li key={option.key}>
                <button
                  type="button"
                  disabled={option.disabled}
                  onClick={() => {
                    onChange(option.key);
                    setOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left active:bg-gray-30 ${LIST_ITEM_TEXT_CLASS[variant]} ${
                    option.key === value
                      ? "text-primary-500"
                      : option.disabled
                        ? "text-gray-200"
                        : "text-gray-600"
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
