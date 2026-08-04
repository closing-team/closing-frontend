import ConfirmModal from "../common/ConfirmModal";

interface DeleteProductModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteProductModal({
  onCancel,
  onConfirm,
}: DeleteProductModalProps) {
  return (
    <ConfirmModal
      title="이 물품을 삭제할까요?"
      description={"삭제하면 판매 목록에서 사라지며,\n물품 정보는 복구할 수 없습니다."}
      confirmLabel="삭제"
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  );
}
