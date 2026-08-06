import type { AuthSession, PendingSignup } from "../types/authApi";

const AUTH_SESSION_KEY = "closing.authSession";
const PENDING_SIGNUP_KEY = "closing.pendingSignup";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAuthSession(value: unknown): value is AuthSession {
  return (
    isRecord(value) &&
    (value.userId === undefined || typeof value.userId === "number") &&
    (value.nickname === undefined || typeof value.nickname === "string") &&
    typeof value.accessToken === "string" &&
    typeof value.refreshToken === "string"
  );
}

function isPendingSignup(value: unknown): value is PendingSignup {
  return isRecord(value) && value.kind === "oauth";
}

function readStoredValue<T>(
  storage: Storage,
  key: string,
  isValid: (value: unknown) => value is T,
): T | null {
  const storedValue = storage.getItem(key);

  if (storedValue === null) {
    return null;
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (isValid(parsedValue)) {
      return parsedValue;
    }
  } catch {
    // Invalid JSON is handled by removing the stale storage entry below.
  }

  storage.removeItem(key);
  return null;
}

export function readAuthSession(): AuthSession | null {
  return readStoredValue(localStorage, AUTH_SESSION_KEY, isAuthSession);
}

export function saveAuthSession(session: AuthSession): void {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function clearAuthSession(): void {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

export function readPendingSignup(): PendingSignup | null {
  return readStoredValue(sessionStorage, PENDING_SIGNUP_KEY, isPendingSignup);
}

export function savePendingSignup(pendingSignup: PendingSignup): void {
  sessionStorage.setItem(PENDING_SIGNUP_KEY, JSON.stringify(pendingSignup));
}

export function clearPendingSignup(): void {
  sessionStorage.removeItem(PENDING_SIGNUP_KEY);
}
