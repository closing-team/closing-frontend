import type { ReactNode } from "react";
import {
  RadioButtonEmptyIcon,
  RadioButtonFilledIcon,
} from "../../assets/icons";

interface RadioProps {
  checked: boolean;
  onChange: () => void;
  label?: ReactNode;
  disabled?: boolean;
  className?: string;
}

export default function Radio({
  checked,
  onChange,
  label,
  disabled,
  className = "",
}: RadioProps) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2.5 ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        disabled={disabled}
        onClick={onChange}
        className="flex h-6 w-6 shrink-0 items-center justify-center"
      >
        {checked ? (
          <RadioButtonFilledIcon className="h-6 w-6" />
        ) : (
          <RadioButtonEmptyIcon className="h-6 w-6" />
        )}
      </button>
      {label && <span className="text-body-2 text-gray-900">{label}</span>}
    </label>
  );
}
