import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getChatRooms } from "../../api/chat";
import ChatListPage from "./ChatListPage";

vi.mock("../../api/chat", () => ({
  getChatRooms: vi.fn(),
  createChatRoom: vi.fn(),
  getChatMessages: vi.fn(),
  markChatRoomRead: vi.fn(),
  sendTextMessage: vi.fn(),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/chats"]}>
        <Routes>
          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/chats/:chatRoomId" element={<p>채팅방 화면</p>} />
          <Route path="/" element={<p>홈 화면</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const listData = {
  chatRooms: [{
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
    unreadMessageCount: 2,
  }],
  page: { nextCursor: null, hasNext: false },
};

describe("ChatListPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("서버 채팅방과 상품명을 표시하고 chatRoomId 주소로 이동한다", async () => {
    vi.mocked(getChatRooms).mockResolvedValue(listData);
    const user = userEvent.setup();
    renderPage();

    const roomButton = await screen.findByRole("button", {
      name: /정리왕 채팅방/,
    });
    expect(screen.getByText("구매 가능한가요?")).toBeInTheDocument();
    expect(screen.getByLabelText("작업용 의자 상품 이미지")).toBeInTheDocument();

    await user.click(roomButton);
    expect(screen.getByText("채팅방 화면")).toBeInTheDocument();
  });

  it("채팅방이 없으면 빈 상태를 표시한다", async () => {
    vi.mocked(getChatRooms).mockResolvedValue({
      chatRooms: [],
      page: { nextCursor: null, hasNext: false },
    });
    renderPage();

    expect(await screen.findByText("아직 채팅이 없어요.")).toBeInTheDocument();
  });

  it("목록 요청 실패 후 다시 시도할 수 있다", async () => {
    vi.mocked(getChatRooms)
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(listData);
    const user = userEvent.setup();
    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "채팅 목록을 불러오지 못했습니다.",
    );
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /정리왕 채팅방/ })).toBeInTheDocument(),
    );
  });
});
