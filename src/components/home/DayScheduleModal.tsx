import { ChevronRightIcon } from "../../assets/icons";
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
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      <div className="relative flex max-h-[85vh] w-full max-w-[343px] flex-col overflow-x-hidden overflow-y-auto rounded-xl bg-white">
        <div className="flex items-center pb-4 pl-4 pr-3 pt-6">
          <p className="text-title-2 text-gray-900">
            {date.getMonth() + 1}월 {date.getDate()}일 일정
          </p>
        </div>

        <div className="flex flex-col gap-2 px-4 py-2">
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
                <PlanDateRange
                  plan={plan}
                  badgeBg="white"
                  size="sm"
                  className="mt-0.5"
                />
              </div>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-400" />
            </button>
          ))}
        </div>

        <div className="p-4">
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