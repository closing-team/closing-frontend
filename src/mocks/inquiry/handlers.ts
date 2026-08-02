import { http, HttpResponse } from "msw";
import { MOCK_INQUIRIES, insertInquiry } from "./mockInquiry";
import type { Inquiry } from "./mockInquiry";
import type { InquiryListItem } from "../../types/inquiryApi";

const OK = { success: true, code: "COMMON200", message: "성공입니다." } as const;

function toListItem(inquiry: Inquiry): InquiryListItem {
  return {
    inquiryId: inquiry.id,
    status: inquiry.status,
    title: inquiry.title,
    content: inquiry.content,
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

  http.post("*/api/v1/inquiries", async ({ request }) => {
    const formData = await request.formData();
    const type = formData.get("type");
    const content = formData.get("content");

    if (typeof content !== "string" || content.trim().length === 0) {
      return HttpResponse.json(
        {
          success: false,
          code: "INQUIRY_CONTENT400",
          message: "문의 내용을 입력해 주세요.",
        },
        { status: 400 },
      );
    }

    const images = formData.getAll("images") as File[];
    const imageUrls = images.map((file) => URL.createObjectURL(file));

    const created = insertInquiry({
      type: typeof type === "string" ? type : "",
      content: content.trim(),
      images: imageUrls,
    });

    return HttpResponse.json({
      success: true,
      code: "COMMON200",
      message: "문의가 등록되었습니다.",
      data: {
        inquiryId: created.id,
        title: created.title,
        status: created.status,
        createdAt: created.createdAt.toISOString(),
      },
    });
  }),
];
