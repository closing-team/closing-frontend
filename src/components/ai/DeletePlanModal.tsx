import Button from "../common/Button";
import type { Plan } from "../common/PlanCard";
import { formatDate, formatTime } from "../../utils/dateFormat";

interface DeletePlanModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeletePlanModal({
  plan,
  onCancel,
  onConfirm,
}: DeletePlanModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative flex max-h-[85vh] w-full max-w-[343px] flex-col overflow-x-hidden overflow-y-auto rounded-xl bg-white">
        {/* Title: center, pt-20, pb-16 → total 60px */}
        <p className="px-4 pt-5 pb-4 text-center text-title-3 text-gray-900">
          일정을 완전히 삭제할까요?
        </p>

        {/* Plan card: mt-12 from title */}
        <div className="mt-3 px-4">
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

        {/* Buttons: mt-12, pt-20, pb-16 → total 88px */}
        <div className="mt-3 flex gap-[10px] px-4 pt-5 pb-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            className="text-primary-500"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button variant="warning" size="lg" fullWidth onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
