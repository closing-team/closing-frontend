import axios from "axios";

function toDotDate(date: string): string {
  return date.replaceAll("-", ".");
}

// TODO: applicationPeriod 실제 포맷이 확정되면 이 조합 로직 대신 API 값으로 교체 검토
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
  BOOKMARK409: "이미 등록된 북마크입니다.",
  BOOKMARK404: "이미 삭제된 북마크입니다.",
  SUPPORT404: "존재하지 않는 지원정보입니다.",
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
