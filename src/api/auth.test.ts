import { beforeEach, describe, expect, it, vi } from "vitest";
import { api, publicApi } from "./axios";
import * as authApi from "./auth";

vi.mock("./axios", () => ({
  api: { post: vi.fn() },
  publicApi: { get: vi.fn(), post: vi.fn() },
}));

describe("auth api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("카카오 인가 코드를 로그인 body로 보내고 응답 data를 반환한다", async () => {
    const responseData = {
      newUser: false,
      accessToken: "access-token",
      refreshToken: "refresh-token",
    };
    vi.mocked(publicApi.post).mockResolvedValue({
      data: { success: true, code: "COMMON200", message: "로그인에 성공했습니다.", data: responseData },
    });

    const result = await authApi.loginWithKakao({ code: "authorization-code" });

    expect(publicApi.post).toHaveBeenCalledWith("/api/v1/auth/kakao", {
      code: "authorization-code",
    });
    expect(result).toEqual(responseData);
  });

  it("인증 없이 약관 목록을 조회하고 응답 data를 반환한다", async () => {
    const responseData = [{
      termId: 1,
      type: "SERVICE",
      required: true,
      version: "1.0",
      content: "내용",
      effectiveDate: "2026-08-01",
    }];
    vi.mocked(publicApi.get).mockResolvedValue({
      data: { success: true, code: "COMMON200", message: "성공입니다.", data: responseData },
    });

    const result = await authApi.getTerms();

    expect(publicApi.get).toHaveBeenCalledWith("/api/v1/terms");
    expect(result).toEqual(responseData);
  });

  it("인증 client로 신규 사용자 정보를 보내고 응답 토큰을 반환한다", async () => {
    const request = {
      name: "김준영",
      nickname: "준영",
      phone: "01012345678",
      email: "junyoung@example.com",
      profileImageUrl: "https://example.com/profile.png",
    };
    const responseData = {
      accessToken: "new-access-token",
      refreshToken: "new-refresh-token",
    };
    vi.mocked(api.post).mockResolvedValue({
      data: { success: true, code: "COMMON200", message: "회원가입이 완료되었습니다.", data: responseData },
    });

    const result = await authApi.signup(request);

    expect(api.post).toHaveBeenCalledWith("/api/v1/auth/signup", request);
    expect(result).toEqual(responseData);
  });

  it("인증 client로 선택한 약관 ID를 별도 동의 API에 보낸다", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { success: true, code: "COMMON200", message: "약관 동의가 완료되었습니다.", data: null },
    });

    await authApi.agreeTerms({ termIds: [1, 2, 3] });

    expect(api.post).toHaveBeenCalledWith("/api/v1/terms/agree", {
      termIds: [1, 2, 3],
    });
  });

  it("인증 client로 body 없이 POST 로그아웃한다", async () => {
    vi.mocked(api.post).mockResolvedValue({
      data: { success: true, code: "COMMON200", message: "로그아웃 되었습니다.", data: null },
    });

    await authApi.logout();

    expect(api.post).toHaveBeenCalledWith("/api/v1/auth/logout");
  });
});
