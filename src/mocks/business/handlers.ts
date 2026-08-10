import { http, HttpResponse } from "msw";
import { upsertBusinessVerification } from "./db";
import type { VerifyBusinessRequestJson } from "../../types/businessApi";
import { CURRENT_USER_ID, OK } from "../common";

function formatBusinessNumber(digits: string): string {
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export const businessHandlers = [
  http.put("*/api/v1/businesses/verify", async ({ request }) => {
    const body = (await request.json()) as VerifyBusinessRequestJson;
    if (!body.businessNumber || !body.ownerName || !body.openDate) {
      return HttpResponse.json(
        { success: false, code: "COMMON500", message: "요청값 검증에 실패했습니다." },
        { status: 500 },
      );
    }

    const record = upsertBusinessVerification(CURRENT_USER_ID, {
      businessNumber: body.businessNumber,
      ownerName: body.ownerName,
      openDate: body.openDate,
    });

    return HttpResponse.json({
      ...OK,
      message: "사업자 인증이 완료되었습니다.",
      data: {
        registrationId: record.registrationId,
        businessNumber: formatBusinessNumber(record.businessNumber),
        verifiedAt: record.verifiedAt,
      },
    });
  }),
];
