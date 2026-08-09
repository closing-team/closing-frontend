import { loginWithKakao } from "../api/auth";
import { queryClient } from "../queryClient";
import type { LoginResult } from "../types/auth";
import {
  clearAuthSession,
  clearPendingSignup,
  saveAuthSession,
  savePendingSignup,
} from "./authSession";

export async function completeKakaoLogin(
  code: string,
  signal: AbortSignal,
): Promise<LoginResult> {
  signal.throwIfAborted();
  const loginData = await loginWithKakao({ code });
  signal.throwIfAborted();

  if (loginData.newUser) {
    clearAuthSession();
    clearPendingSignup();
    saveAuthSession({
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
    });
    savePendingSignup({ kind: "oauth" });

    queryClient.clear();
    return { status: "new" };
  }

  saveAuthSession({
    accessToken: loginData.accessToken,
    refreshToken: loginData.refreshToken,
  });
  clearPendingSignup();
  queryClient.clear();
  return { status: "existing" };
}
