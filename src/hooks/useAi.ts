import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmAiSession,
  deleteAiSessionTask,
  getAiSession,
  sendAiSessionMessage,
  startAiSession,
  updateAiSessionTask,
} from "../api/ai";
import { scheduleKeys } from "./useSchedule";

export const aiKeys = {
  session: (sessionId: string | undefined) => ["aiSession", sessionId] as const,
};

export function useAiSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: aiKeys.session(sessionId),
    queryFn: () => getAiSession(sessionId!),
    enabled: !!sessionId,
  });
}

export function useStartAiSessionMutation() {
  return useMutation({
    mutationFn: startAiSession,
  });
}

export function useSendAiSessionMessageMutation() {
  return useMutation({
    mutationFn: ({
      sessionId,
      message,
    }: {
      sessionId: string;
      message: string;
    }) => sendAiSessionMessage(sessionId, { message }),
  });
}

export function useConfirmAiSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: confirmAiSession,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: scheduleKeys.homeAll() }),
  });
}

export function useDeleteAiSessionTaskMutation() {
  return useMutation({
    mutationFn: ({
      sessionId,
      tempId,
    }: {
      sessionId: string;
      tempId: string;
    }) => deleteAiSessionTask(sessionId, tempId),
  });
}

export function useUpdateAiSessionTaskMutation() {
  return useMutation({
    mutationFn: ({
      sessionId,
      tempId,
      request,
    }: {
      sessionId: string;
      tempId: string;
      request: Parameters<typeof updateAiSessionTask>[2];
    }) => updateAiSessionTask(sessionId, tempId, request),
  });
}
