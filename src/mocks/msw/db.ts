import { MOCK_PRODUCTS } from "../used/mockProducts";
import {
  dealTypesToTradeMethods,
  saleStatusToStatusCode,
} from "../../utils/productAdapter";
import {
  toBusinessCategoryCode,
  toProductCategoryCode,
} from "../../utils/productCategoryMap";
import type { ProductStatusCode, TradeMethodCode } from "../../types/productApi";

export const CURRENT_USER_ID = 1;
const OTHER_USER_ID = 2;

export interface MockProductRecord {
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

function seed(): MockProductRecord[] {
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

let records: MockProductRecord[] = seed();
let nextId = Math.max(...records.map((r) => r.productId)) + 1;

export function listRecords(): MockProductRecord[] {
  return records;
}

export function findRecord(productId: number): MockProductRecord | undefined {
  return records.find((r) => r.productId === productId);
}

export function insertRecord(
  record: Omit<MockProductRecord, "productId">,
): MockProductRecord {
  const created: MockProductRecord = { ...record, productId: nextId++ };
  records = [created, ...records];
  return created;
}

export function updateRecord(
  productId: number,
  patch: Partial<MockProductRecord>,
): MockProductRecord | undefined {
  const target = findRecord(productId);
  if (!target) return undefined;
  Object.assign(target, patch);
  return target;
}

export interface MockBusinessVerification {
  registrationId: number;
  userId: number;
  businessNumber: string;
  ownerName: string;
  openDate: string;
  verifiedAt: string;
}

let businessVerifications: MockBusinessVerification[] = [];
let nextRegistrationId = 1;

export function findBusinessVerification(
  userId: number,
): MockBusinessVerification | undefined {
  return businessVerifications.find((v) => v.userId === userId);
}

export function upsertBusinessVerification(
  userId: number,
  data: { businessNumber: string; ownerName: string; openDate: string },
): MockBusinessVerification {
  const existing = findBusinessVerification(userId);
  const verifiedAt = new Date().toISOString();
  if (existing) {
    Object.assign(existing, { ...data, verifiedAt });
    return existing;
  }
  const created: MockBusinessVerification = {
    registrationId: nextRegistrationId++,
    userId,
    ...data,
    verifiedAt,
  };
  businessVerifications = [...businessVerifications, created];
  return created;
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

export function paginate<T>(
  items: T[],
  cursor: string | number | undefined,
  size: number,
  getCursorValue: (item: T) => string | number,
): { page: T[]; nextCursor: string | number | null; hasNext: boolean } {
  let startIndex = 0;
  if (cursor !== undefined && cursor !== null && String(cursor) !== "") {
    const idx = items.findIndex(
      (item) => String(getCursorValue(item)) === String(cursor),
    );
    startIndex = idx >= 0 ? idx + 1 : 0;
  }
  const page = items.slice(startIndex, startIndex + size);
  const hasNext = startIndex + size < items.length;
  const nextCursor = hasNext ? getCursorValue(page[page.length - 1]) : null;
  return { page, nextCursor, hasNext };
}
