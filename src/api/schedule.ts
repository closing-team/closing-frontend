import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  HomeTasksResponseData,
  TaskDetailDto,
  CreateTaskRequestJson,
  CreateTaskResponseData,
  UpdateTaskRequestJson,
  UpdateTaskResponseData,
  CompleteTaskRequestJson,
  CompleteTaskResponseData,
} from "../types/scheduleApi";

// 홈 화면 전체 조회 (캘린더, 할일, 진행률 등)
export async function getHomeTasks(
  yearMonth: string, // "2026-07" 형식
): Promise<HomeTasksResponseData> {
  const res = await api.get<ApiEnvelope<HomeTasksResponseData>>(
    "/api/v1/tasks/home",
    { params: { yearMonth } },
  );
  return res.data.data;
}

// 일정 상세 조회
export async function getTaskDetail(taskId: number): Promise<TaskDetailDto> {
  const res = await api.get<ApiEnvelope<TaskDetailDto>>(
    `/api/v1/tasks/${taskId}`,
  );
  return res.data.data;
}

// 일정 추가
export async function createTask(
  request: CreateTaskRequestJson,
): Promise<CreateTaskResponseData> {
  const res = await api.post<ApiEnvelope<CreateTaskResponseData>>(
    "/api/v1/tasks",
    request,
  );
  return res.data.data;
}

// 일정 수정
export async function updateTask(
  taskId: number,
  request: UpdateTaskRequestJson,
): Promise<UpdateTaskResponseData> {
  const res = await api.patch<ApiEnvelope<UpdateTaskResponseData>>(
    `/api/v1/tasks/${taskId}`,
    request,
  );
  return res.data.data;
}

// 일정 삭제
export async function deleteTask(taskId: number): Promise<void> {
  await api.delete<ApiEnvelope<undefined>>(`/api/v1/tasks/${taskId}`);
}

// 완료 처리
export async function completeTask(
  taskId: number,
  request: CompleteTaskRequestJson,
): Promise<CompleteTaskResponseData> {
  const res = await api.patch<ApiEnvelope<CompleteTaskResponseData>>(
    `/api/v1/tasks/${taskId}/complete`,
    request,
  );
  return res.data.data;
}
