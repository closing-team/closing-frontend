import ConfirmModal from "../common/ConfirmModal";
import { PlanDateRange } from "../common/PlanCard";
import type { Plan } from "../common/PlanCard";

interface DeleteConfirmModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export default function DeleteConfirmModal({
  plan,
  onCancel,
  onConfirm,
  isPending = false,
}: DeleteConfirmModalProps) {
  return (
    <ConfirmModal
      title="일정을 완전히 삭제할까요?"
      confirmLabel="삭제"
      confirmDisabled={isPending}
      onCancel={onCancel}
      onConfirm={onConfirm}
    >
      <div className="px-4 pb-6">
        <div className="flex items-center rounded-[6px] bg-gray-30 py-[10px] pl-4 pr-4">
          <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
          <div className="ml-3 flex flex-1 flex-col">
            <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
            <PlanDateRange plan={plan} badgeBg="white" className="mt-0.5" />
          </div>
        </div>
      </div>
    </ConfirmModal>
  );
}
