import ProductStatusSheet from "./ProductStatusSheet";
import DeleteProductModal from "./DeleteProductModal";

interface ProductActionSheetsProps {
  menuOpen: boolean;
  deleteOpen: boolean;
  onChangeToReserved: () => void;
  onChangeToCompleted: () => void;
  onEdit: () => void;
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
          onChangeToReserved={onChangeToReserved}
          onChangeToCompleted={onChangeToCompleted}
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
