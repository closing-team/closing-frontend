import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatListPage from "./ChatListPage";
import type { ChatRoomSummary } from "../../types/chat";

const createRoom = (
  overrides: Partial<ChatRoomSummary> = {},
): ChatRoomSummary => ({
  id: "room-1",
  productId: "product-1",
  productName: "업소용 냉장고",
  productImageUrl: "/product.jpg",
  partnerNickname: "민수아빠",
  partnerAvatarUrl: "/avatar.jpg",
  location: "부산 해운대구",
  lastMessage: "제품 상태는 어떤가요?",
  lastMessageAt: "2026-07-19T09:00:00.000Z",
  relativeTime: "10분 전",
  unreadCount: 0,
  ...overrides,
});

const getAccessibleRoomName = (room: ChatRoomSummary) =>
  `${room.partnerNickname} 채팅방, ${room.lastMessage}, ${room.location} · ${room.relativeTime}${
    room.unreadCount > 0 ? `, 읽지 않은 메시지 ${room.unreadCount}개` : ""
  }`;

describe("ChatListPage", () => {
  it("sorts chat rooms from newest to oldest without changing the supplied rooms", () => {
    const oldest = createRoom({
      id: "oldest",
      partnerNickname: "가장 오래된 대화",
      lastMessageAt: "2026-07-17T09:00:00.000Z",
    });
    const newest = createRoom({
      id: "newest",
      partnerNickname: "가장 최근 대화",
      lastMessageAt: "2026-07-19T10:00:00.000Z",
    });
    const rooms = [oldest, newest];

    render(<ChatListPage rooms={rooms} />);

    expect(
      screen.getAllByRole("button", { name: /채팅방,/ }).map((button) =>
        button.getAttribute("aria-label"),
      ),
    ).toEqual([getAccessibleRoomName(newest), getAccessibleRoomName(oldest)]);
    expect(rooms).toEqual([oldest, newest]);
  });

  it("shows unread badges only for rooms with unread messages", () => {
    render(
      <ChatListPage
        rooms={[
          createRoom({ id: "unread", unreadCount: 5 }),
          createRoom({ id: "read", partnerNickname: "읽은 대화", unreadCount: 0 }),
        ]}
      />,
    );

    expect(screen.getByLabelText("읽지 않은 메시지 5개")).toBeInTheDocument();
    expect(screen.queryByLabelText("읽지 않은 메시지 0개")).not.toBeInTheDocument();
  });

  it("includes the full conversation summary in a row accessible name", () => {
    const room = createRoom({
      unreadCount: 5,
      lastMessage: "제품 상태는 어떤가요? 사진 추가 가능할까요?",
    });

    render(<ChatListPage rooms={[room]} />);

    expect(
      screen.getByRole("button", { name: getAccessibleRoomName(room) }),
    ).toBeInTheDocument();
  });

  it("shows the exact empty-state copy when there are no rooms", () => {
    render(<ChatListPage rooms={[]} />);

    expect(screen.getByText("아직 채팅 내역이 없습니다.")).toBeInTheDocument();
  });

  it("uses the Home navigation adapter for the default back action", () => {
    const onNavigateHome = vi.fn();
    render(<ChatListPage rooms={[]} {...{ onNavigateHome }} />);

    fireEvent.click(screen.getByRole("button", { name: "뒤로가기" }));

    expect(onNavigateHome).toHaveBeenCalledOnce();
  });

  it("reports the selected room id", () => {
    const onSelectRoom = vi.fn();
    render(<ChatListPage rooms={[createRoom({ id: "selected-room" })]} onSelectRoom={onSelectRoom} />);

    fireEvent.click(
      screen.getByRole("button", {
        name: getAccessibleRoomName(createRoom({ id: "selected-room" })),
      }),
    );

    expect(onSelectRoom).toHaveBeenCalledWith("selected-room");
  });

  it("reports the back action", () => {
    const onBack = vi.fn();
    render(<ChatListPage rooms={[]} onBack={onBack} />);

    fireEvent.click(screen.getByRole("button", { name: "뒤로가기" }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
