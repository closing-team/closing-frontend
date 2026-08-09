import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getChatMessages,
  markChatRoomRead,
  sendImageMessages,
  sendTextMessage,
} from "../../api/chat";
import { chatKeys } from "../../hooks/useChat";
import type { ChatRoomDetail } from "../../types/chat";
import ChatRoomPage from "./ChatRoomPage";

vi.mock("../../api/chat", () => ({
  createChatRoom: vi.fn(),
  getChatMessages: vi.fn(),
  getChatRooms: vi.fn(),
  markChatRoomRead: vi.fn(),
  sendImageMessages: vi.fn(),
  sendTextMessage: vi.fn(),
}));

const room: ChatRoomDetail = {
  id: "31",
  partnerNickname: "정리왕",
  partnerAvatarUrl: "",
  dateLabel: "2026년 8월 3일",
  product: {
    id: "7",
    title: "작업용 의자",
    price: 45000,
    imageUrl: "",
    status: "selling",
  },
};

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(chatKeys.room(31), room);

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/chats/31"]}>
        <Routes>
          <Route path="/chats/:chatRoomId" element={<ChatRoomPage />} />
          <Route path="/used/:productId" element={<p>상품 상세 화면</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const historyData = {
  messages: [{
    messageId: 100,
    senderId: 2,
    messageType: "TEXT",
    content: "아직 판매 중입니다.",
    mine: false,
    read: true,
    createdAt: "2026-08-03T10:00:00",
  }],
  page: { nextCursor: null, hasNext: false },
};

describe("ChatRoomPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi
        .fn()
        .mockReturnValueOnce("blob:first")
        .mockReturnValueOnce("blob:second"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
    vi.mocked(getChatMessages).mockResolvedValue(historyData);
    vi.mocked(markChatRoomRead).mockResolvedValue();
  });

  it("기존 메시지를 표시하고 입장한 채팅방을 읽음 처리한다", async () => {
    renderPage();

    expect(await screen.findByText("아직 판매 중입니다.")).toBeInTheDocument();
    await waitFor(() => expect(markChatRoomRead).toHaveBeenCalledWith(31));
    expect(screen.getByText("작업용 의자")).toBeInTheDocument();
  });

  it("텍스트를 전송하고 서버 응답 메시지를 화면에 표시한다", async () => {
    vi.mocked(sendTextMessage).mockResolvedValue({
      messages: [{
        messageId: 101,
        senderId: 1,
        messageType: "TEXT",
        content: "구매하고 싶어요.",
        mine: true,
        isRead: false,
        createdAt: "2026-08-03T10:01:00",
      }],
    });
    const user = userEvent.setup();
    renderPage();

    const input = await screen.findByRole("textbox", { name: "메시지 입력" });
    await user.type(input, "구매하고 싶어요.");
    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(await screen.findByText("구매하고 싶어요.")).toBeInTheDocument();
    expect(sendTextMessage).toHaveBeenCalledWith(31, "구매하고 싶어요.");
  });

  it("전송 실패한 텍스트를 재시도할 수 있다", async () => {
    vi.mocked(sendTextMessage)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({
        messages: [{
          messageId: 101,
          senderId: 1,
          messageType: "TEXT",
          content: "다시 보냅니다.",
          mine: true,
          isRead: false,
          createdAt: "2026-08-03T10:01:00",
        }],
      });
    const user = userEvent.setup();
    renderPage();

    const input = await screen.findByRole("textbox", { name: "메시지 입력" });
    await user.type(input, "다시 보냅니다.");
    await user.click(screen.getByRole("button", { name: "전송" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "메시지를 전송할 수 없습니다.",
    );

    await user.click(screen.getByRole("button", { name: "재시도" }));
    expect(await screen.findByText("다시 보냅니다.")).toBeInTheDocument();
    expect(sendTextMessage).toHaveBeenCalledTimes(2);
  });

  it("여러 이미지를 한 번에 전송하고 서버가 반환한 이미지들을 표시한다", async () => {
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
    const user = userEvent.setup();
    renderPage();
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.jpg", { type: "image/jpeg" });

    await user.upload(await screen.findByLabelText("이미지 첨부"), [first, second]);
    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(await screen.findAllByAltText("채팅 이미지")).toHaveLength(2);
    expect(sendImageMessages).toHaveBeenCalledWith(31, [first, second]);
  });
});
