import packageCircle from "../assets/images/package-circle.png";
import type { Product, ChatMessage as UsedChatMessage } from "../types/used";
import type {
  ChatMessage,
  ChatRoomDetail,
  ChatRoomSummary,
} from "../types/chat";

function formatDateLabel(date: Date): string {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function buildMeta(product: Product): string | undefined {
  return [product.industry, product.itemCategory].filter(Boolean).join(" · ") || undefined;
}

export function toChatRoomDetail(
  product: Product,
  messages: UsedChatMessage[],
): ChatRoomDetail {
  const last = messages.at(-1);
  const dateLabel = formatDateLabel(
    last ? new Date(last.sentAt) : new Date(),
  );

  return {
    id: String(product.id),
    partnerNickname: product.sellerName ?? "판매자",
    partnerAvatarUrl: packageCircle,
    dateLabel,
    product: {
      id: String(product.id),
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl ?? "",
      status: product.status,
      meta: buildMeta(product),
      likeCount: product.likes,
    },
  };
}

export function toChatMessages(
  productId: number,
  messages: UsedChatMessage[],
): ChatMessage[] {
  return messages.map((message) => ({
    id: String(message.id),
    roomId: String(productId),
    sender: message.mine ? "me" : "other",
    type: "text",
    content: message.text,
    sentAt: message.sentAt,
    displayTime: message.time,
    read: message.read,
  }));
}

export function toChatRoomSummaries(
  products: Product[],
  messagesByProduct: Record<number, UsedChatMessage[]>,
): ChatRoomSummary[] {
  return products
    .filter((product) => (messagesByProduct[product.id]?.length ?? 0) > 0)
    .map((product) => {
      const messages = messagesByProduct[product.id]!;
      const last = messages.at(-1)!;
      const unreadCount = messages.filter(
        (message) => !message.mine && !message.read,
      ).length;

      return {
        id: String(product.id),
        productId: String(product.id),
        productName: product.title,
        productImageUrl: product.imageUrl ?? "",
        partnerNickname: product.sellerName ?? "판매자",
        partnerAvatarUrl: packageCircle,
        location: product.sellerNeighborhood ?? "",
        lastMessage: last.text,
        lastMessageAt: last.sentAt,
        relativeTime: product.timeAgo,
        unreadCount,
      };
    });
}
