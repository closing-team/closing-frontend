import { MOCK_INQUIRIES } from "./mockInquiry";

export type InquiryStatus = "PENDING" | "ANSWERED";

export interface InquiryAnswer {
  content: string;
  answeredAt: Date;
}

export interface InquiryRecord {
  id: number;
  type: string;
  status: InquiryStatus;
  content: string;
  images?: string[];
  createdAt: Date;
  answer?: InquiryAnswer;
}

let inquiries: InquiryRecord[] = MOCK_INQUIRIES;
let nextId = Math.max(...inquiries.map((i) => i.id)) + 1;

export function listInquiries(): InquiryRecord[] {
  return inquiries;
}

export function insertInquiry(input: {
  type: string;
  content: string;
  images: string[];
}): InquiryRecord {
  const created: InquiryRecord = {
    id: nextId++,
    type: input.type,
    status: "PENDING",
    content: input.content,
    images: input.images,
    createdAt: new Date(),
  };
  inquiries = [created, ...inquiries];
  return created;
}
