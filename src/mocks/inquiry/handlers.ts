import { http, HttpResponse } from "msw";
import { MOCK_INQUIRIES } from "./mockInquiry";
import type { Inquiry } from "./mockInquiry";
import type { InquiryListItem } from "../../types/inquiryApi";

const OK = { success: true, code: "COMMON200", message: "성공입니다." } as const;

function toListItem(inquiry: Inquiry): InquiryListItem {
  const [title, ...rest] = inquiry.content.split("\n");
  return {
    inquiryId: inquiry.id,
    status: inquiry.status,
    title,
    content: rest.join("\n"),
    createdAt: inquiry.createdAt.toISOString(),
    answer: inquiry.answer?.content ?? null,
    answeredAt: inquiry.answer?.answeredAt.toISOString() ?? null,
  };
}

export const inquiryHandlers = [
  http.get("*/api/v1/inquiries", () => {
    const inquiries = MOCK_INQUIRIES.map(toListItem);
    const summary = {
      totalCount: inquiries.length,
      answeredCount: inquiries.filter((inquiry) => inquiry.status === "answered")
        .length,
    };

    return HttpResponse.json({ ...OK, data: { summary, inquiries } });
  }),
];
