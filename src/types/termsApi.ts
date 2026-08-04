// GET /api/v1/terms — 약관 목록 조회 응답 아이템
export interface TermDto {
  termId: number;
  type: string;
  version: string;
  content: string;
  effectiveDate: string;
  required: boolean;
}

// POST /api/v1/terms/agree — 약관 동의 요청
export interface AgreeTermsRequestJson {
  termIds: number[];
}
