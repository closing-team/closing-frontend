import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  completeTask,
  createTask,
  deleteTask,
  getHomeTasks,
  getTaskDetail,
  updateTask,
} from "../api/schedule";
import type { UpdateTaskRequestJson } from "../types/scheduleApi";

export const scheduleKeys = {
  homeAll: () => ["schedule", "home"] as const,
  home: (yearMonth: string) => ["schedule", "home", yearMonth] as const,
  detail: (taskId: number) => ["schedule", "detail", taskId] as const,
};

export function useHomeTasksQuery(yearMonth: string) {
  return useQuery({
    queryKey: scheduleKeys.home(yearMonth),
    queryFn: () => getHomeTasks(yearMonth),
  });
}

export function useTaskDetailQuery(taskId: number | undefined) {
  return useQuery({
    queryKey: scheduleKeys.detail(taskId ?? -1),
    queryFn: () => getTaskDetail(taskId!),
    enabled: taskId !== undefined && !Number.isNaN(taskId),
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleKeys.homeAll() }),
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      request,
    }: {
      taskId: number;
      request: UpdateTaskRequestJson;
    }) => updateTask(taskId, request),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.homeAll() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(taskId) });
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: scheduleKeys.homeAll() }),
  });
}

export function useCompleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      isCompleted,
    }: {
      taskId: number;
      isCompleted: boolean;
    }) => completeTask(taskId, { isCompleted }),
    onSuccess: (_data, { taskId }) => {
      queryClient.invalidateQueries({ queryKey: scheduleKeys.homeAll() });
      queryClient.invalidateQueries({ queryKey: scheduleKeys.detail(taskId) });
    },
  });
}
