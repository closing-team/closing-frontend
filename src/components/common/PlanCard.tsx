import type { ReactNode } from "react";
import { ChevronRightIcon } from "../../assets/icons";
import { formatDate, formatTime } from "../../utils/dateFormat";
import type { TimeValue } from "./TimeWheel";

export interface Plan {
  id: number;
  title: string;
  startDate: Date;
  startTime: TimeValue;
  endDate: Date;
  endTime: TimeValue;
}

function DateBadge({
  children,
  bg,
}: {
  children: ReactNode;
  bg: "white" | "gray-30";
}) {
  return (
    <span
      className={`rounded-md px-2 py-1 text-caption-3 text-gray-400 ${bg === "white" ? "bg-white" : "bg-gray-30"}`}
    >
      {children}
    </span>
  );
}

interface PlanDateRangeProps {
  plan: Plan;
  badgeBg?: "white" | "gray-30"; // 카드 배경이 white면 gray-30, 카드 배경이 gray-30이면 white로 대비를 줌
  indent?: boolean; // 불릿(8px)+간격(8px)만큼 들여쓰기 — 제목이 불릿 옆에 있는 PlanCard 전용
  className?: string;
}

// 일정 카드의 날짜/시간 뱃지 줄 — PlanCard와 GeneratedPlanCard가 공유
export function PlanDateRange({
  plan,
  badgeBg = "gray-30",
  indent = false,
  className = "",
}: PlanDateRangeProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 ${indent ? "pl-4" : ""} ${className}`}
    >
      <DateBadge bg={badgeBg}>{formatDate(plan.startDate)}</DateBadge>
      <DateBadge bg={badgeBg}>{formatTime(plan.startTime)}</DateBadge>
      <span className="h-px w-1 shrink-0 bg-gray-500" />
      <DateBadge bg={badgeBg}>{formatDate(plan.endDate)}</DateBadge>
      <DateBadge bg={badgeBg}>{formatTime(plan.endTime)}</DateBadge>
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  onClick?: (id: number) => void;
}

// 일정 카드 — 저장된 일정 목록에서 사용 (탭하면 상세 이동)
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
