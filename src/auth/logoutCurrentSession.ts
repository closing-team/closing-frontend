import { logout } from "../api/auth";
import { getApiErrorCode } from "../utils/authError";
import {
  clearAuthSession,
  clearPendingSignup,
  readAuthSession,
} from "./authSession";

function clearLocalAuth(): void {
  clearAuthSession();
  clearPendingSignup();
}

export async function logoutCurrentSession(): Promise<void> {
  const session = readAuthSession();

  if (!session) {
    clearLocalAuth();
    return;
  }

  try {
    await logout();
  } catch (error) {
    if (getApiErrorCode(error) !== "COMMON401") {
      throw error;
    }
  }

  clearLocalAuth();
}
