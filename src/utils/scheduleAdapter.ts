import { toTimeValue, combineDateAndTime } from "./dateFormat";
import type { Plan } from "../components/common/PlanCard";
import type { Todo } from "../components/home/TodoList";
import type {
  HomeTaskCalendarItem,
  CreateTaskRequestJson,
  TaskDetailDto,
} from "../types/scheduleApi";

export function parseApiDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function parseApiDateTime(dateStr: string, timeStr: string): Date {
  const [h, minute] = timeStr.split(":").map(Number);
  const date = parseApiDate(dateStr);
  date.setHours(h, minute, 0, 0);
  return date;
}

export function toApiDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function toApiTimeString(time: Plan["startTime"]): string {
  const combined = combineDateAndTime(new Date(), time);
  return `${String(combined.getHours()).padStart(2, "0")}:${String(combined.getMinutes()).padStart(2, "0")}`;
}

export function toPlan(item: HomeTaskCalendarItem): Plan {
  return {
    id: item.taskId,
    title: item.title,
    startDate: parseApiDate(item.startDate),
    startTime: toTimeValue(parseApiDateTime(item.startDate, item.startTime)),
    endDate: parseApiDate(item.endDate),
    endTime: toTimeValue(parseApiDateTime(item.endDate, item.endTime)),
  };
}

// 일정 상세 조회
export function taskDetailToPlan(detail: TaskDetailDto): Plan {
  return {
    id: detail.taskId,
    title: detail.title,
    startDate: parseApiDate(detail.startDate),
    startTime: toTimeValue(
      parseApiDateTime(detail.startDate, detail.startTime),
    ),
    endDate: parseApiDate(detail.endDate),
    endTime: toTimeValue(parseApiDateTime(detail.endDate, detail.endTime)),
    memo: detail.description,
  };
}

// 일정의 시작일 기준으로 그룹핑
export function groupPlansByDate(
  items: HomeTaskCalendarItem[],
): Record<string, Plan[]> {
  const grouped: Record<string, Plan[]> = {};
  for (const item of items) {
    (grouped[item.startDate] ??= []).push(toPlan(item));
  }
  return grouped;
}

// 시작일이 오늘인 일정만 추출
export function toTodayTodos(items: HomeTaskCalendarItem[]): Todo[] {
  const todayKey = toApiDateString(new Date());
  return items
    .filter((item) => item.startDate === todayKey)
    .map((item) => ({
      id: item.taskId,
      text: item.title,
      done: item.isCompleted,
    }));
}

export function toTaskRequest(
  plan: Plan,
  description: string,
): CreateTaskRequestJson {
  return {
    title: plan.title,
    startDate: toApiDateString(plan.startDate),
    endDate: toApiDateString(plan.endDate),
    startTime: toApiTimeString(plan.startTime),
    endTime: toApiTimeString(plan.endTime),
    description,
  };
}
