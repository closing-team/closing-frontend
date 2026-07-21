import type { ReactNode } from "react";

interface OptionBoxProps {
  highlighted?: boolean;
  children?: ReactNode;
}

export default function OptionBox({ highlighted, children }: OptionBoxProps) {
  return (
    <div
      className={`flex w-full flex-col gap-1 rounded-lg border px-3.5 py-4 ${
        highlighted
          ? "border-primary-500 bg-primary-50"
          : "border-gray-200 bg-gray-5"
      }`}
    >
      {children}
    </div>
  );
}
