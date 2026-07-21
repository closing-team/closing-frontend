import type { ReactNode } from "react";

interface CopyBoxProps {
  children?: ReactNode;
}

export default function CopyBox({ children }: CopyBoxProps) {
  return (
    <div className="flex w-full items-center justify-center rounded-lg bg-gray-30 px-4 py-3.5">
      {children}
    </div>
  );
}
