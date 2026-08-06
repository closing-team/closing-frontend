import { beforeEach, describe, expect, it } from "vitest";
import {
  clearAuthSession,
  clearPendingSignup,
  readAuthSession,
  readPendingSignup,
  saveAuthSession,
  savePendingSignup,
} from "./authSession";

describe("authSession", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("서비스 토큰과 사용자 정보를 하나의 세션으로 저장한다", () => {
    const session = {
      userId: 1,
      nickname: "원흥동 상사",
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    saveAuthSession(session);

    expect(readAuthSession()).toEqual(session);
  });

  it("가이드처럼 사용자 정보 없이 서비스 토큰만 온 세션도 복원한다", () => {
    const session = {
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };

    saveAuthSession(session);

    expect(readAuthSession()).toEqual(session);
  });

  it("깨진 JSON은 제거하고 null을 반환한다", () => {
    localStorage.setItem("closing.authSession", "{");

    expect(readAuthSession()).toBeNull();
    expect(localStorage.getItem("closing.authSession")).toBeNull();
  });

  it("이전 signupToken 형식은 제거하고 가입 대기 상태로 사용하지 않는다", () => {
    sessionStorage.setItem("closing.pendingSignup", JSON.stringify({
      signupToken: "signup-token",
      kakaoProfile: {
        email: "user@kakao.com",
        profileImageUrl: "https://example.com/profile.png",
      },
    }));

    expect(readPendingSignup()).toBeNull();
    expect(sessionStorage.getItem("closing.pendingSignup")).toBeNull();
  });

  it("인가 코드 방식 신규 사용자의 가입 대기 상태도 저장한다", () => {
    savePendingSignup({ kind: "oauth" });

    expect(readPendingSignup()).toEqual({ kind: "oauth" });
  });

  it("명시적 삭제 시 현재 키와 예전 개별 토큰 키를 모두 제거한다", () => {
    localStorage.setItem("closing.authSession", "{}");
    localStorage.setItem("accessToken", "legacy-access");
    localStorage.setItem("refreshToken", "legacy-refresh");
    sessionStorage.setItem("closing.pendingSignup", "{}");

    clearAuthSession();
    clearPendingSignup();

    expect(localStorage.length).toBe(0);
    expect(sessionStorage.length).toBe(0);
  });
});
