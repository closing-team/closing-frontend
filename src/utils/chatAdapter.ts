import { formatTimeAgo } from "./timeAgo";
import type {
  ChatMessageDto,
  ChatRoomListItemDto,
  CreateChatRoomResponseData,
} from "../types/chatApi";
import type { ChatMessage, ChatRoomDetail, ChatRoomSummary } from "../types/chat";

function formatDateLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatDisplayTime(isoDate: string): string {
  const date = new Date(isoDate);
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 || 12;
  return `${ampm} ${h12}:${String(m).padStart(2, "0")}`;
}

export function toChatRoomDetail(
  room: CreateChatRoomResponseData,
  messages: ChatMessageDto[],
): ChatRoomDetail {
  const last = messages.at(-1);
  const dateLabel = formatDateLabel(
    last ? new Date(last.createdAt) : new Date(room.createdAt),
  );

  return {
    id: String(room.chatRoomId),
    partnerNickname: room.otherMember.nickname,
    partnerAvatarUrl: room.otherMember.profileImageUrl,
    dateLabel,
    product: {
      id: String(room.product.productId),
      title: room.product.title,
      price: room.product.price,
      imageUrl: room.product.thumbnailUrl,
    },
  };
}

export function toChatMessages(
  chatRoomId: number,
  messages: ChatMessageDto[],
): ChatMessage[] {
  return messages.map((message) => ({
    id: String(message.messageId),
    roomId: String(chatRoomId),
    sender: message.mine ? "me" : "other",
    type: message.messageType === "IMAGE" ? "image" : "text",
    content: message.content,
    sentAt: message.createdAt,
    displayTime: formatDisplayTime(message.createdAt),
    read: message.read,
  }));
}

export function toChatRoomSummaries(
  items: ChatRoomListItemDto[],
): ChatRoomSummary[] {
  return items.map((item) => ({
    id: String(item.chatRoomId),
    productId: String(item.product.productId),
    productName: item.product.title,
    productImageUrl: item.product.thumbnailUrl,
    partnerNickname: item.otherMember.nickname,
    partnerAvatarUrl: item.otherMember.profileImageUrl,
    location: "",
    lastMessage: item.lastMessage,
    lastMessageAt: item.lastMessageAt,
    relativeTime: formatTimeAgo(item.lastMessageAt),
    unreadCount: item.unReadMessagesCount,
  }));
}
