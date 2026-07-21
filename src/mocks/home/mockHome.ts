import type { Todo } from "../../components/home/TodoList";
import type { Plan } from "../../components/llm/PlanCard";

export const MOCK_PROGRESS = { completed: 8, total: 12 };

export const MOCK_SCHEDULES: Record<string, Plan[]> = {
  "2026-07-03": [
    {
      id: 1,
      title: "직원 정리",
      startDate: new Date(2026, 6, 3),
      startTime: { meridiem: "오전", hour: 10, minute: 0 },
      endDate: new Date(2026, 6, 3),
      endTime: { meridiem: "오후", hour: 5, minute: 0 },
    },
  ],
  "2026-07-07": [
    {
      id: 2,
      title: "점포 정리",
      startDate: new Date(2026, 6, 7),
      startTime: { meridiem: "오전", hour: 10, minute: 0 },
      endDate: new Date(2026, 6, 10),
      endTime: { meridiem: "오후", hour: 10, minute: 0 },
    },
  ],
  "2026-07-09": [
    {
      id: 3,
      title: "집기 중고 거래",
      startDate: new Date(2026, 6, 9),
      startTime: { meridiem: "오후", hour: 12, minute: 0 },
      endDate: new Date(2026, 6, 9),
      endTime: { meridiem: "오후", hour: 2, minute: 0 },
    },
    {
      id: 4,
      title: "세금 신고",
      startDate: new Date(2026, 6, 9),
      startTime: { meridiem: "오후", hour: 4, minute: 0 },
      endDate: new Date(2026, 6, 9),
      endTime: { meridiem: "오후", hour: 6, minute: 0 },
    },
  ],
  "2026-07-15": [
    {
      id: 5,
      title: "각종 해지하기",
      startDate: new Date(2026, 6, 15),
      startTime: { meridiem: "오전", hour: 10, minute: 0 },
      endDate: new Date(2026, 6, 15),
      endTime: { meridiem: "오후", hour: 3, minute: 0 },
    },
  ],
};

export const INITIAL_TODOS: Todo[] = [
  { id: 1, text: "점포 정리", done: true },
  { id: 2, text: "집기 중고 거래", done: false },
  { id: 3, text: "세금 신고", done: false },
];
