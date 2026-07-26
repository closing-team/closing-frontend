import ProductStatusSheet from "./ProductStatusSheet";
import DeleteProductModal from "./DeleteProductModal";

interface ProductActionSheetsProps {
  menuOpen: boolean;
  deleteOpen: boolean;
  onChangeToReserved: () => void;
  onChangeToCompleted: () => void;
  onRequestDelete: () => void;
  onCloseMenu: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}

export default function ProductActionSheets({
  menuOpen,
  deleteOpen,
  onChangeToReserved,
  onChangeToCompleted,
  onRequestDelete,
  onCloseMenu,
  onCancelDelete,
  onConfirmDelete,
}: ProductActionSheetsProps) {
  return (
    <>
      {menuOpen && (
        <ProductStatusSheet
          onChangeToReserved={onChangeToReserved}
          onChangeToCompleted={onChangeToCompleted}
          onEdit={onCloseMenu}
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
