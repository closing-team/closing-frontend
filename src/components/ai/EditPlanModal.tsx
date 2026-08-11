import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import TextField from "../common/TextField";
import ScheduleRangeField from "../common/ScheduleRangeField";
import Button from "../common/Button";
import { XMdIcon } from "../../assets/icons";
import type { Plan } from "../common/PlanCard";
import type { TimeValue } from "../common/TimeWheel";

interface EditPlanModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: (updated: Plan, memo?: string) => void;
  isPending?: boolean;
}

export default function EditPlanModal({
  plan,
  onCancel,
  onConfirm,
  isPending = false,
}: EditPlanModalProps) {
  const [title, setTitle] = useState(plan.title);
  const [startDate, setStartDate] = useState<Date>(plan.startDate);
  const [startTime, setStartTime] = useState<TimeValue>(plan.startTime);
  const [endDate, setEndDate] = useState<Date>(plan.endDate);
  const [endTime, setEndTime] = useState<TimeValue>(plan.endTime);
  const [memo, setMemo] = useState(plan.memo ?? "");
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const handleMemoInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMemo(e.target.value);
    const ta = memoRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${ta.scrollHeight}px`;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative max-h-[85vh] w-full max-w-[347px] overflow-x-hidden overflow-y-auto rounded-xl bg-white">
        <div className="flex h-[60px] items-center justify-between pl-4 pr-3">
          <p className="text-title-3 text-gray-900">일정 수정</p>
          <button
            type="button"
            aria-label="닫기"
            onClick={onCancel}
            className="flex h-6 w-6 items-center justify-center text-gray-900"
          >
            <XMdIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="px-4">
          <TextField
            label="일정 이름"
            labelSize="subtitle-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 이름을 입력하세요"
          />

          <ScheduleRangeField
            className="mt-5"
            startLabel="일정 시작"
            endLabel="일정 종료"
            startDate={startDate}
            endDate={endDate}
            startTime={startTime}
            endTime={endTime}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onStartTimeChange={setStartTime}
            onEndTimeChange={setEndTime}
          />

          <div className="mt-5">
            <label className="mb-2 block text-subtitle-2 text-gray-900">
              상세 메모
            </label>
            <div className="rounded-lg border border-gray-200 px-4 py-3">
              <textarea
                ref={memoRef}
                value={memo}
                onChange={handleMemoInput}
                placeholder="메모를 입력하세요"
                rows={1}
                className="w-full resize-none text-body-1 text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex h-[100px] items-center gap-2 px-4 pt-8 pb-4">
          <Button
            variant="secondary"
            size="lg"
            fullWidth
            className="text-primary-500"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            disabled={isPending}
            onClick={() =>
              onConfirm(
                { ...plan, title, startDate, startTime, endDate, endTime },
                memo,
              )
            }
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
