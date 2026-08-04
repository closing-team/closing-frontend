import type { PageInfoDto } from "./productApi";

export type ChatMessageType = "TEXT" | "IMAGE";

export interface ChatMessageDto {
  messageId: number;
  senderId: number;
  messageType: ChatMessageType;
  content: string;
  mine: boolean;
  createdAt: string;
  read: boolean;
}

export interface ChatProductSummaryDto {
  productId: number;
  title: string;
  thumbnailUrl: string;
  price: number;
  status: string;
}

export interface ChatMemberDto {
  memberId: number;
  nickname: string;
  profileImageUrl: string;
}

// POST /api/v1/chat-rooms/{productId} — 채팅방 생성 응답
export interface CreateChatRoomResponseData {
  chatRoomId: number;
  product: ChatProductSummaryDto;
  otherMember: ChatMemberDto;
  createdAt: string;
}

// GET /api/v1/chat-rooms/{chatRoomId}/messages — 메시지 히스토리 조회 응답
export interface ChatMessagePageDto {
  messages: ChatMessageDto[];
  page: PageInfoDto<number>;
}

// POST /api/v1/chat-rooms/{chatRoomId}/messages — 메시지 전송 응답
export interface SendChatMessageResponseData {
  messages: ChatMessageDto[];
}

// GET /api/v1/chat-rooms — 채팅방 목록 조회 응답
export interface ChatRoomListItemDto {
  chatRoomId: number;
  otherMember: ChatMemberDto;
  product: ChatProductSummaryDto;
  lastMessage: string;
  lastMessageAt: string;
  unReadMessagesCount: number;
}

export interface ChatRoomListDataDto {
  chatRooms: ChatRoomListItemDto[];
  page: PageInfoDto<string>;
}
