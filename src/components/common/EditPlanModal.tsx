import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import TextField from "./TextField";
import DateField from "./DateField";
import TimeField from "./TimeField";
import DateCalendar from "./DateCalendar";
import TimeWheel from "./TimeWheel";
import Button from "./Button";
import { XMdIcon, MinusMdIcon } from "../../assets/icons";
import type { Plan } from "../ai/PlanCard";
import type { TimeValue } from "./TimeWheel";

interface EditPlanModalProps {
  plan: Plan;
  onCancel: () => void;
  onConfirm: (updated: Plan) => void;
}

type ActivePicker = "startDate" | "endDate" | "startTime" | "endTime" | null;

export default function EditPlanModal({
  plan,
  onCancel,
  onConfirm,
}: EditPlanModalProps) {
  const [title, setTitle] = useState(plan.title);
  const [startDate, setStartDate] = useState<Date>(plan.startDate);
  const [startTime, setStartTime] = useState<TimeValue>(plan.startTime);
  const [endDate, setEndDate] = useState<Date>(plan.endDate);
  const [endTime, setEndTime] = useState<TimeValue>(plan.endTime);
  const [memo, setMemo] = useState("");
  const [activePicker, setActivePicker] = useState<ActivePicker>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const togglePicker = (picker: ActivePicker) => {
    setActivePicker((prev) => (prev === picker ? null : picker));
  };

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
      <div className="relative w-full max-w-[347px] overflow-y-auto rounded-xl bg-white">
        {/* 헤더 */}
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

        {/* 바디 */}
        <div className="px-4">
          {/* 일정 이름 */}
          <TextField
            label="일정 이름"
            labelSize="subtitle-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="일정 이름을 입력하세요"
          />

          {/* 일정 시작 / 일정 종료 */}
          <div className="mt-5 flex flex-col gap-2">
            {/* 라벨 */}
            <div className="flex gap-4">
              <p className="flex-1 text-subtitle-2 text-gray-900">일정 시작</p>
              <p className="flex-1 text-subtitle-2 text-gray-900">일정 종료</p>
            </div>

            {/* 날짜 필드 */}
            <div className="relative flex gap-4">
              <DateField
                value={startDate}
                compact
                active={activePicker === "startDate"}
                onClick={() => togglePicker("startDate")}
                className="flex-1"
              />
              <DateField
                value={endDate}
                compact
                active={activePicker === "endDate"}
                onClick={() => togglePicker("endDate")}
                className="flex-1"
              />
              <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-gray-400">
                <MinusMdIcon className="h-3 w-3" />
              </span>
            </div>

            {/* 날짜 캘린더 */}
            {(activePicker === "startDate" || activePicker === "endDate") && (
              <DateCalendar
                value={activePicker === "startDate" ? startDate : endDate}
                onChange={(date) => {
                  if (activePicker === "startDate") setStartDate(date);
                  else setEndDate(date);
                  setActivePicker(null);
                }}
              />
            )}

            {/* 시간 필드 */}
            <div className="flex gap-4">
              <TimeField
                value={startTime}
                compact
                active={activePicker === "startTime"}
                onClick={() => togglePicker("startTime")}
                className="flex-1"
              />
              <TimeField
                value={endTime}
                compact
                active={activePicker === "endTime"}
                onClick={() => togglePicker("endTime")}
                className="flex-1"
              />
            </div>

            {/* 시간 휠 */}
            {(activePicker === "startTime" || activePicker === "endTime") && (
              <TimeWheel
                value={activePicker === "startTime" ? startTime : endTime}
                onChange={(time) => {
                  if (activePicker === "startTime") setStartTime(time);
                  else setEndTime(time);
                }}
              />
            )}
          </div>

          {/* 상세 메모 */}
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

        {/* 푸터 */}
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
            onClick={() =>
              onConfirm({ ...plan, title, startDate, startTime, endDate, endTime })
            }
          >
            완료
          </Button>
        </div>
      </div>
    </div>
  );
}
