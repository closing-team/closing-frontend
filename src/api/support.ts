import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  GetSupportsParams,
  SupportDetail,
  SupportListDataDto,
} from "../types/supportApi";

export async function getSupports(
  params: GetSupportsParams,
): Promise<SupportListDataDto> {
  const res = await api.get<ApiEnvelope<SupportListDataDto>>("/api/v1/supports", {
    params,
  });
  return res.data.data;
}

export async function getSupportDetail(
  supportId: number,
): Promise<SupportDetail> {
  const res = await api.get<ApiEnvelope<SupportDetail>>(
    `/api/v1/supports/${supportId}`,
  );
  return res.data.data;
}
