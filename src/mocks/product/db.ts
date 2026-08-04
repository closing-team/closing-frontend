import { MOCK_PRODUCTS } from "./mockProducts";
import {
  dealTypesToTradeMethods,
  saleStatusToStatusCode,
} from "../../utils/productAdapter";
import {
  toBusinessCategoryCode,
  toProductCategoryCode,
} from "../../utils/productCategoryMap";
import type { ProductStatusCode, TradeMethodCode } from "../../types/productApi";
import { CURRENT_USER_ID } from "../common";

const OTHER_USER_ID = 2;

export interface ProductRecord {
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
  tradeLocationText: string | null;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  status: ProductStatusCode | "DELETED";
  bookmarked: boolean;
  bookmarkCount: number;
  ownerId: number;
  ownerNickname: string;
  createdAt: string;
  updatedAt: string;
}

function seed(): ProductRecord[] {
  return MOCK_PRODUCTS.map((p) => {
    const tradeMethods = dealTypesToTradeMethods(p.dealTypes);
    const isDirect = tradeMethods.includes("DIRECT");
    return {
      productId: p.id,
      title: p.title,
      price: p.price,
      description: p.description ?? "",
      imageUrls: p.imageUrl ? [p.imageUrl] : [],
      businessCategory: toBusinessCategoryCode(p.industry ?? ""),
      businessCategoryName: p.industry ?? "",
      productCategory: toProductCategoryCode(p.itemCategory ?? ""),
      productCategoryName: p.itemCategory ?? "",
      tradeMethods,
      tradeLocationText: isDirect ? (p.dealLocation ?? null) : null,
      neighborhood: p.neighborhood,
      latitude: isDirect ? (p.lat ?? null) : null,
      longitude: isDirect ? (p.lng ?? null) : null,
      status: saleStatusToStatusCode(p.status ?? "selling"),
      bookmarked: p.liked,
      bookmarkCount: p.likes,
      ownerId: p.isMine ? CURRENT_USER_ID : OTHER_USER_ID,
      ownerNickname: p.sellerName ?? "클로저 123",
      createdAt: p.createdAt,
      updatedAt: p.createdAt,
    };
  });
}

let records: ProductRecord[] = seed();
let nextId = Math.max(...records.map((r) => r.productId)) + 1;

export function listProducts(): ProductRecord[] {
  return records;
}

export function findProduct(productId: number): ProductRecord | undefined {
  return records.find((r) => r.productId === productId);
}

export function insertProduct(
  record: Omit<ProductRecord, "productId">,
): ProductRecord {
  const created: ProductRecord = { ...record, productId: nextId++ };
  records = [created, ...records];
  return created;
}

export function updateProduct(
  productId: number,
  patch: Partial<ProductRecord>,
): ProductRecord | undefined {
  const target = findProduct(productId);
  if (!target) return undefined;
  Object.assign(target, patch);
  return target;
}

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
