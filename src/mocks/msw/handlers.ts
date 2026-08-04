import { http, passthrough } from "msw";
import { accountHandlers } from "../account/handlers";
import { aiHandlers } from "../ai/handlers";
import { businessHandlers } from "../business/handlers";
import { chatHandlers } from "../chat/handlers";
import { inquiryHandlers } from "../inquiry/handlers";
import { productHandlers } from "../product/handlers";
import { scheduleHandlers } from "../schedule/handlers";
import { supportHandlers } from "../support/handlers";
import { termsHandlers } from "../terms/handlers";

export const handlers = [
  http.get("https://oapi.map.naver.com/*", () => passthrough()),
  http.get("https://naveropenapi.apigw.ntruss.com/*", () => passthrough()),

  ...productHandlers,
  ...businessHandlers,
  ...inquiryHandlers,
  ...supportHandlers,
  ...aiHandlers,
  ...chatHandlers,
  ...accountHandlers,
  ...scheduleHandlers,
  ...termsHandlers,
];
