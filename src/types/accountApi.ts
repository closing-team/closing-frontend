// GET /api/v1/users/me — 내 프로필 조회 응답 (PATCH 응답에도 재사용)
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

// PATCH /api/v1/users/me — 내 정보 수정(닉네임·프로필 이미지) 요청
// name/phone은 더 이상 수정 불가 (응답에는 계속 포함됨)
// multipart/form-data: nickname은 쿼리 파라미터, image는 파일 파트 (변경 없으면 생략)
export interface UpdateProfileRequestJson {
  nickname: string;
  image?: File;
}

export type UpdateProfileResponseData = UserProfileDto;
