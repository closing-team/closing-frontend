import ConfirmModal from "../common/ConfirmModal";
import type { Plan } from "../common/PlanCard";
import { formatDate, formatTime } from "../../utils/dateFormat";

interface DeletePlanModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function DeletePlanModal({
  plan,
  onCancel,
  onConfirm,
  isPending = false,
}: DeletePlanModalProps) {
  return (
    <ConfirmModal
      title="일정을 완전히 삭제할까요?"
      confirmLabel="삭제"
      cancelClassName="text-primary-500"
      confirmDisabled={isPending}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className="px-4 pb-6">
        <div className="flex items-center gap-2 rounded-md bg-gray-30 px-4 pb-2.5 pt-2.5">
          <span className="h-2 w-2 shrink-0 self-center rounded-full bg-orange-300" />
          <div className="flex flex-col">
            <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
            <div className="mt-0.5 flex items-center gap-0.5">
              <span className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-caption-3 text-gray-400">
                {formatDate(plan.startDate)}
              </span>
              <span className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-caption-3 text-gray-400">
                {formatTime(plan.startTime)}
              </span>
              <span className="mx-0.5 h-[0.75px] w-1 shrink-0 bg-gray-500" />
              <span className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-caption-3 text-gray-400">
                {formatDate(plan.endDate)}
              </span>
              <span className="whitespace-nowrap rounded-md bg-white px-2 py-1 text-caption-3 text-gray-400">
                {formatTime(plan.endTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </ConfirmModal>
  );
}
