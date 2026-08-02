export type InquiryStatus = "pending" | "answered";

export interface InquiryListItem {
  inquiryId: number;
  status: InquiryStatus;
  title: string;
  content: string;
  createdAt: string;
  answer: string | null;
  answeredAt: string | null;
  imageUrls?: string[];
}

export interface InquirySummary {
  totalCount: number;
  answeredCount: number;
}

export interface GetInquiriesResponse {
  summary: InquirySummary;
  inquiries: InquiryListItem[];
}
