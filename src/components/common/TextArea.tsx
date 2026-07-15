import { useState } from "react";
import type { TextareaHTMLAttributes } from "react";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  showCount?: boolean;
}

export default function TextArea({
  label,
  showCount = false,
  maxLength,
  className = "",
  value,
  ...rest
}: TextAreaProps) {
  const [focused, setFocused] = useState(false);
  const length = typeof value === "string" ? value.length : 0;

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block px-0.5 text-subtitle-2 text-gray-900">
          {label}
        </label>
      )}
      <div
        className={`flex h-[150px] flex-col items-start justify-between rounded-[10px] border bg-white px-4 py-3.5 ${
          focused ? "border-primary-500" : "border-gray-200"
        }`}
      >
        <textarea
          value={value}
          maxLength={maxLength}
          onFocus={(e) => {
            setFocused(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            rest.onBlur?.(e);
          }}
          className="w-full flex-1 resize-none text-body-1 text-gray-900 outline-none placeholder:text-gray-400 [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-400"
          {...rest}
        />
        {showCount && maxLength && (
          <p className="w-full shrink-0 text-right text-caption-2 text-gray-400">
            {length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
