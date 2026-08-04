import { useCallback } from "react";
import { useToggleBookmarkMutation } from "./useProductMutations";
import type { Product } from "../types/used";

export function useProductLikeToggle(products: Product[]) {
  const toggleBookmark = useToggleBookmarkMutation();

  return useCallback(
    (id: number) => {
      const product = products.find((p) => p.id === id);
      if (product) toggleBookmark.mutate({ productId: id, liked: product.liked });
    },
    [products, toggleBookmark],
  );
}
