import { AxiosError } from "axios";
import { describe, expect, it } from "vitest";
import {
  getApiErrorCode,
  getLoginErrorMessage,
  getLogoutErrorMessage,
  getSignupErrorMessage,
  getTermsErrorMessage,
} from "./authError";

function apiError(code: string, message = "backend message") {
  return new AxiosError(message, code, undefined, undefined, {
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: {} } as never,
    data: { success: false, code, message, data: null },
  });
}

describe("authError", () => {
  it("응답 envelope의 오류 코드를 읽는다", () => {
    expect(getApiErrorCode(apiError("AUTH401"))).toBe("AUTH401");
  });

  it("응답 envelope가 없는 오류는 코드를 반환하지 않는다", () => {
    expect(getApiErrorCode(new Error("network"))).toBeUndefined();
  });

  it("만료된 카카오 토큰은 다시 로그인을 안내한다", () => {
    expect(getLoginErrorMessage(apiError("AUTH_KAKAO_EXPIRED"))).toBe(
      "카카오 로그인 시간이 만료되었습니다. 다시 시도해주세요.",
    );
  });

  it("카카오 인증 실패는 카카오 인증 오류를 안내한다", () => {
    expect(getLoginErrorMessage(apiError("AUTH401"))).toBe(
      "카카오 인증에 실패했습니다. 다시 시도해주세요.",
    );
  });

  it("만료된 signup token은 로그인 재시작을 안내한다", () => {
    expect(getSignupErrorMessage(apiError("AUTH_SIGNUP_TOKEN404"))).toBe(
      "가입 정보가 만료되었습니다. 카카오 로그인을 다시 진행해주세요.",
    );
  });

  it("필수 약관 누락은 약관 동의를 안내한다", () => {
    expect(getSignupErrorMessage(apiError("TERM_REQUIRED400"))).toBe(
      "필수 약관에 모두 동의해주세요.",
    );
  });

  it("14세 미만 가입 제한을 안내한다", () => {
    expect(getSignupErrorMessage(apiError("USER_UNDER14400"))).toBe(
      "만 14세 미만은 가입할 수 없습니다.",
    );
  });

  it("로그아웃 인증 만료를 안내한다", () => {
    expect(getLogoutErrorMessage(apiError("COMMON401"))).toBe(
      "로그인 정보가 만료되었습니다.",
    );
  });

  it("terms 요청의 서버 오류는 화면 공통 문구를 반환한다", () => {
    expect(getTermsErrorMessage(apiError("COMMON500"))).toBe(
      "일시적인 오류가 발생했습니다. 다시 시도해주세요.",
    );
  });

  it("알 수 없는 오류는 로그인 재시도 문구를 반환한다", () => {
    expect(getLoginErrorMessage(new Error("network"))).toBe(
      "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
    );
  });
});
