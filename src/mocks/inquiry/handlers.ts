import { http, HttpResponse } from "msw";
import { insertInquiry, listInquiries } from "./db";
import type { InquiryRecord } from "./db";
import type { InquiryListItem } from "../../types/inquiryApi";
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
    const url = new URL(request.url);
    const type = url.searchParams.get("type") ?? "";
    const content = url.searchParams.get("content") ?? "";

    if (!content || content.trim().length === 0) {
      return HttpResponse.json(
        {
          success: false,
          code: "INQUIRY_CONTENT_EMPTY",
          message: "문의 내용을 입력해 주세요.",
        },
        { status: 400 },
      );
    }

    // 이미지 파트가 없는 빈 FormData는 브라우저에서 재파싱 시 에러가 나므로 방어적으로 처리
    const imageFiles = await request
      .formData()
      .then((formData) => formData.getAll("images") as File[])
      .catch(() => []);
    const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));

    const created = insertInquiry({
      type,
      content: content.trim(),
      images: imageUrls,
    });

    return HttpResponse.json({
      success: true,
      code: "COMMON200",
      message: "문의가 등록되었습니다.",
      data: toListItem(created),
    });
  }),
];
