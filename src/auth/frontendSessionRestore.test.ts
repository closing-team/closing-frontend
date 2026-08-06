import { beforeEach, describe, expect, it } from "vitest";
import { saveAuthSession } from "./authSession";
import { frontendSessionRestore } from "./frontendSessionRestore";

describe("frontendSessionRestore", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("저장된 서비스 토큰이 있으면 로그인 상태를 복원한다", async () => {
    saveAuthSession({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    await expect(
      frontendSessionRestore(new AbortController().signal),
    ).resolves.toBe("authenticated");
  });

  it("저장된 서비스 토큰이 없으면 비로그인 상태를 반환한다", async () => {
    await expect(
      frontendSessionRestore(new AbortController().signal),
    ).resolves.toBe("unauthenticated");
  });
});
