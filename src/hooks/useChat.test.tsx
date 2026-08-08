import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, renderHook, waitFor } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createChatRoom,
  getChatMessages,
  getChatRooms,
  sendImageMessages,
  sendTextMessage,
} from "../api/chat";
import {
  chatKeys,
  useChatMessagesQuery,
  useChatRoomsQuery,
  useCreateChatRoomMutation,
  useSendTextMessageMutation,
  useSendImageMessagesMutation,
} from "./useChat";

vi.mock("../api/chat", () => ({
  createChatRoom: vi.fn(),
  getChatMessages: vi.fn(),
  getChatRooms: vi.fn(),
  markChatRoomRead: vi.fn(),
  sendImageMessages: vi.fn(),
  sendTextMessage: vi.fn(),
}));

function createTestHarness() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

const roomDto = {
  chatRoomId: 31,
  otherMember: { memberId: 2, nickname: "정리왕", profileImageUrl: null },
  product: {
    productId: 7,
    title: "작업용 의자",
    thumbnailUrl: null,
    price: 45000,
    status: "SELLING",
  },
  lastMessage: "구매 가능한가요?",
  lastMessageAt: "2026-08-03T10:30:00",
  unreadMessageCount: 1,
};

describe("chat query hooks", () => {
  beforeEach(() => vi.clearAllMocks());

  it("서버 채팅방 목록을 화면 모델로 제공하고 상세 캐시도 채운다", async () => {
    vi.mocked(getChatRooms).mockResolvedValue({
      chatRooms: [roomDto],
      page: { nextCursor: null, hasNext: false },
    });
    const { queryClient, wrapper } = createTestHarness();

    const { result } = renderHook(() => useChatRoomsQuery(), { wrapper });

    await waitFor(() => expect(result.current.data?.[0].id).toBe("31"));
    expect(result.current.data?.[0].productName).toBe("작업용 의자");
    expect(queryClient.getQueryData(chatKeys.room(31))).toMatchObject({
      id: "31",
      product: { id: "7", price: 45000 },
    });
  });

  it("채팅방 생성 성공 결과를 상세 캐시에 저장한다", async () => {
    vi.mocked(createChatRoom).mockResolvedValue({
      chatRoomId: 31,
      otherMember: roomDto.otherMember,
      product: roomDto.product,
      createdAt: "2026-08-03T10:00:00",
    });
    const { queryClient, wrapper } = createTestHarness();
    const { result } = renderHook(() => useCreateChatRoomMutation(), { wrapper });

    await act(async () => {
      await result.current.mutateAsync(7);
    });

    expect(queryClient.getQueryData(chatKeys.room(31))).toMatchObject({
      id: "31",
      partnerNickname: "정리왕",
      product: { id: "7", title: "작업용 의자" },
    });
  });

  it("메시지 조회 결과와 전송 성공 메시지를 같은 캐시에 합친다", async () => {
    vi.mocked(getChatMessages).mockResolvedValue({
      messages: [{
        messageId: 100,
        senderId: 2,
        messageType: "TEXT",
        content: "안녕하세요",
        mine: false,
        read: true,
        createdAt: "2026-08-03T10:00:00",
      }],
      page: { nextCursor: null, hasNext: false },
    });
    vi.mocked(sendTextMessage).mockResolvedValue({
      messages: [{
        messageId: 101,
        senderId: 1,
        messageType: "TEXT",
        content: "구매할게요",
        mine: true,
        isRead: false,
        createdAt: "2026-08-03T10:01:00",
      }],
    });
    const { wrapper } = createTestHarness();
    const messages = renderHook(() => useChatMessagesQuery(31), { wrapper });

    await waitFor(() => expect(messages.result.current.data).toHaveLength(1));

    const send = renderHook(() => useSendTextMessageMutation(31), { wrapper });
    await act(async () => {
      await send.result.current.mutateAsync("구매할게요");
    });

    await waitFor(() =>
      expect(messages.result.current.data?.map((message) => message.content)).toEqual([
        "안녕하세요",
        "구매할게요",
      ]),
    );
  });

  it("다중 이미지 전송 응답의 모든 메시지를 기존 메시지 캐시에 합친다", async () => {
    vi.mocked(sendImageMessages).mockResolvedValue({
      messages: [
        {
          messageId: 106,
          senderId: 7,
          messageType: "IMAGE",
          content: "https://example.com/image1.jpg",
          mine: true,
          read: false,
          createdAt: "2026-08-03T15:10:00",
        },
        {
          messageId: 107,
          senderId: 7,
          messageType: "IMAGE",
          content: "https://example.com/image2.jpg",
          mine: true,
          read: false,
          createdAt: "2026-08-03T15:10:01",
        },
      ],
    });
    const { queryClient, wrapper } = createTestHarness();
    queryClient.setQueryData(chatKeys.messages(31), []);
    const { result } = renderHook(() => useSendImageMessagesMutation(31), {
      wrapper,
    });
    const files = [
      new File(["first"], "first.png", { type: "image/png" }),
      new File(["second"], "second.jpg", { type: "image/jpeg" }),
    ];

    await act(async () => {
      await result.current.mutateAsync(files);
    });

    expect(
      queryClient
        .getQueryData<Array<{ content: string }>>(chatKeys.messages(31))
        ?.map((message) => message.content),
    ).toEqual([
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ]);
  });
});
