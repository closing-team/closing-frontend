import { CalendarIcon, ChevronDownIcon } from "../../assets/icons";
import { formatDate } from "../../utils/dateFormat";

interface FieldProps {
  label?: string;
  active?: boolean;
  muted?: boolean;
  error?: boolean;
  compact?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function DateField({
  label,
  value,
  active,
  muted,
  error,
  compact = false,
  onClick,
  className = "",
}: FieldProps & { value: Date | null }) {
  return (
    <div className={className}>
      {label && (
        <p className="mb-2 ml-0.5 text-subtitle-2 text-gray-700">{label}</p>
      )}
      <button
        type="button"
        onClick={onClick}
        className={`flex h-[52px] w-full items-center justify-between rounded-lg border bg-white pl-3 pr-2 ${
          compact ? "text-body-2" : "text-body-1"
        } ${error ? "border-warning-500" : active ? "border-primary-500" : "border-gray-200"}`}
      >
        <span className="flex min-w-0 items-center gap-3">
          <CalendarIcon
            className={`h-6 w-6 shrink-0 ${error ? "text-warning-300" : active ? "text-primary-300" : "text-gray-200"}`}
          />
          <span
            className={`truncate ${muted ? "text-gray-400" : "text-gray-900"}`}
          >
            {value ? formatDate(value) : "날짜 선택"}
          </span>
        </span>
        {!compact && (
          <span className="flex h-8 w-8 shrink-0 items-center justify-center">
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-500 transition-transform ${active ? "rotate-180" : ""}`}
            />
          </span>
        )}
      </button>
    </div>
  );
}
