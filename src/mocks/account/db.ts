import type { UserProfileDto } from "../../types/accountApi";
import { CURRENT_USER_ID } from "../common";

let profile: UserProfileDto = {
  userId: CURRENT_USER_ID,
  name: "김철수",
  nickname: "원흥동 상사",
  phone: "01055647756",
  email: "closer123@example.com",
  profileImageUrl: "",
};

export function getProfile(): UserProfileDto {
  return profile;
}

export function updateProfile(patch: {
  name: string;
  phone: string;
}): UserProfileDto {
  profile = { ...profile, ...patch };
  return profile;
}
