import axios from "axios";
import { readAuthSession } from "../auth/authSession";

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
