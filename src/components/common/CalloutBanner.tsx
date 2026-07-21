import { InformationIcon } from "../../assets/icons";
import Button from "./Button";

interface CalloutBannerProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  className?: string;
}

export default function CalloutBanner({
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: CalloutBannerProps) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-[0_1px_5px_0_rgba(0,0,0,0.03)] ${className}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-primary-50">
          <InformationIcon className="h-5 w-5 text-primary-400" />
        </span>
        <div>
          <p className="text-caption-1 text-gray-900">{title}</p>
          <p className="mt-1 text-caption-2 text-gray-500">{description}</p>
        </div>
      </div>
      <Button size="sm" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
