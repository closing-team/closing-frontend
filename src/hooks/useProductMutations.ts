import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addBookmark,
  createProduct,
  deleteProduct,
  removeBookmark,
  updateProductStatus,
} from "../api/used";
import {
  saleStatusToStatusCode,
  toCreateProductRequest,
} from "../utils/productAdapter";
import type { DealType, SaleStatus } from "../types/used";

interface ProductFormInput {
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

function useInvalidateProducts() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["products"] });
}

export function useToggleBookmarkMutation() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ productId, liked }: { productId: number; liked: boolean }) =>
      liked ? removeBookmark(productId) : addBookmark(productId),
    onSuccess: invalidate,
  });
}

export function useCreateProductMutation() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({
      input,
      images,
    }: {
      input: ProductFormInput;
      images: File[];
    }) => createProduct(toCreateProductRequest(input), images),
    onSuccess: invalidate,
  });
}

export function useUpdateProductStatusMutation() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: ({ productId, status }: { productId: number; status: SaleStatus }) =>
      updateProductStatus(productId, saleStatusToStatusCode(status)),
    onSuccess: invalidate,
  });
}

export function useDeleteProductMutation() {
  const invalidate = useInvalidateProducts();

  return useMutation({
    mutationFn: (productId: number) => deleteProduct(productId),
    onSuccess: invalidate,
  });
}
