import type { UserProfileDto } from "../../types/accountApi";
import { CURRENT_USER_ID } from "../common";

let profile: UserProfileDto = {
  userId: CURRENT_USER_ID,
  nickname: "원흥동 상사",
  name: "김철수",
  phone: "01055647756",
  email: "closer123@example.com",
  profileImageUrl: "",
  businessVerified: true,
  businessNumber: "123-45-67890",
};

export function getProfile(): UserProfileDto {
  return profile;
}

export function updateProfile(patch: {
  nickname: string;
  profileImageUrl?: string;
}): UserProfileDto {
  profile = {
    ...profile,
    nickname: patch.nickname,
    ...(patch.profileImageUrl !== undefined && { profileImageUrl: patch.profileImageUrl }),
  };
  return profile;
}
