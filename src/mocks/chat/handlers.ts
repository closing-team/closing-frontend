import { http, HttpResponse } from "msw";
import {
  addMessage,
  countUnread,
  createOrGetRoom,
  findRoom,
  lastMessage,
  listMessages,
  listRoomsForUser,
  markRead,
} from "./db";
import { findProduct } from "../product/db";
import packageCircle from "../../assets/images/package-circle.png";
import type {
  ChatMemberDto,
  ChatMessageDto,
  ChatProductSummaryDto,
} from "../../types/chatApi";
import type { ProductRecord } from "../product/db";
import { CURRENT_USER_ID, OK, paginate } from "../common";

function notFound() {
  return HttpResponse.json(
    {
      success: false,
      code: "CHAT_ROOM_NOT_FOUND",
      message: "채팅방을 찾을 수 없습니다.",
    },
    { status: 404 },
  );
}

function toProductSummary(product: ProductRecord): ChatProductSummaryDto {
  return {
    productId: product.productId,
    title: product.title,
    thumbnailUrl: product.imageUrls[0] ?? "",
    price: product.price,
    status: product.status,
  };
}

function toOtherMember(memberId: number, nickname: string): ChatMemberDto {
  return { memberId, nickname, profileImageUrl: packageCircle };
}

function toMessageDto(m: ReturnType<typeof listMessages>[number]): ChatMessageDto {
  return {
    messageId: m.messageId,
    senderId: m.senderId,
    messageType: m.messageType,
    content: m.content,
    mine: m.senderId === CURRENT_USER_ID,
    createdAt: m.createdAt,
    read: m.read,
  };
}

export const chatHandlers = [
  http.post("*/api/v1/chat-rooms/:productId", ({ params }) => {
    const productId = Number(params.productId);
    const product = findProduct(productId);
    if (!product || product.status === "DELETED") return notFound();

    const room = createOrGetRoom(productId, CURRENT_USER_ID, product.ownerId);

    return HttpResponse.json({
      ...OK,
      data: {
        chatRoomId: room.chatRoomId,
        product: toProductSummary(product),
        otherMember: toOtherMember(product.ownerId, product.ownerNickname),
        createdAt: room.createdAt,
      },
    });
  }),

  http.get("*/api/v1/chat-rooms/:chatRoomId/messages", ({ request, params }) => {
    const chatRoomId = Number(params.chatRoomId);
    const room = findRoom(chatRoomId);
    if (!room) return notFound();

    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const size = Number(url.searchParams.get("size") ?? 20);

    const all = listMessages(chatRoomId);
    const { page, nextCursor, hasNext } = paginate(
      all,
      cursor,
      size,
      (m) => m.messageId,
    );

    return HttpResponse.json({
      ...OK,
      data: {
        messages: page.map(toMessageDto),
        page: { nextCursor: nextCursor as number | null, hasNext },
      },
    });
  }),

  http.post(
    "*/api/v1/chat-rooms/:chatRoomId/messages",
    async ({ request, params }) => {
      const chatRoomId = Number(params.chatRoomId);
      const room = findRoom(chatRoomId);
      if (!room) return notFound();

      const formData = await request.formData();
      const contentPart = formData.get("content");
      const images = formData.getAll("images") as File[];

      const created: ChatMessageDto[] = [];

      if (contentPart) {
        const raw =
          typeof contentPart === "string" ? contentPart : await contentPart.text();
        const parsed = JSON.parse(raw) as { content: string };
        const record = addMessage(chatRoomId, CURRENT_USER_ID, "TEXT", parsed.content);
        created.push(toMessageDto(record));
      }

      for (const image of images) {
        const url = URL.createObjectURL(image);
        const record = addMessage(chatRoomId, CURRENT_USER_ID, "IMAGE", url);
        created.push(toMessageDto(record));
      }

      return HttpResponse.json({ ...OK, data: { messages: created } });
    },
  ),

  http.patch("*/api/v1/chat-rooms/:chatRoomId/read", ({ params }) => {
    const chatRoomId = Number(params.chatRoomId);
    const room = findRoom(chatRoomId);
    if (!room) return notFound();

    markRead(chatRoomId, CURRENT_USER_ID);
    return HttpResponse.json({ ...OK, data: {} });
  }),

  http.get("*/api/v1/chat-rooms", ({ request }) => {
    const url = new URL(request.url);
    const cursor = url.searchParams.get("cursor") ?? undefined;
    const size = Number(url.searchParams.get("size") ?? 20);

    const entries = listRoomsForUser(CURRENT_USER_ID)
      .map((room) => {
        const product = findProduct(room.productId);
        const last = lastMessage(room.chatRoomId);
        if (!product || !last) return null;
        return { room, product, last };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => new Date(b.last.createdAt).getTime() - new Date(a.last.createdAt).getTime());

    const { page, nextCursor, hasNext } = paginate(
      entries,
      cursor,
      size,
      (x) => `${x.last.createdAt}|${x.last.messageId}`,
    );

    const chatRooms = page.map((x) => ({
      chatRoomId: x.room.chatRoomId,
      otherMember: toOtherMember(x.product.ownerId, x.product.ownerNickname),
      product: toProductSummary(x.product),
      lastMessage: x.last.content,
      lastMessageAt: x.last.createdAt,
      unReadMessagesCount: countUnread(x.room.chatRoomId, CURRENT_USER_ID),
    }));

    return HttpResponse.json({
      ...OK,
      data: {
        chatRooms,
        page: { nextCursor: nextCursor as string | null, hasNext },
      },
    });
  }),
];
