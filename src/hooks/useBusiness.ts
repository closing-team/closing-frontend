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

export function useSkipBusinessVerification() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.setQueryData<UserProfileDto>(accountKeys.profile(), (prev) =>
      prev ? { ...prev, businessVerified: true } : prev,
    );
  };
}
