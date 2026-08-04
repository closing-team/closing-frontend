import { http, HttpResponse } from "msw";
import { SUPPORT_POSTS } from "./mockSupport";
import {
  addBookmark,
  findBookmarkBySupportId,
  findSupport,
  listBookmarks,
  removeBookmark,
} from "./db";
import type {
  BookmarkRequestJson,
  SupportListItem,
  SupportSortCode,
} from "../../types/supportApi";
import { OK, paginate } from "../common";

const SORT_CODES: SupportSortCode[] = ["POPULAR", "LATEST", "DEADLINE"];

function notFound(message: string) {
  return HttpResponse.json(
    { success: false, code: "SUPPORT_NOT_FOUND", message },
    { status: 404 },
  );
}

function bookmarkNotFound(message: string) {
  return HttpResponse.json(
    { success: false, code: "BOOKMARK_NOT_FOUND", message },
    { status: 404 },
  );
}

function bookmarkConflict(message: string) {
  return HttpResponse.json(
    { success: false, code: "BOOKMARK_ALREADY_EXISTS", message },
    { status: 409 },
  );
}

function badRequest(message: string) {
  return HttpResponse.json(
    { success: false, code: "COMMON400", message },
    { status: 400 },
  );
}

function toListItem(post: SupportListItem): SupportListItem {
  const {
    supportId,
    organizationName,
    title,
    applyStartDate,
    applyEndDate,
    applicationPeriod,
    status,
    isBookmarked,
    viewCount,
  } = post;
  return {
    supportId,
    organizationName,
    title,
    applyStartDate,
    applyEndDate,
    applicationPeriod,
    status,
    isBookmarked,
    viewCount,
  };
}

function bookmarkCursor(
  sort: SupportSortCode,
  item: SupportListItem,
  bookmarkId: number,
): string {
  switch (sort) {
    case "POPULAR":
      return `${item.viewCount}_${bookmarkId}`;
    case "DEADLINE":
      return `${item.applyEndDate}_${bookmarkId}`;
    case "LATEST":
    default:
      return `${bookmarkId}`;
  }
}

function sortBookmarkItems(
  items: { item: SupportListItem; bookmarkId: number }[],
  sort: SupportSortCode,
): { item: SupportListItem; bookmarkId: number }[] {
  switch (sort) {
    case "POPULAR":
      return [...items].sort(
        (a, b) =>
          b.item.viewCount - a.item.viewCount || b.bookmarkId - a.bookmarkId,
      );
    case "DEADLINE":
      return [...items].sort((a, b) => {
        const aEnd = a.item.applyEndDate;
        const bEnd = b.item.applyEndDate;
        if (aEnd === null && bEnd === null) return 0;
        if (aEnd === null) return 1;
        if (bEnd === null) return -1;
        return aEnd.localeCompare(bEnd);
      });
    case "LATEST":
    default:
      return [...items].sort((a, b) => b.bookmarkId - a.bookmarkId);
  }
}

export const supportHandlers = [
  http.get("*/api/v1/supports", ({ request }) => {
    const url = new URL(request.url);
    // TODO: 실제 커서 기반 페이지네이션은 명세 확정 후 구현. 지금은 sort/cursor/size를
    // 파라미터로만 받고, 정렬·페이징 없이 전체 목업 데이터를 그대로 반환한다.
    const sort = url.searchParams.get("sort") as SupportSortCode | null;
    const cursor = url.searchParams.get("cursor");
    const size = url.searchParams.get("size");
    void sort;
    void cursor;
    void size;

    const supports: SupportListItem[] = SUPPORT_POSTS.map(toListItem);

    return HttpResponse.json({
      ...OK,
      data: { supports, page: { nextCursor: null, hasNext: false } },
    });
  }),

  http.get("*/api/v1/supports/:supportId", ({ params }) => {
    const supportId = Number(params.supportId);
    const post = SUPPORT_POSTS.find((p) => p.supportId === supportId);
    if (!post) {
      return notFound("존재하지 않는 공고입니다.");
    }

    return HttpResponse.json({ ...OK, data: post });
  }),

  http.post("*/api/v1/bookmarks", async ({ request }) => {
    const body = (await request.json()) as BookmarkRequestJson;
    const post = findSupport(body.supportId);
    if (!post) {
      return notFound("존재하지 않는 지원정보입니다.");
    }
    if (findBookmarkBySupportId(body.supportId)) {
      return bookmarkConflict("이미 등록된 북마크입니다.");
    }

    addBookmark(body.supportId);
    return HttpResponse.json({ ...OK, data: { supportId: body.supportId } });
  }),

  http.delete("*/api/v1/bookmarks/:supportId", ({ params }) => {
    const supportId = Number(params.supportId);
    const removed = removeBookmark(supportId);
    if (!removed) {
      return bookmarkNotFound("북마크가 존재하지 않습니다.");
    }

    return HttpResponse.json({ ...OK, data: {} });
  }),

  http.get("*/api/v1/bookmarks", ({ request }) => {
    const url = new URL(request.url);
    const sortParam = url.searchParams.get("sort");
    if (sortParam && !SORT_CODES.includes(sortParam as SupportSortCode)) {
      return badRequest("잘못된 sort 값입니다.");
    }
    const sort = (sortParam as SupportSortCode | null) ?? "LATEST";

    const sizeParam = url.searchParams.get("size");
    const size = sizeParam !== null ? Number(sizeParam) : 20;
    if (sizeParam !== null && (!Number.isInteger(size) || size <= 0)) {
      return badRequest("잘못된 size 값입니다.");
    }

    const cursor = url.searchParams.get("cursor") ?? undefined;

    const items = listBookmarks()
      .map((record) => {
        const post = findSupport(record.supportId);
        if (!post) return null;
        return { item: toListItem(post), bookmarkId: record.bookmarkId };
      })
      .filter((x): x is { item: SupportListItem; bookmarkId: number } => x !== null);

    const sorted = sortBookmarkItems(items, sort);
    const { page, nextCursor, hasNext } = paginate(sorted, cursor, size, (x) =>
      bookmarkCursor(sort, x.item, x.bookmarkId),
    );

    return HttpResponse.json({
      ...OK,
      data: {
        bookmarks: page.map((x) => x.item),
        page: { nextCursor: nextCursor as string | null, hasNext },
      },
    });
  }),
];
