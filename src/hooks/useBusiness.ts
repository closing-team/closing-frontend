import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyBusiness } from "../api/business";
import { accountKeys } from "./useAccount";
import type { UserProfileDto } from "../types/accountApi";

export function useVerifyBusinessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyBusiness,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() }),
  });
}

// TODO: 백엔드에 실제 스킵 엔드포인트(예: POST /api/v1/businesses/verify/skip)가
// 생기면 이 함수를 그 API 호출로 교체할 것. 지금은 서버에 반영되지 않고 로컬
// 쿼리 캐시만 businessVerified: true로 바꾼다 — 새로고침하거나 프로필을 다시
// 불러오면 원래 상태로 돌아가는 임시 우회로, 데모 중 인증 API 장애 대비용이다.
export function useSkipBusinessVerification() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.setQueryData<UserProfileDto>(accountKeys.profile(), (prev) =>
      prev ? { ...prev, businessVerified: true } : prev,
    );
  };
}
