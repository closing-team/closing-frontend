import { http, HttpResponse } from "msw";
import { getProfile, updateProfile } from "./db";
import { OK } from "../common";

export const accountHandlers = [
  http.get("*/api/v1/users/me", () => {
    return HttpResponse.json({ ...OK, data: getProfile() });
  }),

  http.patch("*/api/v1/users/me", async ({ request }) => {
    const url = new URL(request.url);
    const nickname = url.searchParams.get("nickname") ?? "";
    // 이미지 파트가 없는 빈 FormData는 브라우저에서 재파싱 시 에러가 나므로 방어적으로 처리
    const image = await request
      .formData()
      .then((formData) => formData.get("image"))
      .catch(() => null);
    const updated = updateProfile({
      nickname,
      ...(image instanceof File && { profileImageUrl: URL.createObjectURL(image) }),
    });
    return HttpResponse.json({ ...OK, data: updated });
  }),

  http.delete("*/api/v1/users/me", () => {
    return HttpResponse.json({ ...OK, data: {} });
  }),
];
