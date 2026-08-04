import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import {
  addProductBookmark,
  createProduct,
  deleteProduct,
  removeProductBookmark,
  updateProduct,
  updateProductStatus,
} from "../api/product";
import {
  saleStatusToStatusCode,
  toCreateProductRequest,
  toUpdateProductRequest,
} from "../utils/productAdapter";
import { productKeys } from "./useProductQueries";
import type { DealType, SaleStatus } from "../types/used";

export interface ProductFormInput {
  title: string;
  industry: string;
  itemCategory: string;
  price: number;
  dealTypes: DealType[];
  description: string;
  tradeLocation?: string;
  lat?: number;
  lng?: number;
}

function useInvalidateProductQueries() {
  const queryClient = useQueryClient();
  return (keys: QueryKey[]) =>
    Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
}

export function useToggleBookmarkMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: ({ productId, liked }: { productId: number; liked: boolean }) =>
      liked ? removeProductBookmark(productId) : addProductBookmark(productId),
    onSuccess: (_data, { productId }) =>
      invalidate([
        productKeys.lists(),
        productKeys.mes(),
        productKeys.bookmarksAll(),
        productKeys.detail(productId),
      ]),
  });
}

export function useCreateProductMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: ({
      input,
      images,
    }: {
      input: ProductFormInput;
      images: File[];
    }) => createProduct(toCreateProductRequest(input), images),
    onSuccess: () => invalidate([productKeys.lists(), productKeys.mes()]),
  });
}

export function useUpdateProductMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: ({
      productId,
      input,
      retainedImages,
      newImages,
    }: {
      productId: number;
      input: ProductFormInput;
      retainedImages: string[];
      newImages: File[];
    }) =>
      updateProduct(
        productId,
        toUpdateProductRequest(input, retainedImages),
        newImages,
      ),
    onSuccess: (_data, { productId }) =>
      invalidate([
        productKeys.lists(),
        productKeys.mes(),
        productKeys.detail(productId),
      ]),
  });
}

export function useUpdateProductStatusMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: ({ productId, status }: { productId: number; status: SaleStatus }) =>
      updateProductStatus(productId, saleStatusToStatusCode(status)),
    onSuccess: (_data, { productId }) =>
      invalidate([
        productKeys.lists(),
        productKeys.mes(),
        productKeys.detail(productId),
      ]),
  });
}

export function useDeleteProductMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: (_data, productId) =>
      invalidate([
        productKeys.lists(),
        productKeys.mes(),
        productKeys.bookmarksAll(),
        productKeys.detail(productId),
      ]),
  });
}
