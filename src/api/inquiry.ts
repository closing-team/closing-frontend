import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  CreateInquiryRequestJson,
  CreateInquiryResponseData,
  GetInquiriesResponseData,
} from "../types/inquiryApi";

export async function getInquiries(): Promise<GetInquiriesResponseData> {
  const res = await api.get<ApiEnvelope<GetInquiriesResponseData>>(
    "/api/v1/inquiries",
  );
  return res.data.data;
}

export async function createInquiry(
  request: CreateInquiryRequestJson,
  images: File[],
): Promise<CreateInquiryResponseData> {
  const formData = new FormData();
  for (const image of images) {
    formData.append("images", image);
  }
  const res = await api.post<ApiEnvelope<CreateInquiryResponseData>>(
    "/api/v1/inquiries",
    formData,
    { params: { type: request.type, content: request.content } },
  );
  return res.data.data;
}
