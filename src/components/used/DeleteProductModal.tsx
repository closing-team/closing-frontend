import Button from "../common/Button";

interface DeleteProductModalProps {
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteProductModal({
  onCancel,
  onConfirm,
}: DeleteProductModalProps) {
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
          <p className="text-center text-title-3 text-gray-900">
            이 물품을 삭제할까요?
          </p>
          <p className="whitespace-pre-line text-center text-body-2 text-gray-900">
            {"삭제하면 판매 목록에서 사라지며,\n물품 정보는 복구할 수 없습니다."}
          </p>
        </div>

        <div className="flex gap-2.5 p-4">
          <Button variant="secondary" fullWidth onClick={onCancel}>
            취소
          </Button>
          <Button variant="warning" fullWidth onClick={onConfirm}>
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
