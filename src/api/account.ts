import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  UpdateProfileRequestJson,
  UpdateProfileResponseData,
  UserProfileDto,
} from "../types/accountApi";

export async function getMyProfile(): Promise<UserProfileDto> {
  const res = await api.get<ApiEnvelope<UserProfileDto>>("/api/v1/users/me");
  return res.data.data;
}

export async function updateMyProfile(
  request: UpdateProfileRequestJson,
): Promise<UpdateProfileResponseData> {
  const formData = new FormData();
  if (request.image) {
    formData.append("image", request.image);
  }
  const res = await api.patch<ApiEnvelope<UpdateProfileResponseData>>(
    "/api/v1/users/me",
    formData,
    { params: { nickname: request.nickname } },
  );
  return res.data.data;
}

export async function withdrawMyAccount(): Promise<void> {
  await api.delete<ApiEnvelope<Record<string, never>>>("/api/v1/users/me");
}
