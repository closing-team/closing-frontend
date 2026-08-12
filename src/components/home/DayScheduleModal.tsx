import { XMdIcon, ChevronRightIcon } from "../../assets/icons";
import Button from "../common/Button";
import { PlanDateRange } from "../common/PlanCard";
import type { Plan } from "../common/PlanCard";

interface DayScheduleModalProps {
  date: Date;
  plans: Plan[];
  onClose: () => void;
  onAdd: () => void;
  onPlanClick: (plan: Plan) => void;
}

export default function DayScheduleModal({
  date,
  plans,
  onClose,
  onAdd,
  onPlanClick,
}: DayScheduleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[85vh] w-full max-w-[343px] flex-col overflow-x-hidden overflow-y-auto rounded-2xl bg-white">
        <div className="flex items-center justify-between px-4 py-[14px]">
          <p className="text-title-2 text-gray-900">
            {date.getMonth() + 1}월 {date.getDate()}일 일정
          </p>
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="text-gray-900"
          >
            <XMdIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-2 flex flex-col gap-2 px-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              onClick={() => onPlanClick(plan)}
              className="flex items-center rounded-[6px] bg-gray-30 py-[10px] pl-4 pr-2 text-left"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
              <div className="ml-3 flex flex-1 flex-col">
                <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
                <PlanDateRange plan={plan} badgeBg="white" className="mt-0.5" />
              </div>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
            </button>
          ))}
        </div>

        <div className="px-4 pt-4 pb-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            className="text-primary-500"
            onClick={onAdd}
          >
            새 일정 추가
          </Button>
        </div>
      </div>
    </div>
  );
}