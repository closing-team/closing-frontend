import type { ReactNode } from "react";
import Button from "./Button";

interface ConfirmModalProps {
  title: string;
  description?: string;
  children?: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  confirmVariant?: "warning" | "primary" | "secondary";
  cancelClassName?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({
  title,
  description,
  children,
  cancelLabel = "취소",
  confirmLabel,
  confirmVariant = "warning",
  cancelClassName,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="닫기"
        onClick={onCancel}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-[343px] flex-col overflow-x-hidden overflow-y-auto rounded-xl bg-white">
        <div className="flex flex-col items-center gap-2 pb-4 pt-6">
          <p className="whitespace-pre-line text-center text-title-3 text-gray-900">
            {title}
          </p>
          {description && (
            <p className="whitespace-pre-line text-center text-body-2 text-gray-900">
              {description}
            </p>
          )}
        </div>

        {children}

        <div className="flex gap-2.5 p-4">
          <Button
            variant="secondary"
            fullWidth
            className={cancelClassName}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} fullWidth onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
