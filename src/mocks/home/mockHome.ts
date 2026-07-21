import type { Todo } from "../../components/home/TodoList";

export const MOCK_PROGRESS = { completed: 8, total: 12 };

export const MOCK_SCHEDULES: Record<string, string[]> = {
  "2026-07-03": ["직원 정리"],
  "2026-07-07": ["점포 정리"],
  "2026-07-09": ["집기 중고 거래", "세금 신고"],
  "2026-07-15": ["각종 해지하기"],
};

export const INITIAL_TODOS: Todo[] = [
  { id: 1, text: "점포 정리", done: true },
  { id: 2, text: "집기 중고 거래", done: false },
  { id: 3, text: "세금 신고", done: false },
];
