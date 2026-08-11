import axios from "axios";
import { clearAuthSession, readAuthSession } from "../auth/authSession";
import { getApiErrorCode } from "../utils/authError";
import { ROUTES } from "../constants/routes";

const clientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  timeout: 5000,
};

export const publicApi = axios.create(clientConfig);
export const api = axios.create(clientConfig);

api.interceptors.request.use((config) => {
  const accessToken = readAuthSession()?.accessToken;
  if (accessToken) {
    config.headers.set("Authorization", `Bearer ${accessToken}`);
  }
  return config;
});

// COMMON401은 세션 만료 시 백엔드가 내려주는 코드. api 인스턴스(인증된 요청)에서만
// 세션 만료로 취급해 자동 로그아웃 처리. publicApi의 401은 카카오 로그인 실패 등
// 다른 의미라 여기서는 제외
let isRedirectingToLogin = false;

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    const alreadyOnLoginPage = window.location.pathname === ROUTES.LOGIN;

    if (
      getApiErrorCode(error) === "COMMON401" &&
      !isRedirectingToLogin &&
      !alreadyOnLoginPage
    ) {
      isRedirectingToLogin = true;
      clearAuthSession();
      window.location.href = ROUTES.LOGIN;
    }

    return Promise.reject(error);
  },
);
