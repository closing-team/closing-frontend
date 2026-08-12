import { formatKoreanDate } from "./dateFormat";
import type { HighlightRow } from "../components/guide/HighlightBox";

const STEP3_DUE_DATE_NOT_SET = "1단계에서 희망 종료일을 먼저 입력해주세요";

export function parseDueDate(value: string): Date | null {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (month < 1 || month > 12) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

export function validateDueDate(value: string): string | null {
  if (value.length !== 8) {
    return "희망 종료일 8자리를 입력해 주세요.";
  }

  const parsed = parseDueDate(value);
  if (!parsed) {
    return "올바른 희망 종료일을 입력해 주세요.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed <= today) {
    return "희망 종료일은 오늘 이후 날짜만 입력할 수 있습니다.";
  }

  return null;
}

export function buildStep3DeadlineRows(dueDate: string): HighlightRow[] {
  const parsed = parseDueDate(dueDate);
  if (!parsed) {
    return [
      { label: "희망 영업 종료일 (1단계 연동)", value: STEP3_DUE_DATE_NOT_SET },
      {
        label: "직원 해고 통보 마지노선 (최소 30일 전)",
        value: STEP3_DUE_DATE_NOT_SET,
      },
    ];
  }

  const noticeDeadline = new Date(parsed);
  noticeDeadline.setDate(noticeDeadline.getDate() - 30);

  return [
    { label: "희망 영업 종료일 (1단계 연동)", value: formatKoreanDate(parsed) },
    {
      label: "직원 해고 통보 마지노선 (최소 30일 전)",
      value: `${formatKoreanDate(noticeDeadline)} 이전`,
      valueColor: "primary-500",
    },
  ];
}
