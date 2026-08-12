// PUT /api/v1/businesses/verify — 사업자 인증 요청과 응답
export interface VerifyBusinessRequestJson {
  businessNumber: string;
  ownerName: string;
  openDate: string;
}

export interface VerifyBusinessResponseData {
  registrationId: number;
  businessNumber: string;
  verifiedAt: string;
}
