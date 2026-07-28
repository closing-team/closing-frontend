import type { ReactNode } from "react";
import ConfirmModal from "../common/ConfirmModal";
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
    <ConfirmModal
      title="일정을 완전히 삭제할까요?"
      confirmLabel="삭제"
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className="px-4 pb-6">
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
    </ConfirmModal>
  );
}
