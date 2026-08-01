import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type { GetInquiriesResponse } from "../types/inquiryApi";

export async function getInquiries(): Promise<GetInquiriesResponse> {
  const res = await api.get<ApiEnvelope<GetInquiriesResponse>>(
    "/api/v1/inquiries",
  );
  return res.data.data;
}
