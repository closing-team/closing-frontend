import { useMutation, useQuery } from "@tanstack/react-query";
import type { RefObject } from "react";
import { agreeTerms, getTerms, signup } from "../api/auth";
import { getSignupErrorMessage } from "../utils/authError";
import type { SignupRequest, SignupResponseData } from "../types/authApi";

export const authKeys = {
  terms: () => ["auth", "terms"] as const,
};

export function useTermsQuery(enabled: boolean) {
  return useQuery({
    queryKey: authKeys.terms(),
    queryFn: getTerms,
    enabled,
  });
}

export interface SignupSubmission {
  profile: SignupRequest;
  termIds: number[];
}

interface UseSignupMutationOptions {
  // 언마운트 이후/이전 시도의 콜백이 최신 상태를 덮어쓰지 않도록 막는 가드.
  mountedRef: RefObject<boolean>;
  signupAttemptRef: RefObject<number>;
  submitStartedRef: RefObject<boolean>;
  setSignupError: (message: string | null) => void;
  onSuccess: (session: SignupResponseData) => void;
}

export function useSignupMutation({
  mountedRef,
  signupAttemptRef,
  submitStartedRef,
  setSignupError,
  onSuccess,
}: UseSignupMutationOptions) {
  return useMutation({
    mutationFn: async ({ profile, termIds }: SignupSubmission) => {
      await agreeTerms({ termIds });
      return signup(profile);
    },
    onMutate: () => {
      signupAttemptRef.current += 1;
      setSignupError(null);
      return signupAttemptRef.current;
    },
    onSuccess: (session, _request, attempt) => {
      if (!mountedRef.current || attempt !== signupAttemptRef.current) return;
      onSuccess(session);
    },
    onError: (error, _request, attempt) => {
      if (!mountedRef.current || attempt !== signupAttemptRef.current) return;
      setSignupError(getSignupErrorMessage(error));
    },
    onSettled: (_data, _error, _request, attempt) => {
      if (!mountedRef.current || attempt !== signupAttemptRef.current) return;
      submitStartedRef.current = false;
    },
  });
}
