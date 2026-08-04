import type { ReactNode } from "react";

interface EmptyViewProps {
  icon: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  paddingTop?: string;
  iconGap?: string;
  textGap?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  className?: string;
}

export default function EmptyView({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  paddingTop = "pt-16",
  iconGap = "gap-3",
  textGap = "gap-1",
  titleClassName = "text-title-3 text-gray-700",
  descriptionClassName = "text-body-2 text-gray-700",
  className = "",
}: EmptyViewProps) {
  return (
    <div className={`flex flex-col items-center ${paddingTop} ${className}`}>
      <div className={`flex flex-col items-center ${iconGap}`}>
        <div className="flex h-20 w-20 items-center justify-center">
          {icon}
        </div>
        <div className={`flex flex-col items-center ${textGap} text-center`}>
          <p className={titleClassName}>{title}</p>
          {description && (
            <p className={descriptionClassName}>{description}</p>
          )}
        </div>
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-8 flex items-center justify-center gap-2 rounded-lg bg-primary-500 px-5 py-2 text-title-3 text-white active:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
