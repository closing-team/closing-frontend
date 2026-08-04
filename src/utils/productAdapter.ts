import type {
  ProductSummaryDto,
  MyProductSummaryDto,
  ProductDetailDto,
  ProductStatusCode,
  TradeMethodCode,
  CreateProductRequestJson,
  UpdateProductRequestJson,
} from "../types/productApi";
import type { DealType, Product, SaleStatus } from "../types/used";
import { formatTimeAgo } from "./timeAgo";
import { toBusinessCategoryCode, toProductCategoryCode } from "./productCategoryMap";

const TRADE_METHOD_TO_DEAL_TYPE: Record<TradeMethodCode, DealType> = {
  DIRECT: "직거래",
  DELIVERY: "택배거래",
};

const DEAL_TYPE_TO_TRADE_METHOD: Record<DealType, TradeMethodCode> = {
  직거래: "DIRECT",
  택배거래: "DELIVERY",
};

const STATUS_CODE_TO_SALE_STATUS: Record<ProductStatusCode, SaleStatus> = {
  SELLING: "selling",
  RESERVED: "reserved",
  SOLD_OUT: "completed",
};

const SALE_STATUS_TO_STATUS_CODE: Record<SaleStatus, ProductStatusCode> = {
  selling: "SELLING",
  reserved: "RESERVED",
  completed: "SOLD_OUT",
};

export function tradeMethodsToDealTypes(methods: TradeMethodCode[]): DealType[] {
  return methods.map((m) => TRADE_METHOD_TO_DEAL_TYPE[m]);
}

export function dealTypesToTradeMethods(dealTypes: DealType[]): TradeMethodCode[] {
  return dealTypes.map((d) => DEAL_TYPE_TO_TRADE_METHOD[d]);
}

export function productSummaryDtoToProduct(dto: ProductSummaryDto): Product {
  return {
    id: dto.productId,
    title: dto.title,
    price: dto.price,
    imageUrl: dto.thumbnailUrl || null,
    dealTypes: tradeMethodsToDealTypes(dto.tradeMethods),
    distanceM: dto.tradeLocation?.distanceKm != null
      ? Math.round(dto.tradeLocation.distanceKm * 1000)
      : 0,
    neighborhood: dto.tradeLocation?.district ?? "",
    lat: dto.tradeLocation?.latitude,
    lng: dto.tradeLocation?.longitude,
    timeAgo: formatTimeAgo(dto.createdAt),
    createdAt: dto.createdAt,
    likes: 0,
    liked: dto.isBookmarked,
    status: STATUS_CODE_TO_SALE_STATUS[dto.status],
  };
}

export function myProductSummaryDtoToProduct(dto: MyProductSummaryDto): Product {
  return {
    ...productSummaryDtoToProduct(dto),
    likes: dto.bookmarkCount,
  };
}

export function productDetailDtoToProduct(dto: ProductDetailDto): Product {
  return {
    id: dto.productId,
    title: dto.title,
    price: dto.price,
    imageUrl: dto.imageUrls[0] ?? null,
    images: dto.imageUrls,
    dealTypes: tradeMethodsToDealTypes(dto.tradeMethods),
    distanceM: dto.tradeLocation?.distanceKm != null
      ? Math.round(dto.tradeLocation.distanceKm * 1000)
      : 0,
    neighborhood: dto.tradeLocation?.district ?? "",
    lat: dto.tradeLocation?.latitude,
    lng: dto.tradeLocation?.longitude,
    timeAgo: formatTimeAgo(dto.createdAt),
    createdAt: dto.createdAt,
    likes: 0,
    liked: dto.isBookmarked,
    status: STATUS_CODE_TO_SALE_STATUS[dto.status],
    isMine: dto.isOwner,
    sellerName: dto.seller.nickname,
    sellerNeighborhood: dto.seller.location ?? undefined,
    industry: dto.businessCategoryName,
    itemCategory: dto.productCategoryName,
    description: dto.description,
    dealLocation: dto.tradeLocation?.district,
  };
}

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

export function toCreateProductRequest(
  input: ProductFormInput,
): CreateProductRequestJson {
  return {
    title: input.title,
    businessCategory: toBusinessCategoryCode(input.industry),
    productCategory: toProductCategoryCode(input.itemCategory),
    price: input.price,
    tradeMethods: dealTypesToTradeMethods(input.dealTypes),
    tradeLocation: input.dealTypes.includes("직거래") ? input.tradeLocation : undefined,
    latitude: input.dealTypes.includes("직거래") ? input.lat : undefined,
    longitude: input.dealTypes.includes("직거래") ? input.lng : undefined,
    description: input.description,
  };
}

export function toUpdateProductRequest(
  input: ProductFormInput,
  retainedImages: string[],
): UpdateProductRequestJson {
  return {
    ...toCreateProductRequest(input),
    retainedImages,
  };
}

export function saleStatusToStatusCode(status: SaleStatus): ProductStatusCode {
  return SALE_STATUS_TO_STATUS_CODE[status];
}
