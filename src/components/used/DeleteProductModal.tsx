import Button from "../common/Button";
import { TrashIcon } from "../../assets/icons";

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

      <div className="relative flex w-full max-w-[343px] flex-col overflow-hidden rounded-xl bg-white">
        <div className="flex flex-col items-center gap-4 pb-3 pl-4 pr-3 pt-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-warning-50 p-1">
            <TrashIcon className="h-5 w-5 text-warning-400" />
          </div>

          <div className="flex flex-col items-center gap-2">
            <p className="text-title-2 text-gray-900">
              이 물품을 삭제할까요?
            </p>
            <p className="whitespace-pre-line text-center text-body-2 text-gray-900">
              {"삭제하면 판매 목록에서 사라지며,\n물품 정보는 복구할 수 없습니다."}
            </p>
          </div>
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
