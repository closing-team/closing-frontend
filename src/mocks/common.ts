// 모든 MSW 핸들러가 공유하는 성공 응답 봉투(ApiEnvelope의 성공 부분).
// 각 핸들러는 `{ ...OK, data }` 형태로 실제 백엔드 응답 형태를 그대로 재현한다.
export const OK = { success: true, code: "COMMON200", message: "성공입니다." } as const;

// 모킹 환경의 "로그인한 사용자" ID.
// 상품 소유자 판별(isOwner), 채팅 내 메시지 판별(mine), AI 세션 소유권 검사가
// 모두 같은 사용자를 가리켜야 하므로 도메인마다 두지 않고 여기서 공유한다.
export const CURRENT_USER_ID = 1;

// 커서 기반 페이지네이션. 상품/채팅/지원정보 등 여러 도메인의 목록 조회에서 공통으로 쓴다.
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
