import type { ReactNode } from "react";

interface BottomSheetProps {
  onClose: () => void;
  closeLabel?: string;
  className?: string;
  children: ReactNode;
}

export default function BottomSheet({
  onClose,
  closeLabel = "닫기",
  className = "",
  children,
}: BottomSheetProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label={closeLabel}
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div
        className={`relative flex max-h-[85vh] w-full max-w-app min-w-[var(--container-app-min)] flex-col overflow-y-auto rounded-t-[20px] bg-white px-4 pb-5 pt-2 ${className}`}
      >
        <div className="flex h-4 items-center justify-center">
          <span className="h-1 w-[41px] shrink-0 rounded-[2.5px] bg-gray-200" />
        </div>

        {children}
      </div>
    </div>
  );
}
