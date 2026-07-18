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
