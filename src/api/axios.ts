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

// 세션이 만료되면 백엔드가 COMMON401을 내려준다. api 인스턴스(인증된 요청)에서만
// 이걸 세션 만료로 취급해 자동 로그아웃시킨다. publicApi의 401은 카카오 로그인
// 실패 등 다른 의미라 여기서 건드리면 안 된다.
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
