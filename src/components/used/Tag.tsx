import type { ReactNode } from "react";

interface TagProps {
  children: ReactNode;
  className?: string;
}

export default function Tag({ children, className = "" }: TagProps) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-xl bg-primary-50 px-4 py-3 text-subtitle-1 text-gray-900 ${className}`}
    >
      {children}
    </span>
  );
}
