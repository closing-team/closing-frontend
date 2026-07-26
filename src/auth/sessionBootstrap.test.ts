import { describe, expect, it, vi } from "vitest";
import {
  SESSION_CHECK_TIMEOUT_MS,
  SessionRestoreTimeoutError,
  restoreSessionWithTimeout,
  type RestoreSession,
} from "./sessionBootstrap";

describe("restoreSessionWithTimeout", () => {
  it("제한 시간이 지나면 요청을 중단하고 timeout 오류를 반환한다", async () => {
    vi.useFakeTimers();
    const restoreSession: RestoreSession = (signal) =>
      new Promise((_, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      });

    const promise = restoreSessionWithTimeout(
      restoreSession,
      SESSION_CHECK_TIMEOUT_MS,
    );
    const rejection = expect(promise).rejects.toBeInstanceOf(
      SessionRestoreTimeoutError,
    );

    await vi.advanceTimersByTimeAsync(SESSION_CHECK_TIMEOUT_MS);

    await rejection;
    vi.useRealTimers();
  });

  it("제한 시간 전에 완료된 결과를 그대로 반환한다", async () => {
    const restoreSession: RestoreSession = async () => "authenticated";

    await expect(
      restoreSessionWithTimeout(restoreSession, SESSION_CHECK_TIMEOUT_MS),
    ).resolves.toBe("authenticated");
  });

  it("외부에서 중단하면 진행 중인 복원 요청을 abort한다", async () => {
    const externalController = new AbortController();
    const restoreSession: RestoreSession = (signal) =>
      new Promise((_, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      });

    const promise = restoreSessionWithTimeout(
      restoreSession,
      SESSION_CHECK_TIMEOUT_MS,
      externalController.signal,
    );
    const rejection = expect(promise).rejects.toMatchObject({
      name: "AbortError",
    });
    externalController.abort();

    await rejection;
  });
});
