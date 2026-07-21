import DateCalendar from "./DateCalendar";
import DateField from "./DateField";
import { MinusMdIcon } from "../../assets/icons";

interface DateRangeFieldProps {
  startLabel?: string;
  endLabel?: string;
  startValue: Date;
  endValue: Date;
  onStartChange: (date: Date) => void;
  onEndChange: (date: Date) => void;
  error?: boolean;
  muted?: boolean;
  active: "start" | "end" | null;
  onActiveChange: (active: "start" | "end" | null) => void;
  className?: string;
}

export default function DateRangeField({
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  error,
  muted = false,
  active,
  onActiveChange,
  className = "",
}: DateRangeFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-end gap-2">
        <DateField
          label={startLabel}
          value={startValue}
          active={active === "start"}
          muted={muted || active === "end"}
          compact
          onClick={() => onActiveChange(active === "start" ? null : "start")}
          className="min-w-0 flex-1"
        />
        <span className="flex h-[52px] shrink-0 items-center justify-center px-0.5 text-gray-400">
          <MinusMdIcon className="h-3 w-3" />
        </span>
        <DateField
          label={endLabel}
          value={endValue}
          active={active === "end"}
          muted={muted || active === "start"}
          error={error}
          compact
          onClick={() => onActiveChange(active === "end" ? null : "end")}
          className="min-w-0 flex-1"
        />
      </div>
      {active && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => onActiveChange(null)}
          />
          <DateCalendar
            value={active === "start" ? startValue : endValue}
            onChange={(date) => {
              if (active === "start") onStartChange(date);
              else onEndChange(date);
              onActiveChange(null);
            }}
            className="relative z-20 mt-2 w-full"
          />
        </>
      )}
    </div>
  );
}
