import type { ChatMessage, ChatRoomDetail, ChatRoomSummary } from "../types/chat";
import type {
  ChatMessageDto,
  ChatRoomDto,
  CreatedChatRoomDto,
} from "../types/chatApi";
import type { SaleStatus } from "../types/used";
import { formatTimeAgo } from "./timeAgo";

type ChatRoomHeaderDto = ChatRoomDto | CreatedChatRoomDto;

function toSaleStatus(status: string): SaleStatus | undefined {
  if (status === "SELLING") return "selling";
  if (status === "RESERVED") return "reserved";
  if (status === "SOLD_OUT") return "completed";
  return undefined;
}

function formatDateLabel(value: string): string {
  const date = new Date(value);
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function formatMessageTime(value: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

export function chatRoomDtoToSummary(
  room: ChatRoomDto,
  now: Date = new Date(),
): ChatRoomSummary {
  return {
    id: String(room.chatRoomId),
    productId: String(room.product.productId),
    productName: room.product.title,
    productImageUrl: room.product.thumbnailUrl ?? "",
    partnerNickname: room.otherMember.nickname,
    partnerAvatarUrl: room.otherMember.profileImageUrl ?? "",
    location: room.product.tradeLocation?.district ?? "",
    lastMessage: room.lastMessage ?? "아직 메시지가 없습니다.",
    lastMessageAt: room.lastMessageAt ?? "",
    relativeTime: room.lastMessageAt ? formatTimeAgo(room.lastMessageAt, now) : "",
    unreadCount: room.unreadMessageCount,
  };
}

export function chatRoomDtoToDetail(room: ChatRoomHeaderDto): ChatRoomDetail {
  const referenceDate = "lastMessageAt" in room
    ? room.lastMessageAt
    : room.createdAt;

  return {
    id: String(room.chatRoomId),
    partnerNickname: room.otherMember.nickname,
    partnerAvatarUrl: room.otherMember.profileImageUrl ?? "",
    dateLabel: formatDateLabel(referenceDate ?? new Date().toISOString()),
    product: {
      id: String(room.product.productId),
      title: room.product.title,
      price: room.product.price,
      imageUrl: room.product.thumbnailUrl ?? "",
      status: toSaleStatus(room.product.status),
    },
  };
}

export function chatMessageDtoToMessage(
  chatRoomId: number,
  message: ChatMessageDto,
): ChatMessage {
  return {
    id: String(message.messageId),
    roomId: String(chatRoomId),
    sender: message.mine ? "me" : "other",
    type: message.messageType === "IMAGE" ? "image" : "text",
    content: message.content ?? "",
    sentAt: message.createdAt,
    displayTime: formatMessageTime(message.createdAt),
    read: message.read ?? message.isRead ?? false,
  };
}
