import ProductStatusSheet from "./ProductStatusSheet";
import DeleteProductModal from "./DeleteProductModal";
import type { SaleStatus } from "../../types/used";

interface ProductActionSheetsProps {
  menuOpen: boolean;
  currentStatus: SaleStatus;
  deleteOpen: boolean;
  onChangeStatus: (status: SaleStatus) => void;
  onEdit: () => void;
  onRequestDelete: () => void;
  onCloseMenu: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export default function ProductActionSheets({
  menuOpen,
  currentStatus,
  deleteOpen,
  onChangeStatus,
  onEdit,
  onRequestDelete,
  onCloseMenu,
  onCancelDelete,
  onConfirmDelete,
}: ProductActionSheetsProps) {
  return (
    <>
      {menuOpen && (
        <ProductStatusSheet
          currentStatus={currentStatus}
          onChangeStatus={onChangeStatus}
          onEdit={onEdit}
          onDelete={onRequestDelete}
          onClose={onCloseMenu}
        />
      )}

      {deleteOpen && (
        <DeleteProductModal onCancel={onCancelDelete} onConfirm={onConfirmDelete} />
      )}
    </>
  );
}
