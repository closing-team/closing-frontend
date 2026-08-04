// GET /api/v1/users/me — 내 프로필 조회 응답 (PATCH 응답에도 재사용)
export interface UserProfileDto {
  userId: number;
  name: string;
  nickname: string;
  phone: string;
  email: string;
  profileImageUrl: string;
}

// PATCH /api/v1/users/me — 내 정보 수정(이름·전화번호) 요청
export interface UpdateProfileRequestJson {
  name: string;
  phone: string;
}

export type UpdateProfileResponseData = UserProfileDto;
