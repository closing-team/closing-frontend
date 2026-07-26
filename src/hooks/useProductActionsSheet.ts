import { useState } from "react";
import {
  useDeleteProductMutation,
  useUpdateProductStatusMutation,
} from "./useProductMutations";
import type { SaleStatus } from "../types/used";

export function useProductActionsSheet() {
  const updateStatus = useUpdateProductStatusMutation();
  const deleteProduct = useDeleteProductMutation();
  const [menuProductId, setMenuProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const openMenu = (productId: number) => setMenuProductId(productId);
  const closeMenu = () => setMenuProductId(null);

  const changeStatus = (status: Extract<SaleStatus, "reserved" | "completed">) => {
    if (menuProductId === null) return;
    updateStatus.mutate({ productId: menuProductId, status });
    closeMenu();
  };

  const requestDelete = () => {
    if (menuProductId === null) return;
    setDeleteProductId(menuProductId);
    closeMenu();
  };

  const cancelDelete = () => setDeleteProductId(null);

  const confirmDelete = (onDeleted?: (productId: number) => void) => {
    if (deleteProductId === null) return;
    deleteProduct.mutate(deleteProductId);
    onDeleted?.(deleteProductId);
    setDeleteProductId(null);
  };

  return {
    menuProductId,
    deleteProductId,
    openMenu,
    closeMenu,
    changeStatus,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
