import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyBusiness } from "../api/business";
import { accountKeys } from "./useAccount";

export function useVerifyBusinessMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyBusiness,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() }),
  });
}
