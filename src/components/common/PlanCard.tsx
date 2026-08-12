import type { ReactNode } from "react";
import { ChevronRightIcon } from "../../assets/icons";
import { formatDate, formatTime } from "../../utils/dateFormat";
import type { TimeValue } from "./TimeWheel";

export interface Plan {
  id: string | number;
  title: string;
  startDate: Date;
  startTime: TimeValue;
  endDate: Date;
  endTime: TimeValue;
  memo?: string;
}

type PlanDateRangeSize = "sm" | "md";

const BADGE_CLASS: Record<PlanDateRangeSize, string> = {
  sm: "rounded-[4px] px-1 py-px",
  md: "rounded-md px-2 py-1",
};

const PAIR_GAP_CLASS: Record<PlanDateRangeSize, string> = {
  sm: "gap-0.5",
  md: "gap-1.5",
};

function DateBadge({
  children,
  bg,
  size,
}: {
  children: ReactNode;
  bg: "white" | "gray-30";
  size: PlanDateRangeSize;
}) {
  return (
    <span
      className={`text-caption-3 text-gray-400 ${BADGE_CLASS[size]} ${bg === "white" ? "bg-white" : "bg-gray-30"}`}
    >
      {children}
    </span>
  );
}

interface PlanDateRangeProps {
  plan: Plan;
  badgeBg?: "white" | "gray-30";
  size?: PlanDateRangeSize;
  indent?: boolean;
  className?: string;
}

export function PlanDateRange({
  plan,
  badgeBg = "gray-30",
  size = "md",
  indent = false,
  className = "",
}: PlanDateRangeProps) {
  const pairGap = PAIR_GAP_CLASS[size];

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${indent ? "pl-4" : ""} ${className}`}
    >
      <div className={`flex items-center ${pairGap}`}>
        <DateBadge bg={badgeBg} size={size}>
          {formatDate(plan.startDate)}
        </DateBadge>
        <DateBadge bg={badgeBg} size={size}>
          {formatTime(plan.startTime)}
        </DateBadge>
      </div>
      <span className="h-px w-1 shrink-0 bg-gray-500" />
      <div className={`flex items-center ${pairGap}`}>
        <DateBadge bg={badgeBg} size={size}>
          {formatDate(plan.endDate)}
        </DateBadge>
        <DateBadge bg={badgeBg} size={size}>
          {formatTime(plan.endTime)}
        </DateBadge>
      </div>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  onClick?: (id: Plan["id"]) => void;
}

export default function PlanCard({ plan, onClick }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(plan.id)}
      className="flex w-full flex-col rounded-md bg-gray-30 pb-2.5 pl-4 pr-2 pt-2.5 text-left active:opacity-75"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
          <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
        </div>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
      </div>
      <PlanDateRange plan={plan} badgeBg="white" indent className="mt-0.5" />
    </button>
  );
}
