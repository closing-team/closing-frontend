import { ROUTES } from "../constants/routes";

const KAKAO_AUTHORIZATION_ENDPOINT =
  "https://kauth.kakao.com/oauth/authorize";
const KAKAO_CLIENT_ID = "3d2955d69f70ccce2390d291d6e8202e";

export function getKakaoCallbackUri(origin = window.location.origin): string {
  return new URL(ROUTES.KAKAO_CALLBACK, origin).toString();
}

export function buildKakaoAuthorizationUrl(
  callbackUri = getKakaoCallbackUri(),
): string {
  const url = new URL(KAKAO_AUTHORIZATION_ENDPOINT);
  url.searchParams.set("client_id", KAKAO_CLIENT_ID);
  url.searchParams.set("redirect_uri", callbackUri);
  url.searchParams.set("response_type", "code");
  return url.toString();
}

export function startKakaoAuthorization(
  authorizationUrl = buildKakaoAuthorizationUrl(),
): void {
  window.location.assign(authorizationUrl);
}
