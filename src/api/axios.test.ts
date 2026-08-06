import type { AxiosAdapter, InternalAxiosRequestConfig } from "axios";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  clearAuthSession,
  saveAuthSession,
} from "../auth/authSession";
import { api } from "./axios";

async function captureRequestConfig(): Promise<InternalAxiosRequestConfig> {
  let requestConfig: InternalAxiosRequestConfig | undefined;
  const adapter: AxiosAdapter = async (config) => {
    requestConfig = config;

    return {
      data: null,
      status: 200,
      statusText: "OK",
      headers: {},
      config,
    };
  };

  await api.get("/interceptor-test", { adapter });

  if (!requestConfig) {
    throw new Error("Axios adapter did not receive a request config");
  }

  return requestConfig;
}

describe("api Authorization interceptor", () => {
  beforeEach(() => {
    clearAuthSession();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("환경변수가 없으면 가이드의 로컬 백엔드 주소를 사용한다", async () => {
    vi.stubEnv("VITE_API_BASE_URL", "");
    vi.resetModules();

    const { api: apiWithoutConfiguredBaseUrl } = await import("./axios");

    expect(apiWithoutConfiguredBaseUrl.defaults.baseURL).toBe(
      "http://localhost:8080",
    );
  });

  it("AuthSession이 없으면 Authorization 헤더를 추가하지 않는다", async () => {
    const config = await captureRequestConfig();

    expect(config.headers.has("Authorization")).toBe(false);
  });

  it("AuthSession의 access token에 Bearer 접두사를 정확히 한 번 붙인다", async () => {
    saveAuthSession({
      userId: 1,
      nickname: "원흥동 상사",
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    const config = await captureRequestConfig();

    expect(config.headers.get("Authorization")).toBe("Bearer access-token");
    expect(config.headers.get("Authorization")).not.toBe(
      "Bearer Bearer access-token",
    );
  });
});
