import { useState } from "react";
import DateRangeField from "./DateRangeField";
import TimeRangeField from "./TimeRangeField";
import type { TimeValue } from "./TimeWheel";
import { combineDateAndTime } from "../../utils/dateFormat";
import { XCircleIcon } from "../../assets/icons";

interface ScheduleRangeFieldProps {
  startLabel: string;
  endLabel: string;
  startDate: Date;
  endDate: Date;
  startTime: TimeValue;
  endTime: TimeValue;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  onStartTimeChange: (value: TimeValue) => void;
  onEndTimeChange: (value: TimeValue) => void;
  className?: string;
}

export default function ScheduleRangeField({
  startLabel,
  endLabel,
  startDate,
  endDate,
  startTime,
  endTime,
  onStartDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  className = "",
}: ScheduleRangeFieldProps) {
  const isInvalid =
    combineDateAndTime(endDate, endTime) <=
    combineDateAndTime(startDate, startTime);

  type ActiveField = "startDate" | "endDate" | "startTime" | "endTime" | null;
  const [active, setActive] = useState<ActiveField>(null);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <DateRangeField
        startLabel={startLabel}
        endLabel={endLabel}
        startValue={startDate}
        endValue={endDate}
        onStartChange={onStartDateChange}
        onEndChange={onEndDateChange}
        error={isInvalid}
        muted={active === "startTime" || active === "endTime"}
        active={
          active === "startDate" ? "start" : active === "endDate" ? "end" : null
        }
        onActiveChange={(next) =>
          setActive(
            next === "start" ? "startDate" : next === "end" ? "endDate" : null,
          )
        }
      />
      <TimeRangeField
        startValue={startTime}
        endValue={endTime}
        onStartChange={onStartTimeChange}
        onEndChange={onEndTimeChange}
        showSeparator={false}
        error={isInvalid}
        muted={active === "startDate" || active === "endDate"}
        active={
          active === "startTime" ? "start" : active === "endTime" ? "end" : null
        }
        onActiveChange={(next) =>
          setActive(
            next === "start" ? "startTime" : next === "end" ? "endTime" : null,
          )
        }
      />
      {isInvalid && (
        <p className="flex items-center gap-2 text-caption-2 text-warning-500">
          <XCircleIcon className="h-5 w-5 shrink-0" />
          종료 일시는 시작 일시보다 늦어야 해요.
        </p>
      )}
    </div>
  );
}
