import axios from "axios";
import { toTimeValue } from "./dateFormat";
import {
  parseApiDate,
  parseApiDateTime,
  toApiDateString,
  toApiTimeString,
} from "./scheduleAdapter";
import type { Plan } from "../components/common/PlanCard";
import type {
  AiConfirmedTaskDto,
  AiGeneratedTaskDto,
  UpdateAiSessionTaskRequestJson,
} from "../types/aiApi";

const DEFAULT_AI_CONFIRM_ERROR_MESSAGE =
  "일정을 캘린더에 추가하지 못했어요. 다시 시도해주세요.";

const AI_CONFIRM_ERROR_MESSAGES: Record<string, string> = {
  AI_SESSION_ACCESS_FORBIDDEN: "본인의 세션만 확정할 수 있어요.",
  AI_SESSION404: "세션 정보를 찾을 수 없어요. 처음부터 다시 시작해 주세요.",
  AI_SESSION409: "이미 확정된 일정이에요.",
  AI_NO_TASKS409: "확정할 일정이 없어요.",
};

export function getAiConfirmErrorMessage(error: unknown): string {
  if (!axios.isAxiosError<{ code?: string; message?: string }>(error)) {
    return DEFAULT_AI_CONFIRM_ERROR_MESSAGE;
  }
  const code = error.response?.data?.code;
  if (code && AI_CONFIRM_ERROR_MESSAGES[code]) {
    return AI_CONFIRM_ERROR_MESSAGES[code];
  }
  return error.response?.data?.message ?? DEFAULT_AI_CONFIRM_ERROR_MESSAGE;
}

export function toPlan(task: AiGeneratedTaskDto): Plan {
  return {
    id: task.tempId,
    title: task.title,
    startDate: parseApiDate(task.startDate),
    startTime: toTimeValue(parseApiDateTime(task.startDate, task.startTime)),
    endDate: parseApiDate(task.endDate),
    endTime: toTimeValue(parseApiDateTime(task.endDate, task.endTime)),
    memo: task.memo,
  };
}

export function toPlanFromConfirmedTask(task: AiConfirmedTaskDto): Plan {
  return {
    id: task.taskId,
    title: task.title,
    startDate: parseApiDate(task.startDate),
    startTime: toTimeValue(parseApiDateTime(task.startDate, task.startTime)),
    endDate: parseApiDate(task.endDate),
    endTime: toTimeValue(parseApiDateTime(task.endDate, task.endTime)),
    memo: task.description,
  };
}

// generatedTasks는 아직 생성되지 않은 턴이면 null
export function toPlans(tasks: AiGeneratedTaskDto[] | null | undefined): Plan[] {
  return (tasks ?? []).map(toPlan);
}

export function toConfirmedPlans(tasks: AiConfirmedTaskDto[]): Plan[] {
  return tasks.map(toPlanFromConfirmedTask);
}

export function toUpdateAiTaskRequest(
  plan: Plan,
  memo: string,
): UpdateAiSessionTaskRequestJson {
  return {
    title: plan.title,
    startDate: toApiDateString(plan.startDate),
    endDate: toApiDateString(plan.endDate),
    startTime: toApiTimeString(plan.startTime),
    endTime: toApiTimeString(plan.endTime),
    memo,
  };
}
