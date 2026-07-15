import type { ReactNode } from "react";
import Wordmark from "../../assets/images/wordmark.svg";
import { ChevronLeftIcon } from "../../assets/icons";

interface TopBarProps {
  logo?: boolean;
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  className?: string;
}

export default function TopBar({
  logo,
  title,
  onBack,
  right,
  className = "",
}: TopBarProps) {
  const paddingClass = onBack ? "px-1.5" : right ? "pl-4 pr-2" : "px-4";

  return (
    <header
      className={`relative flex h-14 items-center gap-2 bg-white ${paddingClass} ${
        logo ? "" : "border-b border-gray-100"
      } ${className}`}
    >
      {onBack && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
          className="-ml-1 p-1 text-gray-900"
        >
          <ChevronLeftIcon />
        </button>
      )}
      {logo && (
        <img src={Wordmark} alt="클로징" className="h-[18px] object-contain" />
      )}
      {title &&
        (onBack ? (
          <h1 className="absolute left-1/2 -translate-x-1/2 text-title-3 text-gray-900">
            {title}
          </h1>
        ) : (
          <h1 className="text-title-3 text-gray-900">{title}</h1>
        ))}
      {right && <div className="ml-auto flex items-center gap-1">{right}</div>}
    </header>
  );
}
