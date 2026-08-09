export interface ChatMemberDto {
  memberId: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface ChatProductDto {
  productId: number;
  title: string;
  thumbnailUrl: string | null;
  price: number;
  status: "SELLING" | "RESERVED" | "SOLD_OUT" | string;
  tradeLocation?: {
    district: string;
    latitude: number;
    longitude: number;
    distanceKm: number | null;
  } | null;
}

export type ChatProductSummaryDto = ChatProductDto;

export type ChatMessageType = "TEXT" | "IMAGE";

export interface ChatRoomDto {
  chatRoomId: number;
  otherMember: ChatMemberDto;
  product: ChatProductDto;
  lastMessage: string | null;
  lastMessageAt: string | null;
  unreadMessageCount: number;
}

export interface CreatedChatRoomDto {
  chatRoomId: number;
  otherMember: ChatMemberDto;
  product: ChatProductDto;
  createdAt: string;
}

export interface CursorPageDto<TCursor> {
  nextCursor: TCursor | null;
  hasNext: boolean;
}

export interface ChatRoomListDto {
  chatRooms: ChatRoomDto[];
  page: CursorPageDto<string>;
}

export interface ChatMessageDto {
  messageId: number;
  senderId: number;
  messageType: "TEXT" | "IMAGE" | string;
  content: string | null;
  mine: boolean;
  read?: boolean;
  isRead?: boolean;
  createdAt: string;
}

export interface ChatMessageListDto {
  messages: ChatMessageDto[];
  page: CursorPageDto<number>;
}

export interface SendChatMessageDto {
  messages: ChatMessageDto[];
}

export interface GetChatRoomsParams {
  cursor?: string;
  size?: number;
}

export interface GetChatMessagesParams {
  cursor?: number;
  size?: number;
}
