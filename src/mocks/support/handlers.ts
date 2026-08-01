import { http, HttpResponse } from "msw";
import { SUPPORT_POSTS } from "./mockSupport";
import type { SupportListItem, SupportSortCode } from "../../types/supportApi";

const OK = { success: true, code: "COMMON200", message: "성공입니다." } as const;

function notFound(message: string) {
  return HttpResponse.json(
    { success: false, code: "SUPPORT404", message },
    { status: 404 },
  );
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

    const supports: SupportListItem[] = SUPPORT_POSTS.map(
      ({
        supportId,
        organizationName,
        title,
        applyStartDate,
        applyEndDate,
        applicationPeriod,
        status,
        isBookmarked,
        viewCount,
      }) => ({
        supportId,
        organizationName,
        title,
        applyStartDate,
        applyEndDate,
        applicationPeriod,
        status,
        isBookmarked,
        viewCount,
      }),
    );

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
];
