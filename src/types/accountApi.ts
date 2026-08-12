// GET /api/v1/users/me — 내 프로필 조회 응답
// nickname, name, phone, businessNumber, businessVerified는 실제 응답에서 비어있을 수 있어
// 옵셔널로 둠 (소비 측 ProfileEditPage.tsx 등에서 ?? 가드가 필요했던 필드들)
export interface UserProfileDto {
  userId: number;
  nickname?: string;
  name?: string;
  phone?: string;
  email: string;
  profileImageUrl: string;
  businessVerified?: boolean;
  businessNumber?: string;
}

// PATCH /api/v1/users/me — 내 정보 수정 요청
export interface UpdateProfileRequestJson {
  nickname: string;
  image?: File;
}

export type UpdateProfileResponseData = UserProfileDto;
