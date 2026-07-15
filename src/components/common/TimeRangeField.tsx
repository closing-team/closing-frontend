import TimeWheel from "./TimeWheel";
import type { TimeValue } from "./TimeWheel";
import TimeField from "./TimeField";
import { MinusMdIcon } from "../../assets/icons";

interface TimeRangeFieldProps {
  startLabel?: string;
  endLabel?: string;
  startValue: TimeValue;
  endValue: TimeValue;
  onStartChange: (value: TimeValue) => void;
  onEndChange: (value: TimeValue) => void;
  showSeparator?: boolean;
  error?: boolean;
  muted?: boolean;
  active: "start" | "end" | null;
  onActiveChange: (active: "start" | "end" | null) => void;
  className?: string;
}

export default function TimeRangeField({
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  showSeparator = true,
  error,
  muted = false,
  active,
  onActiveChange,
  className = "",
}: TimeRangeFieldProps) {
  return (
    <div className={className}>
      <div className="flex items-end gap-2">
        <TimeField
          label={startLabel}
          value={startValue}
          active={active === "start"}
          muted={muted || active === "end"}
          compact
          onClick={() => onActiveChange(active === "start" ? null : "start")}
          className="min-w-0 flex-1"
        />
        <span
          className={`flex h-[52px] shrink-0 items-center justify-center px-0.5 text-gray-400 ${showSeparator ? "" : "invisible"}`}
        >
          <MinusMdIcon className="h-3 w-3" />
        </span>
        <TimeField
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
          <TimeWheel
            value={active === "start" ? startValue : endValue}
            onChange={active === "start" ? onStartChange : onEndChange}
            className="relative z-20 mt-2 w-full border border-gray-100"
          />
        </>
      )}
    </div>
  );
}
