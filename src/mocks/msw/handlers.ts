import { http, passthrough } from "msw";

// 중고거래(product)·사업자인증(business)·프로필(account)·지원정보(support)·
// 1:1 문의(inquiry)·채팅(chat)·약관(terms)·AI(ai)·일정(schedule) 도메인은
// 실제 백엔드로 연결돼 있어 더 이상 MSW로 모킹하지 않는다.
// mocks/product/, mocks/business/, mocks/account/, mocks/support/,
// mocks/inquiry/, mocks/chat/, mocks/terms/, mocks/ai/, mocks/schedule/
// 코드는 다시 목업으로 돌려야 할 때를 대비해 남겨두고, 여기서만 연결을 끊는다.
export const handlers = [
  http.get("https://oapi.map.naver.com/*", () => passthrough()),
  http.get("https://naveropenapi.apigw.ntruss.com/*", () => passthrough()),
];
