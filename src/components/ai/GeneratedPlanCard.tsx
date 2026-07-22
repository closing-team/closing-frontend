import { CalendarIcon, PencilIcon, TrashIcon } from "../../assets/icons";
import { PlanDateRange } from "../common/PlanCard";
import type { Plan } from "../common/PlanCard";

interface GeneratedPlanCardProps {
  plan: Plan;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function GeneratedPlanCard({
  plan,
  onEdit,
  onDelete,
}: GeneratedPlanCardProps) {
  return (
    <div className="flex w-full flex-col rounded-lg border border-gray-100 bg-white pb-4 pl-4 pr-3 pt-3">
      <div className="flex items-center justify-between">
        <span className="flex h-6 w-6 items-center justify-center text-gray-200">
          <CalendarIcon className="h-5 w-5" />
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="수정"
            onClick={() => onEdit?.(plan.id)}
            className="flex h-6 w-6 items-center justify-center text-gray-400"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="삭제"
            onClick={() => onDelete?.(plan.id)}
            className="flex h-6 w-6 items-center justify-center text-warning-400"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <p className="mt-3 text-subtitle-2 text-gray-900">{plan.title}</p>
      <PlanDateRange plan={plan} className="mt-1" />
    </div>
  );
}
