export const SPLASH_MIN_DURATION_MS = 1500;
export const SESSION_CHECK_TIMEOUT_MS = 5000;

export type SessionRestoreResult = "authenticated" | "unauthenticated";

export type RestoreSession = (
  signal: AbortSignal,
) => Promise<SessionRestoreResult>;

export class SessionRestoreTimeoutError extends Error {
  constructor() {
    super("Session restore timed out");
    this.name = "SessionRestoreTimeoutError";
  }
}

export function restoreSessionWithTimeout(
  restoreSession: RestoreSession,
  timeoutMs: number,
  externalSignal?: AbortSignal,
): Promise<SessionRestoreResult> {
  const controller = new AbortController();

  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      externalSignal?.removeEventListener("abort", handleExternalAbort);
    };

    const settleResolve = (result: SessionRestoreResult) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(result);
    };

    const settleReject = (error: unknown) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(error);
    };

    const handleExternalAbort = () => {
      controller.abort();
      settleReject(new DOMException("Aborted", "AbortError"));
    };

    const timeoutId = window.setTimeout(() => {
      controller.abort();
      settleReject(new SessionRestoreTimeoutError());
    }, timeoutMs);

    if (externalSignal?.aborted) {
      handleExternalAbort();
      return;
    }

    externalSignal?.addEventListener("abort", handleExternalAbort, {
      once: true,
    });

    restoreSession(controller.signal).then(settleResolve, settleReject);
  });
}
