import type { ReactNode } from "react";

type ToastVariant = "default" | "danger";

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  icon?: ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<ToastVariant, string> = {
  default: "text-white",
  danger: "border border-warning-200 bg-warning-50 text-warning-600",
};

export default function Toast({
  message,
  variant = "default",
  icon,
  className = "",
}: ToastProps) {
  return (
    <div
      className={`flex w-full items-center gap-2 rounded-lg px-4 py-3 text-body-2 ${VARIANT_CLASS[variant]} ${className}`}
      style={variant === "default" ? { backgroundColor: "#48464A" } : undefined}
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
