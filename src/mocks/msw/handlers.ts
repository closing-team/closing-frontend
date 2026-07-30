import { http, HttpResponse, passthrough } from "msw";
import {
  CURRENT_USER_ID,
  findRecord,
  haversineKm,
  insertRecord,
  listRecords,
  paginate,
  updateRecord,
  upsertBusinessVerification,
} from "./db";
import { inquiryHandlers } from "../inquiry/handlers";
import {
  fromBusinessCategoryCode,
  fromProductCategoryCode,
} from "../../utils/productCategoryMap";
import type {
  CreateProductRequestJson,
  MyProductSummaryDto,
  ProductDetailDto,
  ProductSortCode,
  ProductStatusCode,
  ProductSummaryDto,
  UpdateProductRequestJson,
  UpdateProductStatusRequest,
} from "../../types/productApi";
import type { VerifyBusinessRequestJson } from "../../types/businessApi";

function formatBusinessNumber(digits: string): string {
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

const OK = { success: true, code: "COMMON200", message: "성공입니다." } as const;

function notFound(message: string) {
  return HttpResponse.json(
    { success: false, code: "PRODUCT404", message },
    { status: 404 },
  );
}

function forbidden(code: string, message: string) {
  return HttpResponse.json({ success: false, code, message }, { status: 403 });
}

export const handlers = [
  http.get("https://oapi.map.naver.com/*", () => passthrough()),
  http.get("https://naveropenapi.apigw.ntruss.com/*", () => passthrough()),

  http.get("*/api/v1/products/me", ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.get("status") as ProductStatusCode | null;
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const size = Number(url.searchParams.get("size") ?? 20);

    const allMine = listRecords().filter(
      (r) => r.ownerId === CURRENT_USER_ID && r.status !== "DELETED",
    );
    const counts = {
      total: allMine.length,
      selling: allMine.filter((r) => r.status === "SELLING").length,
      reserved: allMine.filter((r) => r.status === "RESERVED").length,
      soldOut: allMine.filter((r) => r.status === "SOLD_OUT").length,
    };

    let items = allMine;
    if (status) items = items.filter((r) => r.status === status);

    const sorted = [...items].sort((a, b) => b.productId - a.productId);
    const { page, nextCursor, hasNext } = paginate(
      sorted,
      cursor,
      size,
      (r) => r.productId,
    );

    const products: MyProductSummaryDto[] = page.map((r) => ({
      productId: r.productId,
      thumbnailUrl: r.imageUrls[0] ?? "",
      title: r.title,
      price: r.price,
      tradeMethods: r.tradeMethods,
      tradeLocation:
        r.tradeMethods.includes("DIRECT") && r.latitude != null && r.longitude != null
          ? {
              district: r.neighborhood,
              latitude: r.latitude,
              longitude: r.longitude,
              distanceKm: null,
            }
          : null,
      status: r.status as ProductStatusCode,
      isBookmarked: r.bookmarked,
      bookmarkCount: r.bookmarkCount,
      createdAt: r.createdAt,
    }));

    return HttpResponse.json({
      ...OK,
      data: {
        products,
        counts,
        page: { nextCursor: nextCursor as number | null, hasNext },
      },
    });
  }),

  http.get("*/api/v1/products/bookmarks", ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const size = Number(url.searchParams.get("size") ?? 20);
    const latParam = url.searchParams.get("latitude");
    const lngParam = url.searchParams.get("longitude");
    const hasCoords = latParam != null && lngParam != null;

    const items = listRecords().filter((r) => r.bookmarked && r.status !== "DELETED");
    const sorted = [...items].sort((a, b) => b.productId - a.productId);
    const { page, nextCursor, hasNext } = paginate(
      sorted,
      cursor,
      size,
      (r) => r.productId,
    );

    const products: ProductSummaryDto[] = page.map((r) => {
      const distanceKm =
        hasCoords && r.latitude != null && r.longitude != null
          ? haversineKm(Number(latParam), Number(lngParam), r.latitude, r.longitude)
          : null;
      return {
        productId: r.productId,
        thumbnailUrl: r.imageUrls[0] ?? "",
        title: r.title,
        price: r.price,
        tradeMethods: r.tradeMethods,
        tradeLocation:
          r.tradeMethods.includes("DIRECT") && r.latitude != null && r.longitude != null
            ? {
                district: r.neighborhood,
                latitude: r.latitude,
                longitude: r.longitude,
                distanceKm,
              }
            : null,
        status: r.status as ProductStatusCode,
        isBookmarked: true,
        createdAt: r.createdAt,
      };
    });

    return HttpResponse.json({
      ...OK,
      data: { products, page: { nextCursor: nextCursor as number | null, hasNext } },
    });
  }),

  http.get("*/api/v1/products", ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword");
    const businessCategory = url.searchParams.get("businessCategory");
    const productCategory = url.searchParams.get("productCategory");
    const tradeMethods = url.searchParams.getAll("tradeMethods");
    const nearby = url.searchParams.get("nearby") === "true";
    const sort = (url.searchParams.get("sort") as ProductSortCode | null) ?? "LATEST";
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const size = Number(url.searchParams.get("size") ?? 20);
    const latitude = Number(url.searchParams.get("latitude"));
    const longitude = Number(url.searchParams.get("longitude"));

    let items = listRecords().filter((r) => r.status !== "DELETED");

    if (keyword) {
      const kw = keyword.toLowerCase();
      items = items.filter((r) => r.title.toLowerCase().includes(kw));
    }
    if (businessCategory) {
      items = items.filter((r) => r.businessCategory === businessCategory);
    }
    if (productCategory) {
      items = items.filter((r) => r.productCategory === productCategory);
    }
    if (tradeMethods.length > 0) {
      items = items.filter((r) =>
        tradeMethods.every((m) => r.tradeMethods.includes(m as never)),
      );
    }

    let withDistance = items.map((r) => ({
      record: r,
      distanceKm:
        r.latitude != null && r.longitude != null
          ? haversineKm(latitude, longitude, r.latitude, r.longitude)
          : null,
    }));

    if (nearby) {
      withDistance = withDistance.filter(
        (x) => x.distanceKm != null && x.distanceKm <= 2,
      );
    }

    const sorted = [...withDistance].sort((a, b) => {
      switch (sort) {
        case "POPULAR":
          return (
            Number(b.record.bookmarked) - Number(a.record.bookmarked) ||
            b.record.productId - a.record.productId
          );
        case "NEAREST":
          return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
        case "CHEAPEST":
          return a.record.price - b.record.price;
        case "MOST_EXPENSIVE":
          return b.record.price - a.record.price;
        case "LATEST":
        default:
          return (
            new Date(b.record.createdAt).getTime() -
            new Date(a.record.createdAt).getTime()
          );
      }
    });

    const { page, nextCursor, hasNext } = paginate(sorted, cursor, size, (x) =>
      String(x.record.productId),
    );

    const products: ProductSummaryDto[] = page.map((x) => ({
      productId: x.record.productId,
      thumbnailUrl: x.record.imageUrls[0] ?? "",
      title: x.record.title,
      price: x.record.price,
      tradeMethods: x.record.tradeMethods,
      tradeLocation:
        x.record.tradeMethods.includes("DIRECT") &&
        x.record.latitude != null &&
        x.record.longitude != null
          ? {
              district: x.record.neighborhood,
              latitude: x.record.latitude,
              longitude: x.record.longitude,
              distanceKm: x.distanceKm,
            }
          : null,
      status: x.record.status as ProductStatusCode,
      isBookmarked: x.record.bookmarked,
      createdAt: x.record.createdAt,
    }));

    return HttpResponse.json({
      ...OK,
      data: { products, page: { nextCursor: nextCursor as string | null, hasNext } },
    });
  }),

  http.post("*/api/v1/products", async ({ request }) => {
    const formData = await request.formData();
    const requestBlob = formData.get("request") as Blob;
    const body = JSON.parse(await requestBlob.text()) as CreateProductRequestJson;
    const imageFiles = formData.getAll("images") as File[];
    const imageUrls = imageFiles.map((f) => URL.createObjectURL(f));
    const isDirect = body.tradeMethods.includes("DIRECT");
    const now = new Date().toISOString();

    const created = insertRecord({
      title: body.title,
      price: body.price,
      description: body.description,
      imageUrls,
      businessCategory: body.businessCategory,
      businessCategoryName: fromBusinessCategoryCode(body.businessCategory),
      productCategory: body.productCategory,
      productCategoryName: fromProductCategoryCode(body.productCategory),
      tradeMethods: body.tradeMethods,
      tradeLocationText: isDirect ? (body.tradeLocation ?? null) : null,
      neighborhood: isDirect ? (body.tradeLocation ?? "") : "",
      latitude: isDirect ? (body.latitude ?? null) : null,
      longitude: isDirect ? (body.longitude ?? null) : null,
      status: "SELLING",
      bookmarked: false,
      bookmarkCount: 0,
      ownerId: CURRENT_USER_ID,
      ownerNickname: "클로저 123",
      createdAt: now,
      updatedAt: now,
    });

    return HttpResponse.json({
      ...OK,
      data: {
        productId: created.productId,
        status: created.status,
        imageUrls: created.imageUrls,
        createdAt: created.createdAt,
      },
    });
  }),

  http.get("*/api/v1/products/:productId", ({ request, params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않거나 삭제된 상품입니다.");
    }

    const url = new URL(request.url);
    const latParam = url.searchParams.get("latitude");
    const lngParam = url.searchParams.get("longitude");
    const hasCoords = latParam != null && lngParam != null;
    const distanceKm =
      hasCoords && record.latitude != null && record.longitude != null
        ? haversineKm(Number(latParam), Number(lngParam), record.latitude, record.longitude)
        : null;

    const data: ProductDetailDto = {
      productId: record.productId,
      title: record.title,
      price: record.price,
      description: record.description,
      imageUrls: record.imageUrls,
      businessCategory: record.businessCategory,
      businessCategoryName: record.businessCategoryName,
      productCategory: record.productCategory,
      productCategoryName: record.productCategoryName,
      tradeMethods: record.tradeMethods,
      tradeLocation:
        record.tradeMethods.includes("DIRECT") &&
        record.latitude != null &&
        record.longitude != null
          ? {
              district: record.tradeLocationText ?? record.neighborhood,
              latitude: record.latitude,
              longitude: record.longitude,
              distanceKm,
            }
          : null,
      status: record.status as ProductStatusCode,
      isBookmarked: record.bookmarked,
      isOwner: record.ownerId === CURRENT_USER_ID,
      seller: {
        memberId: record.ownerId,
        nickname: record.ownerNickname,
        location: record.neighborhood || null,
      },
      createdAt: record.createdAt,
    };

    return HttpResponse.json({ ...OK, data });
  }),

  http.put("*/api/v1/products/:productId", async ({ request, params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않거나 삭제된 상품입니다.");
    }
    if (record.ownerId !== CURRENT_USER_ID) {
      return forbidden("PRODUCT_UPDATE_FORBIDDEN", "본인 상품이 아닙니다.");
    }

    const formData = await request.formData();
    const requestBlob = formData.get("request") as Blob;
    const body = JSON.parse(await requestBlob.text()) as UpdateProductRequestJson;
    const newImageFiles = formData.getAll("newImages") as File[];
    const newImageUrls = newImageFiles.map((f) => URL.createObjectURL(f));
    const imageUrls = [...body.retainedImages, ...newImageUrls];
    const isDirect = body.tradeMethods.includes("DIRECT");

    const updated = updateRecord(productId, {
      title: body.title,
      price: body.price,
      description: body.description,
      imageUrls,
      businessCategory: body.businessCategory,
      businessCategoryName: fromBusinessCategoryCode(body.businessCategory),
      productCategory: body.productCategory,
      productCategoryName: fromProductCategoryCode(body.productCategory),
      tradeMethods: body.tradeMethods,
      tradeLocationText: isDirect ? (body.tradeLocation ?? null) : null,
      neighborhood: isDirect ? (body.tradeLocation ?? "") : record.neighborhood,
      latitude: isDirect ? (body.latitude ?? null) : null,
      longitude: isDirect ? (body.longitude ?? null) : null,
      updatedAt: new Date().toISOString(),
    })!;

    return HttpResponse.json({
      ...OK,
      data: {
        productId: updated.productId,
        title: updated.title,
        price: updated.price,
        tradeMethods: updated.tradeMethods,
        tradeLocation: updated.tradeLocationText,
        latitude: updated.latitude,
        longitude: updated.longitude,
        status: updated.status,
        imageUrls: updated.imageUrls,
        updatedAt: updated.updatedAt,
      },
    });
  }),

  http.delete("*/api/v1/products/:productId", ({ params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않는 상품입니다.");
    }
    if (record.ownerId !== CURRENT_USER_ID) {
      return forbidden("PRODUCT_DELETE_FORBIDDEN", "본인 상품이 아닙니다.");
    }
    updateRecord(productId, { status: "DELETED" });
    return HttpResponse.json(OK);
  }),

  http.patch("*/api/v1/products/:productId/status", async ({ request, params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않거나 삭제된 상품입니다.");
    }
    if (record.ownerId !== CURRENT_USER_ID) {
      return forbidden("PRODUCT_STATUS_UPDATE_FORBIDDEN", "본인 상품이 아닙니다.");
    }

    const body = (await request.json()) as UpdateProductStatusRequest;
    const updated = updateRecord(productId, {
      status: body.status,
      updatedAt: new Date().toISOString(),
    })!;

    return HttpResponse.json({
      ...OK,
      data: {
        productId: updated.productId,
        status: updated.status,
        updatedAt: updated.updatedAt,
      },
    });
  }),

  http.post("*/api/v1/products/:productId/bookmark", ({ params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않거나 삭제된 상품입니다.");
    }
    if (!record.bookmarked) {
      updateRecord(productId, {
        bookmarked: true,
        bookmarkCount: record.bookmarkCount + 1,
      });
    }
    return HttpResponse.json({ ...OK, data: { productId, isBookmarked: true } });
  }),

  http.delete("*/api/v1/products/:productId/bookmark", ({ params }) => {
    const productId = Number(params.productId);
    const record = findRecord(productId);
    if (!record || record.status === "DELETED") {
      return notFound("존재하지 않거나 삭제된 상품입니다.");
    }
    if (!record.bookmarked) {
      return HttpResponse.json(
        {
          success: false,
          code: "PRODUCT_BOOKMARK_NOT_FOUND",
          message: "찜 기록이 없습니다.",
        },
        { status: 404 },
      );
    }
    updateRecord(productId, {
      bookmarked: false,
      bookmarkCount: Math.max(0, record.bookmarkCount - 1),
    });
    return HttpResponse.json({ ...OK, data: { productId, isBookmarked: false } });
  }),

  http.put("*/api/v1/businesses", async ({ request }) => {
    const body = (await request.json()) as VerifyBusinessRequestJson;
    if (!body.businessNumber || !body.ownerName || !body.openDate) {
      return HttpResponse.json(
        { success: false, code: "COMMON500", message: "요청값 검증에 실패했습니다." },
        { status: 500 },
      );
    }

    const record = upsertBusinessVerification(CURRENT_USER_ID, {
      businessNumber: body.businessNumber,
      ownerName: body.ownerName,
      openDate: body.openDate,
    });

    return HttpResponse.json({
      ...OK,
      message: "사업자 인증이 완료되었습니다.",
      data: {
        registrationId: record.registrationId,
        businessNumber: formatBusinessNumber(record.businessNumber),
        verifiedAt: record.verifiedAt,
      },
    });
  }),

  ...inquiryHandlers,
];
