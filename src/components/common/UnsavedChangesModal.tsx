import ConfirmModal from "../common/ConfirmModal";

interface UnsavedChangesModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function UnsavedChangesModal({
  onCancel,
  onConfirm,
}: UnsavedChangesModalProps) {
  return (
    <ConfirmModal
      title={"변경사항을 저장하지 않고\n나가시겠어요?"}
      confirmLabel="나가기"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
