import type { ReactNode } from "react";
import wordmark from "../../assets/images/wordmark.svg";
import { ChevronLeftIcon } from "../../assets/icons";

interface TopBarProps {
  logo?: boolean;
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  bordered?: boolean;
  className?: string;
}

export default function TopBar({
  logo,
  title,
  onBack,
  right,
  bordered = true,
  className = "",
}: TopBarProps) {
  const paddingClass = onBack ? "px-1.5" : right ? "pl-4 pr-2" : "px-4";

  return (
    <header
      className={`sticky top-0 z-40 flex h-14 items-center gap-2 bg-white ${paddingClass} ${
        bordered ? "border-b border-gray-100" : ""
      } ${className}`}
    >
      {onBack && (
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={onBack}
          className="p-1 text-gray-900"
        >
          <ChevronLeftIcon />
        </button>
      )}
      {logo && (
        <img src={wordmark} alt="클로징" className="h-[18px] object-contain" />
      )}
      {title &&
        (onBack ? (
          <h1 className="pointer-events-none absolute inset-x-0 whitespace-nowrap text-center text-title-3 text-gray-900">
            {title}
          </h1>
        ) : (
          <h1 className="text-title-3 text-gray-900">{title}</h1>
        ))}
      {right && <div className="ml-auto flex items-center gap-1">{right}</div>}
    </header>
  );
}
