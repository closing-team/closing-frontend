// GET /api/v1/users/me — 내 프로필 조회 응답
export interface UserProfileDto {
  userId: number;
  nickname: string;
  name: string;
  phone: string;
  email: string;
  profileImageUrl: string;
  businessVerified: boolean;
  businessNumber: string;
}

// PATCH /api/v1/users/me — 내 정보 수정 요청
export interface UpdateProfileRequestJson {
  nickname: string;
  image?: File;
}

export type UpdateProfileResponseData = UserProfileDto;
