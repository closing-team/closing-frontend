import type { ReactNode } from "react";
import Button from "../common/Button";
import type { Plan } from "../common/PlanCard";
import { formatDate, formatTime } from "../../utils/dateFormat";

interface DeleteConfirmModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: () => void;
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-[4px] bg-white px-1 py-px text-caption-3 text-gray-400">
      {children}
    </span>
  );
}

export default function DeleteConfirmModal({
  plan,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-[343px] rounded-[12px] bg-white">
        {/* 타이틀 */}
        <div className="pt-5 pb-4 text-center">
          <p className="text-title-3 text-gray-900">일정을 완전히 삭제할까요?</p>
        </div>

        {/* 일정 카드 */}
        <div className="mt-3 px-4">
          <div className="flex items-center rounded-[6px] bg-gray-30 py-[10px] pl-4 pr-4">
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
            <div className="ml-3 flex flex-1 flex-col">
              <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                <Chip>{formatDate(plan.startDate)}</Chip>
                <Chip>{formatTime(plan.startTime)}</Chip>
                <span className="h-px w-1 shrink-0 bg-gray-500" />
                <Chip>{formatDate(plan.endDate)}</Chip>
                <Chip>{formatTime(plan.endTime)}</Chip>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="mt-8 flex gap-[10px] px-4 pb-4">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onCancel}>
            취소
          </Button>
          <Button variant="warning" size="lg" className="flex-1" onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
