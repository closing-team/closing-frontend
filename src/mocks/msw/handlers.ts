import { http, passthrough } from "msw";
import { accountHandlers } from "../account/handlers";
import { aiHandlers } from "../ai/handlers";
import { chatHandlers } from "../chat/handlers";
import { inquiryHandlers } from "../inquiry/handlers";
import { scheduleHandlers } from "../schedule/handlers";
import { supportHandlers } from "../support/handlers";
import { termsHandlers } from "../terms/handlers";

// 중고거래(product)·사업자인증(business) 도메인은 실제 백엔드로 연결돼 있어
// 더 이상 MSW로 모킹하지 않는다. mocks/product/, mocks/business/ 코드는
// 다시 목업으로 돌려야 할 때를 대비해 남겨두고, 여기서만 연결을 끊는다.
export const handlers = [
  http.get("https://oapi.map.naver.com/*", () => passthrough()),
  http.get("https://naveropenapi.apigw.ntruss.com/*", () => passthrough()),

  ...inquiryHandlers,
  ...supportHandlers,
  ...aiHandlers,
  ...chatHandlers,
  ...accountHandlers,
  ...scheduleHandlers,
  ...termsHandlers,
];
