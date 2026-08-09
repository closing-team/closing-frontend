import type { TermDto } from "../../types/authApi";

const terms: TermDto[] = [
  {
    termId: 1,
    type: "SERVICE",
    version: "1.0",
    content: "서비스 이용약관 동의",
    effectiveDate: "2026-01-01",
    required: true,
  },
  {
    termId: 2,
    type: "PRIVACY",
    version: "1.0",
    content: "개인정보 처리방침 동의",
    effectiveDate: "2026-01-01",
    required: true,
  },
  {
    termId: 3,
    type: "AGE",
    version: "1.0",
    content: "만 14세 이상입니다",
    effectiveDate: "2026-01-01",
    required: true,
  },
];

export function listTerms(): TermDto[] {
  return terms;
}
