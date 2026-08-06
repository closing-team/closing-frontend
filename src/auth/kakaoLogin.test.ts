import { beforeEach, describe, expect, it, vi } from "vitest";
import { loginWithKakao } from "../api/auth";
import { queryClient } from "../queryClient";
import {
  readAuthSession,
  readPendingSignup,
  saveAuthSession,
  savePendingSignup,
} from "./authSession";
import { completeKakaoLogin } from "./kakaoLogin";

vi.mock("../api/auth", () => ({
  loginWithKakao: vi.fn(),
}));

describe("completeKakaoLogin", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
    sessionStorage.clear();
    queryClient.clear();
  });

  it("기존 사용자는 인가 코드를 교환하고 가이드의 서비스 토큰을 저장한다", async () => {
    savePendingSignup({ kind: "oauth" });
    queryClient.setQueryData(["private-data"], { secret: true });
    vi.mocked(loginWithKakao).mockResolvedValue({
      newUser: false,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    await expect(
      completeKakaoLogin("authorization-code", new AbortController().signal),
    ).resolves.toEqual({ status: "existing" });

    expect(loginWithKakao).toHaveBeenCalledWith({ code: "authorization-code" });
    expect(readAuthSession()).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });
    expect(readPendingSignup()).toBeNull();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);
  });

  it("가이드형 신규 사용자는 서비스 토큰을 보존하고 new를 반환한다", async () => {
    saveAuthSession({
      userId: 9,
      nickname: "이전 사용자",
      accessToken: "stale-access-token",
      refreshToken: "stale-refresh-token",
    });
    vi.mocked(loginWithKakao).mockResolvedValue({
      newUser: true,
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });

    await expect(
      completeKakaoLogin("authorization-code", new AbortController().signal),
    ).resolves.toEqual({ status: "new" });

    expect(readAuthSession()).toEqual({
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    });
    expect(readPendingSignup()).toEqual({ kind: "oauth" });
  });

  it("백엔드 응답 전에 취소되면 저장소와 캐시를 변경하지 않는다", async () => {
    let resolveLogin:
      | ((result: Awaited<ReturnType<typeof loginWithKakao>>) => void)
      | undefined;
    vi.mocked(loginWithKakao).mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );
    queryClient.setQueryData(["private-data"], { secret: true });
    const controller = new AbortController();

    const loginPromise = completeKakaoLogin("authorization-code", controller.signal);
    await vi.waitFor(() => expect(loginWithKakao).toHaveBeenCalledTimes(1));
    controller.abort();
    resolveLogin?.({
      newUser: false,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    await expect(loginPromise).rejects.toMatchObject({ name: "AbortError" });
    expect(readAuthSession()).toBeNull();
    expect(readPendingSignup()).toBeNull();
    expect(queryClient.getQueryData(["private-data"])).toEqual({ secret: true });
  });

  it("로그인 실패 시 현재 세션과 캐시를 유지한다", async () => {
    const currentSession = {
      userId: 9,
      nickname: "현재 사용자",
      accessToken: "current-access-token",
      refreshToken: "current-refresh-token",
    };
    saveAuthSession(currentSession);
    queryClient.setQueryData(["private-data"], { secret: true });
    vi.mocked(loginWithKakao).mockRejectedValue(new Error("network"));

    await expect(
      completeKakaoLogin("authorization-code", new AbortController().signal),
    ).rejects.toThrow("network");

    expect(readAuthSession()).toEqual(currentSession);
    expect(queryClient.getQueryData(["private-data"])).toEqual({ secret: true });
  });
});
