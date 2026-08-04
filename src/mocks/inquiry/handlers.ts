import { http, HttpResponse } from "msw";
import { insertInquiry, listInquiries } from "./db";
import type { InquiryRecord } from "./db";
import type {
  CreateInquiryRequestJson,
  InquiryListItem,
} from "../../types/inquiryApi";
import { OK } from "../common";

function toListItem(inquiry: InquiryRecord): InquiryListItem {
  return {
    inquiryId: inquiry.id,
    type: inquiry.type,
    content: inquiry.content,
    imageUrls: inquiry.images ?? [],
    status: inquiry.status,
    answer: inquiry.answer?.content ?? null,
    answeredAt: inquiry.answer?.answeredAt.toISOString() ?? null,
    createdAt: inquiry.createdAt.toISOString(),
  };
}

export const inquiryHandlers = [
  http.get("*/api/v1/inquiries", () => {
    const inquiries = listInquiries().map(toListItem);

    return HttpResponse.json({ ...OK, data: inquiries });
  }),

  http.post("*/api/v1/inquiries", async ({ request }) => {
    const body = (await request.json()) as CreateInquiryRequestJson;

    if (!body.content || body.content.trim().length === 0) {
      return HttpResponse.json(
        {
          success: false,
          code: "INQUIRY_CONTENT_EMPTY",
          message: "문의 내용을 입력해 주세요.",
        },
        { status: 400 },
      );
    }

    const created = insertInquiry({
      type: body.type ?? "",
      content: body.content.trim(),
      images: body.imageUrls ?? [],
    });

    return HttpResponse.json({
      success: true,
      code: "COMMON200",
      message: "문의가 등록되었습니다.",
      data: toListItem(created),
    });
  }),
];
