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
