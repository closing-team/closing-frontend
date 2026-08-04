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
  request: Omit<CreateInquiryRequestJson, "imageUrls">,
  images: File[],
): Promise<CreateInquiryResponseData> {
  // TODO: 별도 이미지 업로드 API가 생기면 그 응답 URL로 교체. 지금은 blob URL을 그대로 전달한다.
  const imageUrls = images.map((image) => URL.createObjectURL(image));
  const res = await api.post<ApiEnvelope<CreateInquiryResponseData>>(
    "/api/v1/inquiries",
    { ...request, imageUrls },
  );
  return res.data.data;
}
