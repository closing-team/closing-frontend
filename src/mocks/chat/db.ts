import type { ChatMessageType } from "../../types/chatApi";

export interface ChatRoomRecord {
  chatRoomId: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  createdAt: string;
}

export interface ChatMessageRecord {
  messageId: number;
  chatRoomId: number;
  senderId: number;
  messageType: ChatMessageType;
  content: string;
  createdAt: string;
  read: boolean;
}

let rooms: ChatRoomRecord[] = [];
let messages: ChatMessageRecord[] = [];
let nextRoomId = 1;
let nextMessageId = 1;

export function findRoomByProduct(
  productId: number,
  buyerId: number,
): ChatRoomRecord | undefined {
  return rooms.find((r) => r.productId === productId && r.buyerId === buyerId);
}

export function findRoom(chatRoomId: number): ChatRoomRecord | undefined {
  return rooms.find((r) => r.chatRoomId === chatRoomId);
}

export function createOrGetRoom(
  productId: number,
  buyerId: number,
  sellerId: number,
): ChatRoomRecord {
  const existing = findRoomByProduct(productId, buyerId);
  if (existing) return existing;

  const record: ChatRoomRecord = {
    chatRoomId: nextRoomId++,
    productId,
    buyerId,
    sellerId,
    createdAt: new Date().toISOString(),
  };
  rooms = [...rooms, record];
  return record;
}

export function listMessages(chatRoomId: number): ChatMessageRecord[] {
  return messages
    .filter((m) => m.chatRoomId === chatRoomId)
    .sort((a, b) => a.messageId - b.messageId);
}

export function addMessage(
  chatRoomId: number,
  senderId: number,
  messageType: ChatMessageType,
  content: string,
): ChatMessageRecord {
  const record: ChatMessageRecord = {
    messageId: nextMessageId++,
    chatRoomId,
    senderId,
    messageType,
    content,
    createdAt: new Date().toISOString(),
    read: false,
  };
  messages = [...messages, record];
  return record;
}

export function markRead(chatRoomId: number, readerId: number): void {
  messages = messages.map((m) =>
    m.chatRoomId === chatRoomId && m.senderId !== readerId
      ? { ...m, read: true }
      : m,
  );
}

export function listRoomsForUser(userId: number): ChatRoomRecord[] {
  return rooms.filter((r) => r.buyerId === userId || r.sellerId === userId);
}

export function lastMessage(chatRoomId: number): ChatMessageRecord | undefined {
  return listMessages(chatRoomId).at(-1);
}

export function countUnread(chatRoomId: number, readerId: number): number {
  return messages.filter(
    (m) => m.chatRoomId === chatRoomId && m.senderId !== readerId && !m.read,
  ).length;
}
