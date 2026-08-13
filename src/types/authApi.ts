export interface KakaoLoginRequest {
  code: string;
}

export interface KakaoLoginData {
  newUser: boolean;
  accessToken: string;
  refreshToken: string;
}

export interface TermDto {
  termId: number;
  type: "SERVICE" | "PRIVACY" | "AGE" | string;
  version: string;
  content: string;
  effectiveDate: string;
  required: boolean;
}

export interface SignupRequest {
  name: string;
  nickname: string;
  phone: string;
  email?: string;
  image?: File;
}

export interface SignupResponseData {
  accessToken: string;
  refreshToken: string;
}

export interface AgreeTermsRequest {
  termIds: number[];
}

export interface AuthSession {
  userId?: number;
  nickname?: string;
  accessToken: string;
  refreshToken: string;
}

export interface OAuthPendingSignup {
  kind: "oauth";
}

export type PendingSignup = OAuthPendingSignup;
