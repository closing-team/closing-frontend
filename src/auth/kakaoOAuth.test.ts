import { describe, expect, it } from "vitest";
import {
  buildKakaoAuthorizationUrl,
  getKakaoCallbackUri,
} from "./kakaoOAuth";

describe("kakao OAuth", () => {
  it("현재 프론트 origin으로 콜백 URI를 만든다", () => {
    expect(getKakaoCallbackUri("http://localhost:5173")).toBe(
      "http://localhost:5173/auth/kakao/callback",
    );
  });

  it("가이드의 client_id와 code 응답 방식으로 인증 URL을 만든다", () => {
    const authorizationUrl = new URL(
      buildKakaoAuthorizationUrl(
        "http://localhost:5173/auth/kakao/callback",
      ),
    );

    expect(`${authorizationUrl.origin}${authorizationUrl.pathname}`).toBe(
      "https://kauth.kakao.com/oauth/authorize",
    );
    expect(authorizationUrl.searchParams.get("client_id")).toBe(
      "3d2955d69f70ccce2390d291d6e8202e",
    );
    expect(authorizationUrl.searchParams.get("redirect_uri")).toBe(
      "http://localhost:5173/auth/kakao/callback",
    );
    expect(authorizationUrl.searchParams.get("response_type")).toBe("code");
  });
});
