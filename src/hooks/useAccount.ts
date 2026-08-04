import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile, withdrawMyAccount } from "../api/account";

export const accountKeys = {
  profile: () => ["account", "profile"] as const,
};

export function useMyProfileQuery() {
  return useQuery({
    queryKey: accountKeys.profile(),
    queryFn: getMyProfile,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: accountKeys.profile() }),
  });
}

export function useWithdrawMutation() {
  return useMutation({
    mutationFn: withdrawMyAccount,
  });
}
