import type { Plan } from "../../components/llm/PlanCard";

export const MOCK_PLANS: Plan[] = [
  {
    id: 1,
    title: "임대인 통보 및 폐업 신고하기",
    startDate: new Date(2026, 4, 10),
    startTime: { meridiem: "오전", hour: 10, minute: 0 },
    endDate: new Date(2026, 4, 13),
    endTime: { meridiem: "오후", hour: 10, minute: 0 },
  },
  {
    id: 2,
    title: "직원 퇴직금 계산 및 서류 준비하기",
    startDate: new Date(2026, 4, 13),
    startTime: { meridiem: "오전", hour: 10, minute: 0 },
    endDate: new Date(2026, 4, 19),
    endTime: { meridiem: "오후", hour: 10, minute: 0 },
  },
  {
    id: 3,
    title: "집기 리스트 업로드 및 매각하기",
    startDate: new Date(2026, 4, 13),
    startTime: { meridiem: "오전", hour: 10, minute: 0 },
    endDate: new Date(2026, 4, 29),
    endTime: { meridiem: "오후", hour: 10, minute: 0 },
  },
];
