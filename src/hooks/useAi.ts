import { useMutation, useQuery } from "@tanstack/react-query";
import {
  confirmAiSession,
  deleteAiSessionTask,
  getAiSession,
  sendAiSessionMessage,
  startAiSession,
  updateAiSessionTask,
} from "../api/ai";

export function useAiSessionQuery(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["aiSession", sessionId],
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
  return useMutation({
    mutationFn: confirmAiSession,
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
