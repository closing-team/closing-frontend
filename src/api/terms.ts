import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type { AgreeTermsRequestJson, TermDto } from "../types/termsApi";

export async function getTerms(): Promise<TermDto[]> {
  const res = await api.get<ApiEnvelope<TermDto[]>>("/api/v1/terms");
  return res.data.data;
}

export async function agreeTerms(request: AgreeTermsRequestJson): Promise<void> {
  await api.post<ApiEnvelope<Record<string, never>>>("/api/v1/terms/agree", request);
}
