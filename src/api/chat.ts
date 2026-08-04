import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  ChatMessagePageDto,
  ChatRoomListDataDto,
  CreateChatRoomResponseData,
  SendChatMessageResponseData,
} from "../types/chatApi";

function toRequestBlob(payload: unknown): Blob {
  return new Blob([JSON.stringify(payload)], { type: "application/json" });
}

export async function createOrGetChatRoom(
  productId: number,
): Promise<CreateChatRoomResponseData> {
  const res = await api.post<ApiEnvelope<CreateChatRoomResponseData>>(
    `/api/v1/chat-rooms/${productId}`,
  );
  return res.data.data;
}

export async function getChatMessages(
  chatRoomId: number,
  params: { cursor?: number; size?: number },
): Promise<ChatMessagePageDto> {
  const res = await api.get<ApiEnvelope<ChatMessagePageDto>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    { params },
  );
  return res.data.data;
}

export async function sendChatText(
  chatRoomId: number,
  content: string,
): Promise<SendChatMessageResponseData> {
  const formData = new FormData();
  formData.append("content", toRequestBlob({ content }));
  const res = await api.post<ApiEnvelope<SendChatMessageResponseData>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    formData,
  );
  return res.data.data;
}

// 이미지 메시지 전송 (이미지마다 별도 메시지로 생성됨)
export async function sendChatImages(
  chatRoomId: number,
  images: File[],
): Promise<SendChatMessageResponseData> {
  const formData = new FormData();
  for (const image of images) {
    formData.append("images", image);
  }
  const res = await api.post<ApiEnvelope<SendChatMessageResponseData>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    formData,
  );
  return res.data.data;
}

// 채팅방의 상대방 메시지 읽음 처리
export async function markChatRoomRead(chatRoomId: number): Promise<void> {
  await api.patch<ApiEnvelope<Record<string, never>>>(
    `/api/v1/chat-rooms/${chatRoomId}/read`,
  );
}

export async function getChatRooms(params: {
  cursor?: string;
  size?: number;
}): Promise<ChatRoomListDataDto> {
  const res = await api.get<ApiEnvelope<ChatRoomListDataDto>>(
    "/api/v1/chat-rooms",
    { params },
  );
  return res.data.data;
}
