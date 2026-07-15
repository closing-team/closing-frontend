import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CheckCircleIcon, XCircleIcon, XFilledIcon } from "../../assets/icons";

type LabelSize = "title-3" | "subtitle-2";

const LABEL_SIZE_CLASS: Record<LabelSize, string> = {
  "title-3": "text-title-3",
  "subtitle-2": "text-subtitle-2",
};

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  labelSize?: LabelSize;
  error?: string;
  success?: string;
  onClear?: () => void;
  leftAddon?: ReactNode;
}

export default function TextField({
  label,
  labelSize = "title-3",
  error,
  success,
  onClear,
  leftAddon,
  placeholder = "텍스트를 입력하세요",
  disabled,
  value,
  className = "",
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);

  const border = error
    ? "border-warning-500"
    : focused
      ? "border-primary-500"
      : "border-gray-200";
  const showClear = !!onClear && !!value && !disabled && focused;

  return (
    <div className={`mb-1 ${className}`}>
      {label && (
        <label
          className={`mb-2 ml-0.5 block ${LABEL_SIZE_CLASS[labelSize]} ${disabled ? "text-gray-400" : "text-gray-900"}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {leftAddon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-body-1">
            {leftAddon}
          </span>
        )}
        <input
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className={`h-[52px] w-full rounded-lg border bg-white px-4 py-2 text-body-1 text-gray-900 outline-none placeholder:text-gray-400 disabled:border-transparent disabled:bg-gray-100 disabled:text-gray-400 ${border} ${
            leftAddon ? "pl-9" : ""
          } ${showClear ? "pr-11" : ""}`}
          {...rest}
        />
        {showClear && (
          <button
            type="button"
            aria-label="지우기"
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClear}
            className={`absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center ${error ? "text-warning-300" : focused ? "text-primary-300" : "text-gray-200"}`}
          >
            <XFilledIcon />
          </button>
        )}
      </div>
      <p
        className={`mt-2 flex min-h-[20px] items-center gap-2 text-caption-2 ${
          error ? "text-warning-500" : success ? "text-info-500" : ""
        }`}
      >
        {error && (
          <>
            <XCircleIcon className="h-5 w-5 shrink-0" />
            {error}
          </>
        )}
        {!error && success && (
          <>
            <CheckCircleIcon className="h-5 w-5 shrink-0" />
            {success}
          </>
        )}
      </p>
    </div>
  );
}
