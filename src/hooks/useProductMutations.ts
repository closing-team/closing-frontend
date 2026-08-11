import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData, QueryClient, QueryKey } from "@tanstack/react-query";
import {
  addProductBookmark,
  createProduct,
  deleteProduct,
  removeProductBookmark,
  updateProduct,
  updateProductStatus,
  updateSellerLocation,
} from "../api/product";
import {
  saleStatusToStatusCode,
  toCreateProductRequest,
  toUpdateProductRequest,
} from "../utils/productAdapter";
import { productKeys } from "./useProductQueries";
import type { DealType, Product, SaleStatus } from "../types/used";

interface BookmarkableItem {
  productId: number;
  bookmarked: boolean;
  isBookmarked: boolean;
}

interface ProductListPage {
  products: BookmarkableItem[];
}

function isProductListPageData(
  data: unknown,
): data is InfiniteData<ProductListPage> {
  return (
    !!data &&
    typeof data === "object" &&
    Array.isArray((data as { pages?: unknown }).pages)
  );
}

function patchBookmarkFlag(data: unknown, productId: number, liked: boolean): unknown {
  if (!isProductListPageData(data)) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      products: page.products.map((item) =>
        item.productId === productId
          ? { ...item, bookmarked: liked, isBookmarked: liked }
          : item,
      ),
    })),
  };
}

function removeFromBookmarkList(data: unknown, productId: number): unknown {
  if (!isProductListPageData(data)) return data;
  return {
    ...data,
    pages: data.pages.map((page) => ({
      ...page,
      products: page.products.filter((item) => item.productId !== productId),
    })),
  };
}

function snapshotQueries(queryClient: QueryClient, queryKey: QueryKey) {
  return [queryKey, queryClient.getQueriesData({ queryKey })] as const;
}

function restoreSnapshots(
  queryClient: QueryClient,
  snapshots: ReadonlyArray<readonly [QueryKey, [QueryKey, unknown][]]>,
) {
  snapshots.forEach(([, entries]) => {
    entries.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));
  });
}

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
  const queryClient = useQueryClient();
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: ({ productId, liked }: { productId: number; liked: boolean }) =>
      liked ? removeProductBookmark(productId) : addProductBookmark(productId),
    onMutate: async ({ productId, liked }) => {
      const nextLiked = !liked;
      const affectedKeys = [
        productKeys.lists(),
        productKeys.mes(),
        productKeys.bookmarksAll(),
        productKeys.detail(productId),
      ];
      await Promise.all(
        affectedKeys.map((queryKey) => queryClient.cancelQueries({ queryKey })),
      );
      const snapshots = affectedKeys.map((queryKey) =>
        snapshotQueries(queryClient, queryKey),
      );

      queryClient.setQueryData<Product>(productKeys.detail(productId), (current) =>
        current ? { ...current, liked: nextLiked } : current,
      );
      queryClient.setQueriesData({ queryKey: productKeys.lists() }, (data) =>
        patchBookmarkFlag(data, productId, nextLiked),
      );
      queryClient.setQueriesData({ queryKey: productKeys.mes() }, (data) =>
        patchBookmarkFlag(data, productId, nextLiked),
      );
      queryClient.setQueriesData({ queryKey: productKeys.bookmarksAll() }, (data) =>
        nextLiked
          ? patchBookmarkFlag(data, productId, nextLiked)
          : removeFromBookmarkList(data, productId),
      );

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      if (context) restoreSnapshots(queryClient, context.snapshots);
    },
    onSettled: (_data, _error, { productId }) =>
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

export function useUpdateSellerLocationMutation() {
  const invalidate = useInvalidateProductQueries();

  return useMutation({
    mutationFn: updateSellerLocation,
    // 어떤 상품의 상세 캐시가 이 판매자의 것인지 알 수 없어, 캐시된 상세 쿼리
    // 전체(["products", "detail"] 접두사)를 무효화한다.
    onSuccess: () => invalidate([productKeys.mes(), ["products", "detail"]]),
  });
}
