import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  CreateInquiryRequestJson,
  CreateInquiryResponseData,
  GetInquiriesResponse,
} from "../types/inquiryApi";

export async function getInquiries(): Promise<GetInquiriesResponse> {
  const res = await api.get<ApiEnvelope<GetInquiriesResponse>>(
    "/api/v1/inquiries",
  );
  return res.data.data;
}

export async function createInquiry(
  request: CreateInquiryRequestJson,
  images: File[],
): Promise<CreateInquiryResponseData> {
  const formData = new FormData();
  formData.append("type", request.type);
  formData.append("content", request.content);
  for (const image of images) {
    formData.append("images", image);
  }
  const res = await api.post<ApiEnvelope<CreateInquiryResponseData>>(
    "/api/v1/inquiries",
    formData,
  );
  return res.data.data;
}
