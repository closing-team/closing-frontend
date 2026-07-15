import type { ReactNode } from "react";
import { CheckIcon, InformationIcon } from "../../assets/icons";

interface CalloutProps {
  title: string;
  children?: ReactNode;
  className?: string;
}

export default function Callout({
  title,
  children,
  className = "",
}: CalloutProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white pb-4 pl-4 pr-4 pt-3.5 shadow-[0_1px_5px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-primary-50">
          <InformationIcon className="h-5 w-5 text-primary-400" />
        </span>
        <p className="flex-1 text-caption-1 text-gray-900">{title}</p>
      </div>
      {children && <div className="mt-1 space-y-0.5">{children}</div>}
    </div>
  );
}

// 콜아웃 내부 체크 항목 한 줄
export function CalloutItem({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-start gap-0.5 text-caption-2 text-gray-500">
      <CheckIcon className="h-5 w-5 shrink-0 text-primary-400" />
      <span>{children}</span>
    </p>
  );
}
