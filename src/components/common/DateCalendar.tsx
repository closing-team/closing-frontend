import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../../assets/icons";

interface DateCalendarProps {
  value?: Date | null;
  onChange: (date: Date) => void;
  className?: string;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DateCalendar({
  value,
  onChange,
  className = "",
}: DateCalendarProps) {
  const [viewDate, setViewDate] = useState(() => value ?? new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const moveMonth = (delta: number) =>
    setViewDate(new Date(year, month + delta, 1));

  return (
    <div
      className={`flex flex-col gap-3 rounded-[10px] border border-gray-200 bg-white px-4 pt-3 pb-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-subtitle-1 text-gray-900">
          {year}.{month + 1}.
        </p>
        <div className="flex items-center rounded-full border border-gray-100">
          <button
            type="button"
            aria-label="이전 달"
            onClick={() => moveMonth(-1)}
            className="p-1 text-gray-500"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <span className="h-3 w-px bg-gray-100" />
          <button
            type="button"
            aria-label="다음 달"
            onClick={() => moveMonth(1)}
            className="p-1 text-gray-500"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div>
        {/* 요일 */}
        <div className="mb-2 grid grid-cols-7 gap-x-3.5">
          {WEEKDAYS.map((day) => (
            <span
              key={day}
              className="py-1 text-center text-caption-2 text-gray-500"
            >
              {day}
            </span>
          ))}
        </div>

        {/* 날짜 */}
        <div className="grid grid-cols-7 gap-x-3.5 gap-y-1">
          {cells.map((day, i) => {
            if (day === null) return <span key={`empty-${i}`} />;
            const date = new Date(year, month, day);
            const selected = !!value && isSameDay(date, value);
            return (
              <button
                key={day}
                type="button"
                onClick={() => onChange(date)}
                className="flex justify-center"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-caption-1 ${
                    selected
                      ? "bg-primary-500 font-semibold text-white"
                      : "text-gray-900 active:bg-gray-100"
                  }`}
                >
                  {day}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
