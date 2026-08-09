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
