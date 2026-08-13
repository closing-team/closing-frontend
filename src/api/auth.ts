import { api, publicApi } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  AgreeTermsRequest,
  KakaoLoginData,
  KakaoLoginRequest,
  SignupRequest,
  SignupResponseData,
  TermDto,
} from "../types/authApi";

export async function loginWithKakao(
  request: KakaoLoginRequest,
): Promise<KakaoLoginData> {
  const response = await publicApi.post<ApiEnvelope<KakaoLoginData>>(
    "/api/v1/auth/kakao",
    request,
  );
  return response.data.data;
}

export async function getTerms(): Promise<TermDto[]> {
  const response = await publicApi.get<ApiEnvelope<TermDto[]>>("/api/v1/terms");
  return response.data.data;
}

export async function signup(
  request: SignupRequest,
): Promise<SignupResponseData> {
  const formData = new FormData();
  if (request.image) {
    formData.append("image", request.image);
  }

  const response = await api.post<ApiEnvelope<SignupResponseData>>(
    "/api/v1/auth/signup",
    formData,
    {
      params: {
        name: request.name,
        nickname: request.nickname,
        phone: request.phone,
        email: request.email || undefined,
      },
    },
  );
  return response.data.data;
}

export async function agreeTerms(request: AgreeTermsRequest): Promise<void> {
  await api.post<ApiEnvelope<null>>("/api/v1/terms/agree", request);
}

export async function logout(): Promise<void> {
  await api.post<ApiEnvelope<null>>("/api/v1/auth/logout");
}
