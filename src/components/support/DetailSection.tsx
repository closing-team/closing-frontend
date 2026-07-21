import type { ReactNode } from "react";

interface DetailSectionProps {
  title: string;
  children?: ReactNode;
}

export default function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-subtitle-2 text-gray-900">{title}</p>
      <div className="text-body-2 text-gray-900">{children}</div>
    </div>
  );
}
