import type { ReactNode } from "react";
import { CheckIcon } from "../../assets/icons";

type SectionCardSize = "default" | "compact";
type SectionCardTone = "default" | "highlighted";

interface SectionCardProps {
  title: string;
  children?: ReactNode;
  size?: SectionCardSize;
  tone?: SectionCardTone;
}

const CONTAINER_CLASS: Record<SectionCardSize, string> = {
  default: "gap-3 rounded-xl",
  compact: "gap-1 rounded-lg",
};

const TONE_CLASS: Record<SectionCardTone, string> = {
  default: "bg-white",
  highlighted: "border border-primary-500 bg-primary-50",
};

const TITLE_CLASS: Record<SectionCardSize, string> = {
  default: "text-title-3 text-gray-900",
  compact: "text-subtitle-2 text-gray-900",
};

const BODY_CLASS: Record<SectionCardSize, string> = {
  default: "text-body-3 text-gray-500",
  compact: "text-body-3 text-gray-700",
};

export default function SectionCard({
  title,
  children,
  size = "default",
  tone = "default",
}: SectionCardProps) {
  return (
    <div
      className={`flex w-full flex-col p-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)] ${CONTAINER_CLASS[size]} ${TONE_CLASS[tone]}`}
    >
      <div className="flex items-center gap-0.5">
        <CheckIcon className="h-6 w-6 shrink-0 text-primary-500" />
        <p className={TITLE_CLASS[size]}>{title}</p>
      </div>
      {children && <div className={BODY_CLASS[size]}>{children}</div>}
    </div>
  );
}
