import type { ReactNode } from "react";
import { CheckIcon } from "../../assets/icons";

interface UtilityItemCardProps {
  title: string;
  children?: ReactNode;
}

export default function UtilityItemCard({
  title,
  children,
}: UtilityItemCardProps) {
  return (
    <div className="flex w-full flex-col gap-1 rounded-lg border border-gray-100 bg-gray-5 px-3 py-3.5">
      <div className="flex items-center gap-0.5">
        <CheckIcon className="h-6 w-6 shrink-0 text-primary-500" />
        <p className="flex-1 text-subtitle-2 text-gray-900">{title}</p>
      </div>
      {children && <p className="text-body-3 text-gray-500">{children}</p>}
    </div>
  );
}
