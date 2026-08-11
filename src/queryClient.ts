import { QueryClient } from "@tanstack/react-query";

// 목록, 상세처럼 초 단위로 바뀌지 않는 데이터가 대부분이라 1분 동안은 캐시를
// 그대로 쓴다. 변경이 생기는 경로는 mutation에서 invalidate하므로 즉시 반영된다.
const STALE_TIME = 60_000;
const MAX_RETRY = 1;

// 이 모듈은 첫 화면과 함께 즉시 로드되므로 axios의 isAxiosError를 쓰지 않는다.
// 그걸 import하면 axios 전체가 초기 번들로 끌려와 첫 렌더를 늦춘다.
function getHttpStatus(error: unknown): number | undefined {
  const status = (error as { response?: { status?: unknown } } | null)?.response
    ?.status;
  return typeof status === "number" ? status : undefined;
}

// 4xx는 다시 요청해도 같은 응답이 오므로(만료된 세션, 없는 리소스 등) 재시도하지
// 않는다. 특히 401은 재시도할수록 세션 만료 리다이렉트 처리만 중복으로 돌게 된다.
function shouldRetry(failureCount: number, error: unknown): boolean {
  const status = getHttpStatus(error);
  if (status !== undefined && status >= 400 && status < 500) return false;
  return failureCount < MAX_RETRY;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME,
      retry: shouldRetry,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
