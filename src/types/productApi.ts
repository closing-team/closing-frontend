export interface ApiEnvelope<T> {
  success: boolean;
  code: string;
  message: string;
  data: T;
}

export type TradeMethodCode = "DIRECT" | "DELIVERY";

export type ProductSortCode =
  | "LATEST"
  | "POPULAR"
  | "NEAREST"
  | "CHEAPEST"
  | "MOST_EXPENSIVE";

export type ProductStatusCode = "SELLING" | "RESERVED" | "SOLD_OUT";

export interface TradeLocationSummaryDto {
  district: string;
  latitude: number;
  longitude: number;
  distanceKm: number | null;
}

export interface ProductSummaryDto {
  productId: number;
  thumbnailUrl: string;
  title: string;
  price: number;
  tradeMethods: TradeMethodCode[];
  tradeLocation: TradeLocationSummaryDto | null;
  status: ProductStatusCode;
  isBookmarked: boolean;
  createdAt: string;
}

export interface PageInfoDto<TCursor> {
  nextCursor: TCursor | null;
  hasNext: boolean;
}

export interface ProductListDataDto {
  products: ProductSummaryDto[];
  page: PageInfoDto<string>;
}

export interface MyProductSummaryDto extends ProductSummaryDto {
  bookmarkCount: number;
}

export interface MyProductCountsDto {
  total: number;
  selling: number;
  reserved: number;
  soldOut: number;
}

export interface MyProductListDataDto {
  products: MyProductSummaryDto[];
  counts: MyProductCountsDto;
  page: PageInfoDto<number>;
}

export interface BookmarkedProductListDataDto {
  products: ProductSummaryDto[];
  page: PageInfoDto<number>;
}

export interface ProductSellerDto {
  memberId: number;
  nickname: string;
  location: string | null;
}

export interface ProductDetailDto {
  productId: number;
  title: string;
  price: number;
  description: string;
  imageUrls: string[];
  businessCategory: string;
  businessCategoryName: string;
  productCategory: string;
  productCategoryName: string;
  tradeMethods: TradeMethodCode[];
  tradeLocation: TradeLocationSummaryDto | null;
  status: ProductStatusCode;
  isBookmarked: boolean;
  isOwner: boolean;
  seller: ProductSellerDto;
  createdAt: string;
}

export interface GetProductsParams {
  keyword?: string;
  businessCategory?: string;
  productCategory?: string;
  tradeMethods?: TradeMethodCode[];
  nearby?: boolean;
  sort?: ProductSortCode;
  cursor?: string;
  size?: number;
  latitude: number;
  longitude: number;
}

export interface GetMyProductsParams {
  status?: ProductStatusCode;
  cursor?: number;
  size?: number;
}

export interface GetBookmarkedProductsParams {
  cursor?: number;
  size?: number;
  latitude?: number;
  longitude?: number;
}

export interface GetProductDetailParams {
  latitude?: number;
  longitude?: number;
}

export interface CreateProductRequestJson {
  title: string;
  businessCategory: string;
  productCategory: string;
  price: number;
  tradeMethods: TradeMethodCode[];
  tradeLocation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description: string;
}

export interface CreateProductResponseData {
  productId: number;
  status: ProductStatusCode;
  imageUrls: string[];
  createdAt: string;
}

export interface UpdateProductRequestJson {
  title: string;
  businessCategory: string;
  productCategory: string;
  price: number;
  tradeMethods: TradeMethodCode[];
  tradeLocation?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  description: string;
  retainedImages: string[];
}

export interface UpdateProductResponseData {
  productId: number;
  title: string;
  price: number;
  tradeMethods: TradeMethodCode[];
  tradeLocation: string | null;
  latitude: number | null;
  longitude: number | null;
  status: ProductStatusCode;
  imageUrls: string[];
  updatedAt: string;
}

export interface UpdateProductStatusRequest {
  status: ProductStatusCode;
}

export interface UpdateProductStatusResponseData {
  productId: number;
  status: ProductStatusCode;
  updatedAt: string;
}

export interface BookmarkResponseData {
  productId: number;
  isBookmarked: boolean;
}
