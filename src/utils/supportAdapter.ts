import axios from "axios";

function toDotDate(date: string): string {
  return date.replaceAll("-", ".");
}

export function formatApplicationPeriod(
  applyStartDate: string,
  applyEndDate: string | null,
): string {
  const start = toDotDate(applyStartDate);
  if (applyEndDate === null) {
    return `${start} - 상시`;
  }
  return `${start} - ${toDotDate(applyEndDate)}`;
}

const BOOKMARK_ERROR_MESSAGES: Record<string, string> = {
  BOOKMARK_ALREADY_EXISTS: "이미 등록된 북마크입니다.",
  BOOKMARK_NOT_FOUND: "이미 삭제된 북마크입니다.",
  SUPPORT_NOT_FOUND: "존재하지 않는 지원정보입니다.",
};

const DEFAULT_BOOKMARK_ERROR_MESSAGE =
  "북마크 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export function getBookmarkErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<{ code?: string; message?: string }>(error)) {
    return DEFAULT_BOOKMARK_ERROR_MESSAGE;
  }
  const code = error.response?.data?.code;
  if (code && BOOKMARK_ERROR_MESSAGES[code]) {
    return BOOKMARK_ERROR_MESSAGES[code];
  }
  return error.response?.data?.message ?? DEFAULT_BOOKMARK_ERROR_MESSAGE;
}
