import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  StartAiSessionRequestJson,
  StartAiSessionResponseData,
  SendAiSessionMessageRequestJson,
  SendAiSessionMessageResponseData,
  ConfirmAiSessionResponseData,
  UpdateAiSessionTaskRequestJson,
  UpdateAiSessionTaskResponseData,
  GetAiSessionResponseData,
} from "../types/aiApi";

export async function startAiSession(
  request: StartAiSessionRequestJson,
): Promise<StartAiSessionResponseData> {
  const res = await api.post<ApiEnvelope<StartAiSessionResponseData>>(
    "/api/v1/ai/sessions",
    request,
  );
  return res.data.data;
}

export async function sendAiSessionMessage(
  sessionId: string,
  request: SendAiSessionMessageRequestJson,
): Promise<SendAiSessionMessageResponseData> {
  const res = await api.post<ApiEnvelope<SendAiSessionMessageResponseData>>(
    `/api/v1/ai/sessions/${sessionId}/messages`,
    request,
  );
  return res.data.data;
}

export async function confirmAiSession(
  sessionId: string,
): Promise<ConfirmAiSessionResponseData> {
  const res = await api.post<ApiEnvelope<ConfirmAiSessionResponseData>>(
    `/api/v1/ai/sessions/${sessionId}/confirm`,
  );
  return res.data.data;
}

export async function deleteAiSessionTask(
  sessionId: string,
  tempId: string,
): Promise<void> {
  await api.delete<ApiEnvelope<Record<string, never>>>(
    `/api/v1/ai/sessions/${sessionId}/tasks/${tempId}`,
  );
}

export async function updateAiSessionTask(
  sessionId: string,
  tempId: string,
  request: UpdateAiSessionTaskRequestJson,
): Promise<UpdateAiSessionTaskResponseData> {
  const res = await api.patch<ApiEnvelope<UpdateAiSessionTaskResponseData>>(
    `/api/v1/ai/sessions/${sessionId}/tasks/${tempId}`,
    request,
  );
  return res.data.data;
}

export async function getAiSession(
  sessionId: string,
): Promise<GetAiSessionResponseData> {
  const res = await api.get<ApiEnvelope<GetAiSessionResponseData>>(
    `/api/v1/ai/sessions/${sessionId}`,
  );
  return res.data.data;
}
