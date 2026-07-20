import { XMdIcon, ChevronRightIcon } from "../../assets/icons";
import Button from "../common/Button";
import type { Plan } from "../llm/PlanCard";
import type { TimeValue } from "../common/TimeWheel";

interface DayScheduleModalProps {
  date: Date;
  plans: Plan[];
  onClose: () => void;
  onAdd: () => void;
}

function formatDate(d: Date) {
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatTime(t: TimeValue) {
  return `${t.meridiem} ${t.hour}:${String(t.minute).padStart(2, "0")}`;
}

export default function DayScheduleModal({
  date,
  plans,
  onClose,
  onAdd,
}: DayScheduleModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[343px] rounded-2xl bg-white">
        {/* 헤더 */}
        <div className="flex h-[60px] items-center justify-between px-4">
          <p className="text-title-3 text-gray-900">
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

        {/* 일정 리스트 */}
        <div className="flex flex-col gap-3 px-4">
          {plans.map((plan) => (
            <button
              key={plan.id}
              type="button"
              className="flex items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
              <div className="flex flex-1 flex-col">
                <p className="text-subtitle-2 text-gray-900">{plan.title}</p>
                <p className="mt-0.5 text-caption-2 text-gray-400">
                  {formatDate(plan.startDate)} {formatTime(plan.startTime)} —{" "}
                  {formatDate(plan.endDate)} {formatTime(plan.endTime)}
                </p>
              </div>
              <ChevronRightIcon className="h-5 w-5 shrink-0 text-gray-300" />
            </button>
          ))}
        </div>

        {/* 새 일정 추가 */}
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
