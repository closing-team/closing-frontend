import { http, HttpResponse } from "msw";
import { getProfile, updateProfile } from "./db";
import type { UpdateProfileRequestJson } from "../../types/accountApi";
import { OK } from "../common";

export const accountHandlers = [
  http.get("*/api/v1/users/me", () => {
    return HttpResponse.json({ ...OK, data: getProfile() });
  }),

  http.patch("*/api/v1/users/me", async ({ request }) => {
    const body = (await request.json()) as UpdateProfileRequestJson;
    const updated = updateProfile({ name: body.name, phone: body.phone });
    return HttpResponse.json({ ...OK, data: updated });
  }),

  http.delete("*/api/v1/users/me", () => {
    return HttpResponse.json({ ...OK, data: {} });
  }),
];
