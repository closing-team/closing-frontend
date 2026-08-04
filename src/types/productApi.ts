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
  bookmarked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface PageInfoDto<TCursor> {
  nextCursor: TCursor | null;
  hasNext: boolean;
}

// GET /api/v1/products — 상품 목록 조회 응답
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

// GET /api/v1/products/me — 내 상품 목록 조회 응답
export interface MyProductListDataDto {
  products: MyProductSummaryDto[];
  counts: MyProductCountsDto;
  page: PageInfoDto<number>;
}

// GET /api/v1/products/bookmarks — 찜한 상품 목록 조회 응답
export interface BookmarkedProductListDataDto {
  products: ProductSummaryDto[];
  page: PageInfoDto<number>;
}

export interface ProductSellerDto {
  memberId: number;
  nickname: string;
  location: string | null;
}

// GET /api/v1/products/{productId} — 상품 상세 조회 응답
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
  owner: boolean;
  isOwner: boolean;
  bookmarked: boolean;
  isBookmarked: boolean;
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

// POST /api/v1/products — 상품 등록 요청/응답
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

// PUT /api/v1/products/{productId} — 상품 수정 요청/응답
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

// PATCH /api/v1/products/{productId}/status — 상품 상태 변경 요청/응답
export interface UpdateProductStatusRequestJson {
  status: ProductStatusCode;
}

export interface UpdateProductStatusResponseData {
  productId: number;
  status: ProductStatusCode;
  updatedAt: string;
}

// POST/DELETE /api/v1/products/{productId}/bookmark — 상품 찜 등록/취소 응답
export interface ProductBookmarkResponseData {
  productId: number;
  bookmarked: boolean;
  isBookmarked: boolean;
}
