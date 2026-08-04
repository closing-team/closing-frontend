import { useMutation, useQuery } from "@tanstack/react-query";
import { agreeTerms, getTerms } from "../api/terms";

export const termsKeys = {
  list: () => ["terms"] as const,
};

export function useTermsQuery() {
  return useQuery({
    queryKey: termsKeys.list(),
    queryFn: getTerms,
  });
}

export function useAgreeTermsMutation() {
  return useMutation({
    mutationFn: agreeTerms,
  });
}
