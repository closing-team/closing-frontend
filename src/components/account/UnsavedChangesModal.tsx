import Button from "../common/Button";

interface UnsavedChangesModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function UnsavedChangesModal({
  onCancel,
  onConfirm,
}: UnsavedChangesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-[343px] rounded-xl bg-white">
        <p className="whitespace-pre-line px-6 pb-6 pt-8 text-center text-title-3 text-gray-900">
          {"변경사항을 저장하지 않고\n나가시겠어요?"}
        </p>
        <div className="flex gap-[10px] px-4 pb-5">
          <Button variant="secondary" size="lg" fullWidth onClick={onCancel}>
            취소
          </Button>
          <Button variant="warning" size="lg" fullWidth onClick={onConfirm}>
            나가기
          </Button>
        </div>
      </div>
    </div>
  );
}
