import { http, HttpResponse } from "msw";
import { listTerms } from "./db";
import { OK } from "../common";

export const termsHandlers = [
  http.get("*/api/v1/terms", () => {
    return HttpResponse.json({ ...OK, data: listTerms() });
  }),

  http.post("*/api/v1/terms/agree", () => {
    return HttpResponse.json({ ...OK, data: {} });
  }),
];
