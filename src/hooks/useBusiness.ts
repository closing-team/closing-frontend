import { useMutation } from "@tanstack/react-query";
import { verifyBusiness } from "../api/business";

export function useVerifyBusinessMutation() {
  return useMutation({
    mutationFn: verifyBusiness,
  });
}
