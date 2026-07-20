import { cloneElement, isValidElement } from "react";
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "text" | "warning";
type ButtonSize = "lg" | "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-500 text-white active:opacity-90 disabled:bg-gray-100 disabled:text-gray-400",
  secondary:
    "bg-white text-gray-900 border border-gray-200 active:bg-gray-30 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent",
  text: "bg-transparent text-primary-500 active:opacity-70 disabled:text-gray-400",
  warning:
    "bg-warning-50 text-warning-500 border border-warning-500 active:opacity-90 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  lg: "h-[52px] rounded-lg px-2.5 text-title-3",
  md: "h-11 rounded-md px-2.5 text-subtitle-2",
  sm: "rounded-md px-2.5 py-2 text-caption-1",
};

function sizeIcon(icon: ReactNode): ReactNode {
  if (!isValidElement(icon)) return icon;
  return cloneElement(icon as ReactElement<{ className?: string }>, {
    className: "h-6 w-6 shrink-0",
  });
}

export default function Button({
  variant = "primary",
  size = "lg",
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center ${SIZE_CLASS[size]} ${VARIANT_CLASS[variant]} ${
        fullWidth ? "w-full" : ""
      } ${className}`}
      {...rest}
    >
      {sizeIcon(leftIcon)}
      {children}
      {sizeIcon(rightIcon)}
    </button>
  );
}
