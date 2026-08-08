import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  ChatMessageListDto,
  ChatRoomListDto,
  CreatedChatRoomDto,
  GetChatMessagesParams,
  GetChatRoomsParams,
  SendChatMessageDto,
} from "../types/chatApi";

export async function getChatRooms(
  params: GetChatRoomsParams = {},
): Promise<ChatRoomListDto> {
  const response = await api.get<ApiEnvelope<ChatRoomListDto>>(
    "/api/v1/chat-rooms",
    { params },
  );
  return response.data.data;
}

export async function createChatRoom(
  productId: number,
): Promise<CreatedChatRoomDto> {
  const response = await api.post<ApiEnvelope<CreatedChatRoomDto>>(
    `/api/v1/chat-rooms/${productId}`,
  );
  return response.data.data;
}

export async function getChatMessages(
  chatRoomId: number,
  params: GetChatMessagesParams = {},
): Promise<ChatMessageListDto> {
  const response = await api.get<ApiEnvelope<ChatMessageListDto>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    { params },
  );
  return response.data.data;
}

export async function sendTextMessage(
  chatRoomId: number,
  content: string,
): Promise<SendChatMessageDto> {
  const response = await api.post<ApiEnvelope<SendChatMessageDto>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    { content },
  );
  return response.data.data;
}

export async function sendImageMessages(
  chatRoomId: number,
  images: File[],
): Promise<SendChatMessageDto> {
  const formData = new FormData();
  images.forEach((image) => formData.append("images", image));
  const response = await api.post<ApiEnvelope<SendChatMessageDto>>(
    `/api/v1/chat-rooms/${chatRoomId}/messages`,
    formData,
  );
  return response.data.data;
}

export async function markChatRoomRead(chatRoomId: number): Promise<void> {
  await api.patch<ApiEnvelope<null>>(`/api/v1/chat-rooms/${chatRoomId}/read`);
}
