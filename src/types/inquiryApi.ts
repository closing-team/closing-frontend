export type InquiryStatus = "PENDING" | "ANSWERED";

export interface InquiryListItem {
  inquiryId: number;
  type: string;
  content: string;
  imageUrls: string[];
  status: InquiryStatus;
  answer: string | null;
  answeredAt: string | null;
  createdAt: string;
}

// GET /api/v1/inquiries — 문의 내역 목록 조회 응답
export type GetInquiriesResponseData = InquiryListItem[];

// POST /api/v1/inquiries — 문의 등록 요청과 응답
// multipart/form-data: type과 content는 쿼리 파라미터, images는 파일 파트(여러 장 가능)
export interface CreateInquiryRequestJson {
  type: string;
  content: string;
}

export type CreateInquiryResponseData = InquiryListItem;
