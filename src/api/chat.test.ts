import { beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "./axios";
import {
  createChatRoom,
  getChatMessages,
  getChatRooms,
  markChatRoomRead,
  sendImageMessages,
  sendTextMessage,
} from "./chat";

vi.mock("./axios", () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}));

const envelope = <T,>(data: T) => ({
  data: {
    success: true,
    code: "COMMON200",
    message: "성공입니다.",
    data,
  },
});

describe("chat api", () => {
  beforeEach(() => vi.clearAllMocks());

  it("cursor와 size로 채팅방 목록을 조회한다", async () => {
    const data = { chatRooms: [], page: { nextCursor: null, hasNext: false } };
    vi.mocked(api.get).mockResolvedValue(envelope(data));

    await expect(getChatRooms({ cursor: "cursor-1", size: 20 })).resolves.toBe(data);
    expect(api.get).toHaveBeenCalledWith("/api/v1/chat-rooms", {
      params: { cursor: "cursor-1", size: 20 },
    });
  });

  it("상품 ID로 채팅방을 생성한다", async () => {
    const data = {
      chatRoomId: 31,
      product: { productId: 7, title: "의자", thumbnailUrl: null, price: 10000, status: "SELLING" as const },
      otherMember: { memberId: 2, nickname: "판매자", profileImageUrl: null },
      createdAt: "2026-08-03T10:00:00",
    };
    vi.mocked(api.post).mockResolvedValue(envelope(data));

    await expect(createChatRoom(7)).resolves.toBe(data);
    expect(api.post).toHaveBeenCalledWith("/api/v1/chat-rooms/7");
  });

  it("cursor와 size로 메시지 히스토리를 조회한다", async () => {
    const data = { messages: [], page: { nextCursor: null, hasNext: false } };
    vi.mocked(api.get).mockResolvedValue(envelope(data));

    await expect(getChatMessages(31, { cursor: 100, size: 50 })).resolves.toBe(data);
    expect(api.get).toHaveBeenCalledWith("/api/v1/chat-rooms/31/messages", {
      params: { cursor: 100, size: 50 },
    });
  });

  it("텍스트 메시지를 JSON body로 전송한다", async () => {
    const data = {
      messages: [{
        messageId: 101,
        senderId: 1,
        messageType: "TEXT" as const,
        content: "안녕하세요",
        mine: true,
        isRead: false,
        createdAt: "2026-08-03T10:00:00",
      }],
    };
    vi.mocked(api.post).mockResolvedValue(envelope(data));

    await expect(sendTextMessage(31, "안녕하세요")).resolves.toBe(data);
    expect(api.post).toHaveBeenCalledWith("/api/v1/chat-rooms/31/messages", {
      content: "안녕하세요",
    });
  });

  it("여러 이미지를 같은 images 키로 multipart 전송한다", async () => {
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.jpg", { type: "image/jpeg" });
    const data = {
      messages: [
        {
          messageId: 106,
          senderId: 7,
          messageType: "IMAGE" as const,
          content: "https://example.com/chat-messages/image1.jpg",
          mine: true,
          read: false,
          createdAt: "2026-08-03T15:10:00",
        },
        {
          messageId: 107,
          senderId: 7,
          messageType: "IMAGE" as const,
          content: "https://example.com/chat-messages/image2.jpg",
          mine: true,
          read: false,
          createdAt: "2026-08-03T15:10:01",
        },
      ],
    };
    vi.mocked(api.post).mockResolvedValue(envelope(data));

    await expect(sendImageMessages(31, [first, second])).resolves.toBe(data);

    const [path, body] = vi.mocked(api.post).mock.calls[0];
    expect(path).toBe("/api/v1/chat-rooms/31/messages");
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).getAll("images")).toEqual([first, second]);
    expect((body as FormData).has("content")).toBe(false);
  });

  it("채팅방의 메시지를 읽음 처리한다", async () => {
    vi.mocked(api.patch).mockResolvedValue(envelope(null));

    await expect(markChatRoomRead(31)).resolves.toBeUndefined();
    expect(api.patch).toHaveBeenCalledWith("/api/v1/chat-rooms/31/read");
  });
});
