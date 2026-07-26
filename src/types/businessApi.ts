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
