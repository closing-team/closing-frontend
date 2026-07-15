import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
}

export default function IconButton({
  icon,
  label,
  className = "",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center gap-1 rounded-lg bg-gray-30 px-2.5 py-2 active:opacity-70 disabled:bg-gray-100 ${className}`}
      {...rest}
    >
      <span className="text-gray-500">{icon}</span>
      <span className="text-caption-2 text-gray-900">{label}</span>
    </button>
  );
}
