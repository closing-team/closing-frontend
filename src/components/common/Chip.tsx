import { XMdIcon } from "../../assets/icons";

type ChipVariant = "tag" | "keyword" | "recent" | "badge";

interface ChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  variant?: ChipVariant;
  className?: string;
}

export default function Chip({
  label,
  selected = false,
  onClick,
  onRemove,
  variant = "tag",
  className = "",
}: ChipProps) {
  const sizeClass =
    variant === "badge"
      ? "px-2 py-1 text-caption-1 rounded gap-0.5"
      : variant === "recent"
        ? "h-8 max-w-[250px] px-3 text-body-3 rounded-full gap-1"
        : variant === "keyword"
          ? "h-8 px-3 text-body-3 rounded-full gap-1"
          : "h-8 px-3 text-subtitle-2 rounded-full gap-1";

  const colorClass = selected
    ? "bg-primary-500 text-white"
    : variant === "badge"
      ? "bg-gray-100 text-gray-400"
      : variant === "recent"
        ? "bg-white text-gray-700 border border-gray-200"
        : variant === "keyword"
          ? "bg-white text-gray-700 border border-gray-200"
          : "bg-gray-5 text-gray-500 border border-gray-200";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-w-0 shrink-0 items-center ${sizeClass} ${colorClass} ${onClick ? "active:opacity-80" : "cursor-default"} ${className}`}
    >
      <span className="min-w-0 truncate">{label}</span>
      {onRemove && (
        <span
          role="button"
          aria-label={`${label} 삭제`}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="-mr-1 shrink-0 p-0.5 text-gray-500"
        >
          <XMdIcon className="h-3.5 w-3.5" />
        </span>
      )}
    </button>
  );
}
