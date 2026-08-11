import Button from "../common/Button";
import type { SaleStatus } from "../../types/used";

interface ProductStatusSheetProps {
  currentStatus: SaleStatus;
  onChangeStatus: (status: SaleStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ProductStatusSheet({
  currentStatus,
  onChangeStatus,
  onEdit,
  onDelete,
  onClose,
}: ProductStatusSheetProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center">
      <button
        type="button"
        aria-label="바텀시트 닫기"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-app min-w-[var(--container-app-min)] flex-col gap-3 overflow-y-auto rounded-t-[20px] bg-white px-4 pb-5 pt-2">
        <div className="flex h-4 items-center justify-center">
          <span className="h-1 w-[41px] shrink-0 rounded-[2.5px] bg-gray-200" />
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg bg-gray-30">
          {currentStatus === "selling" && (
            <button
              type="button"
              onClick={() => onChangeStatus("reserved")}
              className="flex h-[52px] items-center justify-center gap-2.5 border-b border-gray-100 px-4 py-3 text-center text-subtitle-1 text-gray-700 active:bg-gray-100"
            >
              예약중으로 변경
            </button>
          )}
          {currentStatus === "reserved" && (
            <button
              type="button"
              onClick={() => onChangeStatus("selling")}
              className="flex h-[52px] items-center justify-center gap-2.5 border-b border-gray-100 px-4 py-3 text-center text-subtitle-1 text-gray-700 active:bg-gray-100"
            >
              판매중으로 변경
            </button>
          )}
          {currentStatus !== "completed" && (
            <button
              type="button"
              onClick={() => onChangeStatus("completed")}
              className="flex h-[52px] items-center justify-center gap-2.5 border-b border-gray-100 px-4 py-3 text-center text-subtitle-1 text-gray-700 active:bg-gray-100"
            >
              거래완료로 변경
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="flex h-[52px] items-center justify-center gap-2.5 border-b border-gray-100 px-4 py-3 text-center text-subtitle-1 text-gray-700 active:bg-gray-100"
          >
            판매글 수정
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex h-[52px] items-center justify-center gap-2.5 px-4 py-3 text-center text-subtitle-1 text-warning-500 active:bg-gray-100"
          >
            삭제
          </button>
        </div>

        <Button fullWidth onClick={onClose}>
          닫기
        </Button>
      </div>
    </div>
  );
}
