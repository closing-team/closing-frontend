import { useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getBookmarkedProducts,
  getMyProducts,
  getProductDetail,
  getProducts,
} from "../api/product";
import {
  myProductSummaryDtoToProduct,
  productDetailDtoToProduct,
  productSummaryDtoToProduct,
} from "../utils/productAdapter";
import type { GeoLocation } from "../stores/usedStore";
import type {
  MyProductCountsDto,
  ProductSortCode,
  ProductStatusCode,
  TradeMethodCode,
} from "../types/productApi";
import type { UsedFilter, UsedSort } from "../types/used";

const PAGE_SIZE = 20;

const DEFAULT_COUNTS: MyProductCountsDto = {
  total: 0,
  selling: 0,
  reserved: 0,
  soldOut: 0,
};

const FALLBACK_LOCATION: GeoLocation = { lat: 37.6689, lng: 126.7407 };

const SORT_TO_CODE: Record<UsedSort, ProductSortCode> = {
  popular: "POPULAR",
  latest: "LATEST",
  distance: "NEAREST",
  priceLow: "CHEAPEST",
  priceHigh: "MOST_EXPENSIVE",
};

function filterToParams(filter: UsedFilter): {
  nearby?: boolean;
  tradeMethods?: TradeMethodCode[];
} {
  switch (filter) {
    case "nearby":
      return { nearby: true };
    case "parcel":
      return { tradeMethods: ["DELIVERY"] };
    case "direct":
      return { tradeMethods: ["DIRECT"] };
    default:
      return {};
  }
}

export const productKeys = {
  lists: () => ["products", "list"] as const,
  list: (params: unknown) => ["products", "list", params] as const,
  detail: (id: number) => ["products", "detail", id] as const,
  mes: () => ["products", "me"] as const,
  me: (status: ProductStatusCode | undefined) =>
    ["products", "me", status] as const,
  bookmarksAll: () => ["products", "bookmarks"] as const,
  bookmarks: (location: GeoLocation | null) =>
    ["products", "bookmarks", location] as const,
};

interface UseProductListParams {
  keyword?: string;
  businessCategory?: string;
  productCategory?: string;
  filter: UsedFilter;
  sort: UsedSort;
  location: GeoLocation | null;
}

export function useProductListQuery({
  keyword,
  businessCategory,
  productCategory,
  filter,
  sort,
  location,
}: UseProductListParams) {
  const effectiveLocation = location ?? FALLBACK_LOCATION;
  const baseParams = {
    keyword: keyword || undefined,
    businessCategory: businessCategory || undefined,
    productCategory: productCategory || undefined,
    sort: SORT_TO_CODE[sort],
    size: PAGE_SIZE,
    latitude: effectiveLocation.lat,
    longitude: effectiveLocation.lng,
    ...filterToParams(filter),
  };

  const query = useInfiniteQuery({
    queryKey: productKeys.list(baseParams),
    queryFn: ({ pageParam }) =>
      getProducts({ ...baseParams, cursor: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
  });

  const products = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page.products) ?? [])
        .map(productSummaryDtoToProduct)
        // 목록 조회 API는 상태로 걸러주는 파라미터가 없어서, 예약중/거래완료
        // 상품이 그대로 섞여 나온다. 판매중(또는 상태 정보가 없는 경우)만
        // 클라이언트에서 남긴다.
        .filter((product) => product.status !== "reserved" && product.status !== "completed"),
    [query.data],
  );

  return {
    products,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useProductDetailQuery(
  productId: number | undefined,
  location: GeoLocation | null,
) {
  return useQuery({
    queryKey: productKeys.detail(productId ?? -1),
    queryFn: async () => {
      const dto = await getProductDetail(productId!, {
        latitude: location?.lat,
        longitude: location?.lng,
      });
      return productDetailDtoToProduct(dto);
    },
    enabled: productId !== undefined && !Number.isNaN(productId),
  });
}

export function useMyProductsQuery(status?: ProductStatusCode) {
  const query = useInfiniteQuery({
    queryKey: productKeys.me(status),
    queryFn: ({ pageParam }) =>
      getMyProducts({ status, cursor: pageParam, size: PAGE_SIZE }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
  });

  const products = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page.products) ?? []).map(
        myProductSummaryDtoToProduct,
      ),
    [query.data],
  );
  const counts = query.data?.pages[0]?.counts ?? DEFAULT_COUNTS;

  return {
    products,
    counts,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useBookmarkedProductsQuery(location: GeoLocation | null) {
  const query = useInfiniteQuery({
    queryKey: productKeys.bookmarks(location),
    queryFn: ({ pageParam }) =>
      getBookmarkedProducts({
        cursor: pageParam,
        size: PAGE_SIZE,
        latitude: location?.lat,
        longitude: location?.lng,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
  });

  const products = useMemo(
    () =>
      (query.data?.pages.flatMap((page) => page.products) ?? []).map(
        productSummaryDtoToProduct,
      ),
    [query.data],
  );

  return {
    products,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}
