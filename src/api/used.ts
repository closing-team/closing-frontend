import { api } from "./axios";
import type {
  ApiEnvelope,
  BookmarkResponseData,
  CreateProductRequestJson,
  CreateProductResponseData,
  GetBookmarkedProductsParams,
  GetMyProductsParams,
  GetProductDetailParams,
  GetProductsParams,
  BookmarkedProductListDataDto,
  MyProductListDataDto,
  ProductDetailDto,
  ProductListDataDto,
  UpdateProductStatusResponseData,
} from "../types/productApi";

function buildProductQuery(params: GetProductsParams): URLSearchParams {
  const query = new URLSearchParams();
  if (params.keyword) query.set("keyword", params.keyword);
  if (params.businessCategory) query.set("businessCategory", params.businessCategory);
  if (params.productCategory) query.set("productCategory", params.productCategory);
  for (const method of params.tradeMethods ?? []) {
    query.append("tradeMethods", method);
  }
  if (params.nearby !== undefined) query.set("nearby", String(params.nearby));
  if (params.sort) query.set("sort", params.sort);
  if (params.cursor) query.set("cursor", params.cursor);
  if (params.size !== undefined) query.set("size", String(params.size));
  query.set("latitude", String(params.latitude));
  query.set("longitude", String(params.longitude));
  return query;
}

function toRequestBlob(payload: unknown): Blob {
  return new Blob([JSON.stringify(payload)], { type: "application/json" });
}

export async function getProducts(
  params: GetProductsParams,
): Promise<ProductListDataDto> {
  const res = await api.get<ApiEnvelope<ProductListDataDto>>("/api/v1/products", {
    params: buildProductQuery(params),
  });
  return res.data.data;
}

export async function getProductDetail(
  productId: number,
  params: GetProductDetailParams = {},
): Promise<ProductDetailDto> {
  const res = await api.get<ApiEnvelope<ProductDetailDto>>(
    `/api/v1/products/${productId}`,
    { params },
  );
  return res.data.data;
}

export async function createProduct(
  request: CreateProductRequestJson,
  images: File[],
): Promise<CreateProductResponseData> {
  const formData = new FormData();
  formData.append("request", toRequestBlob(request));
  for (const image of images) {
    formData.append("images", image);
  }
  const res = await api.post<ApiEnvelope<CreateProductResponseData>>(
    "/api/v1/products",
    formData,
  );
  return res.data.data;
}

export async function deleteProduct(productId: number): Promise<void> {
  await api.delete<ApiEnvelope<undefined>>(`/api/v1/products/${productId}`);
}

export async function updateProductStatus(
  productId: number,
  status: UpdateProductStatusResponseData["status"],
): Promise<UpdateProductStatusResponseData> {
  const res = await api.patch<ApiEnvelope<UpdateProductStatusResponseData>>(
    `/api/v1/products/${productId}/status`,
    { status },
  );
  return res.data.data;
}

export async function getMyProducts(
  params: GetMyProductsParams,
): Promise<MyProductListDataDto> {
  const res = await api.get<ApiEnvelope<MyProductListDataDto>>(
    "/api/v1/products/me",
    { params },
  );
  return res.data.data;
}

export async function addBookmark(
  productId: number,
): Promise<BookmarkResponseData> {
  const res = await api.post<ApiEnvelope<BookmarkResponseData>>(
    `/api/v1/products/${productId}/bookmark`,
  );
  return res.data.data;
}

export async function removeBookmark(
  productId: number,
): Promise<BookmarkResponseData> {
  const res = await api.delete<ApiEnvelope<BookmarkResponseData>>(
    `/api/v1/products/${productId}/bookmark`,
  );
  return res.data.data;
}

export async function getBookmarkedProducts(
  params: GetBookmarkedProductsParams,
): Promise<BookmarkedProductListDataDto> {
  const res = await api.get<ApiEnvelope<BookmarkedProductListDataDto>>(
    "/api/v1/products/bookmarks",
    { params },
  );
  return res.data.data;
}
