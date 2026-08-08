import type { SaleStatus } from "./used";

export interface ChatRoomSummary {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  partnerNickname: string;
  partnerAvatarUrl: string;
  location: string;
  lastMessage: string;
  lastMessageAt: string;
  relativeTime: string;
  unreadCount: number;
}

export interface ChatProductSummary {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  status?: SaleStatus;
  meta?: string;
  likeCount?: number;
}

export interface ChatRoomDetail {
  id: string;
  partnerNickname: string;
  partnerAvatarUrl: string;
  dateLabel: string;
  product: ChatProductSummary;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  sender: "me" | "other";
  type: "text" | "image";
  content: string;
  caption?: string;
  sentAt: string;
  displayTime: string;
  read: boolean;
}

export type PendingChatMessage =
  | { type: "text"; content: string }
  | { type: "image"; files: File[] };
