import { AxiosError } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { logout } from "../api/auth";
import {
  readAuthSession,
  readPendingSignup,
  saveAuthSession,
  savePendingSignup,
} from "./authSession";
import { logoutCurrentSession } from "./logoutCurrentSession";

vi.mock("../api/auth", () => ({
  logout: vi.fn(),
}));

const session = {
  userId: 1,
  nickname: "원흥동 상사",
  accessToken: "access-token",
  refreshToken: "refresh-token",
};

const pendingSignup = {
  kind: "oauth" as const,
};

function apiError(code: string) {
  return new AxiosError("backend message", code, undefined, undefined, {
    status: 401,
    statusText: "Unauthorized",
    headers: {},
    config: { headers: {} } as never,
    data: {
      success: false,
      code,
      message: "backend message",
      data: null,
    },
  });
}

describe("logoutCurrentSession", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.resetAllMocks();
  });

  it("현재 Bearer 세션으로 서버 로그아웃 후 로컬 인증 값을 삭제한다", async () => {
    saveAuthSession(session);
    savePendingSignup(pendingSignup);

    await logoutCurrentSession();

    expect(logout).toHaveBeenCalledWith();
    expect(readAuthSession()).toBeNull();
    expect(readPendingSignup()).toBeNull();
  });

  it("세션이 없으면 네트워크 요청 없이 남은 로컬 인증 값을 삭제한다", async () => {
    localStorage.setItem("accessToken", "legacy-access");
    localStorage.setItem("refreshToken", "legacy-refresh");
    savePendingSignup(pendingSignup);

    await logoutCurrentSession();

    expect(logout).not.toHaveBeenCalled();
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(localStorage.getItem("refreshToken")).toBeNull();
    expect(readPendingSignup()).toBeNull();
  });

  it("서버가 COMMON401을 반환하면 이미 만료된 세션을 로컬에서 정리한다", async () => {
    saveAuthSession(session);
    savePendingSignup(pendingSignup);
    vi.mocked(logout).mockRejectedValue(apiError("COMMON401"));

    await expect(logoutCurrentSession()).resolves.toBeUndefined();

    expect(readAuthSession()).toBeNull();
    expect(readPendingSignup()).toBeNull();
  });

  it("COMMON500이면 인증 값을 유지해 사용자가 다시 시도할 수 있게 한다", async () => {
    saveAuthSession(session);
    savePendingSignup(pendingSignup);
    vi.mocked(logout).mockRejectedValue(apiError("COMMON500"));

    await expect(logoutCurrentSession()).rejects.toMatchObject({
      code: "COMMON500",
    });

    expect(readAuthSession()).toEqual(session);
    expect(readPendingSignup()).toEqual(pendingSignup);
  });

  it("네트워크 오류이면 인증 값을 유지하고 오류를 다시 전달한다", async () => {
    const networkError = new Error("network");
    saveAuthSession(session);
    savePendingSignup(pendingSignup);
    vi.mocked(logout).mockRejectedValue(networkError);

    await expect(logoutCurrentSession()).rejects.toBe(networkError);

    expect(readAuthSession()).toEqual(session);
    expect(readPendingSignup()).toEqual(pendingSignup);
  });
});
