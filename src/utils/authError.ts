import { isAxiosError } from "axios";

type ApiErrorResponse = {
  code?: unknown;
};

const TEMPORARY_ERROR_MESSAGE = "일시적인 오류가 발생했습니다. 다시 시도해주세요.";

export function getApiErrorCode(error: unknown): string | undefined {
  if (!isAxiosError<ApiErrorResponse>(error)) {
    return undefined;
  }

  const code = error.response?.data?.code;
  return typeof code === "string" ? code : undefined;
}

export function getLoginErrorMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "AUTH401":
      return "카카오 인증에 실패했습니다. 다시 시도해주세요.";
    case "AUTH_KAKAO_EXPIRED":
      return "카카오 로그인 시간이 만료되었습니다. 다시 시도해주세요.";
    case "COMMON500":
      return TEMPORARY_ERROR_MESSAGE;
    default:
      return "카카오 로그인에 실패했습니다. 다시 시도해주세요.";
  }
}

export function getSignupErrorMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "AUTH_SIGNUP_TOKEN404":
      return "가입 정보가 만료되었습니다. 카카오 로그인을 다시 진행해주세요.";
    case "TERM_REQUIRED400":
      return "필수 약관에 모두 동의해주세요.";
    case "USER_UNDER14400":
      return "만 14세 미만은 가입할 수 없습니다.";
    default:
      return TEMPORARY_ERROR_MESSAGE;
  }
}

export function getLogoutErrorMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "COMMON401":
      return "로그인 정보가 만료되었습니다.";
    default:
      return TEMPORARY_ERROR_MESSAGE;
  }
}

export function getWithdrawErrorMessage(error: unknown): string {
  switch (getApiErrorCode(error)) {
    case "COMMON401":
      return "로그인 정보가 만료되었습니다.";
    default:
      return TEMPORARY_ERROR_MESSAGE;
  }
}
