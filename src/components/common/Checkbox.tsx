import type { ReactNode } from "react";
import { CheckboxEmptyIcon, CheckboxFilledIcon } from "../../assets/icons";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Checkbox({
  checked,
  onChange,
  label,
  disabled,
  className = "",
}: CheckboxProps) {
  return (
    <label
      className={`inline-flex items-start gap-3 ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"} ${className}`}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        {checked ? (
          <CheckboxFilledIcon className="h-5 w-5" />
        ) : (
          <CheckboxEmptyIcon className="h-5 w-5" />
        )}
      </button>
      {label && <span className="text-body-1 text-gray-900">{label}</span>}
    </label>
  );
}
