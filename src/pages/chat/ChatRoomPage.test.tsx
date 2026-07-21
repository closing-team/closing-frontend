import { act, createEvent, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatRoomPage from "./ChatRoomPage";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("ko-KR").format(price);

const room = {
  id: "room-1",
  partnerNickname: "민수아빠",
  partnerAvatarUrl: "/avatar.jpg",
  dateLabel: "2026년 7월 19일",
  product: {
    id: "product-1",
    title: "업소용 에스프레소 머신",
    price: 1_200_000,
    imageUrl: "/product.jpg",
  },
};

const oldestMessage = {
  id: "message-1",
  roomId: room.id,
  sender: "other" as const,
  type: "text" as const,
  content: "제품 상태는 어떤가요?",
  sentAt: "2026-07-19T09:00:00.000Z",
  displayTime: "오전 9:00",
  read: true,
};

const newestMessage = {
  id: "message-2",
  roomId: room.id,
  sender: "me" as const,
  type: "text" as const,
  content: "사진을 더 보내드릴게요.",
  sentAt: "2026-07-19T10:00:00.000Z",
  displayTime: "오전 10:00",
  read: false,
};

describe("ChatRoomPage", () => {
  it("keeps the default back affordance and shows the Figma mock conversation", () => {
    render(<ChatRoomPage />);

    expect(screen.getByRole("button", { name: "뒤로가기" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "클로저 123" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "시모넬리 아피아 2그룹 커피머신, 1,200,000원",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("2026년 5월 10일")).toBeInTheDocument();
    const renderedMessages = screen.getAllByTestId("chat-message");
    const messageGroups = screen.getAllByTestId("chat-message-group");

    expect(renderedMessages.map((node) => node.textContent)).toEqual([
      expect.stringContaining("안녕하세요! 구매 가능할까요?"),
      expect.stringContaining("내일 직거래 하고싶어요."),
      expect.stringContaining("네 가능해요!"),
    ]);
    expect(renderedMessages.map((node) => node.getAttribute("data-sender"))).toEqual([
      "me",
      "me",
      "other",
    ]);
    expect(messageGroups.map((node) => node.getAttribute("data-sender"))).toEqual([
      "me",
      "other",
    ]);
    expect(within(messageGroups[0]).getAllByTestId("chat-message")).toHaveLength(2);
    expect(within(renderedMessages[0]).queryByText("읽음")).not.toBeInTheDocument();
    expect(within(renderedMessages[1]).getByText("읽음")).toBeInTheDocument();
    expect(within(renderedMessages[1]).getByText("오후 2:10")).toBeInTheDocument();
    expect(
      within(messageGroups[1]).getByRole("img", {
        name: "클로저 123 프로필 이미지",
      }),
    ).toBeInTheDocument();
    expect(
      within(messageGroups[1]).getAllByRole("img", {
        name: "클로저 123 프로필 이미지",
      }),
    ).toHaveLength(1);
  });

  it("shows the partner, product summary, and chronological messages without mutating input", () => {
    const messages = [newestMessage, oldestMessage];
    render(<ChatRoomPage room={room} messages={messages} />);

    expect(
      screen.getByRole("heading", { name: room.partnerNickname }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `${room.product.title}, ${formatPrice(room.product.price)}원`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByTestId("chat-message").map((node) => node.textContent),
    ).toEqual([
      expect.stringContaining(oldestMessage.content),
      expect.stringContaining(newestMessage.content),
    ]);
    expect(messages).toEqual([newestMessage, oldestMessage]);
    expect(
      screen.getByRole("img", { name: room.product.title }),
    ).toHaveClass("h-full", "w-full", "object-cover");
  });

  it("synchronizes incoming messages and resets the conversation when the room changes", async () => {
    const { rerender } = render(
      <ChatRoomPage room={room} messages={[oldestMessage]} />,
    );

    rerender(
      <ChatRoomPage room={room} messages={[oldestMessage, newestMessage]} />,
    );
    expect(await screen.findByText(newestMessage.content)).toBeInTheDocument();

    const nextRoom = {
      ...room,
      id: "room-2",
      partnerNickname: "다음 판매자",
    };
    const nextRoomMessage = {
      ...oldestMessage,
      id: "message-room-2",
      roomId: nextRoom.id,
      content: "새 채팅방 메시지",
    };
    rerender(<ChatRoomPage room={nextRoom} messages={[nextRoomMessage]} />);

    expect(await screen.findByText(nextRoomMessage.content)).toBeInTheDocument();
    expect(screen.queryByText(oldestMessage.content)).not.toBeInTheDocument();
    expect(screen.queryByText(newestMessage.content)).not.toBeInTheDocument();
  });

  it("keeps the composer in a viewport-bounded layout with a scrollable conversation", () => {
    render(<ChatRoomPage room={room} messages={[]} />);

    expect(screen.getByRole("main")).toHaveClass("h-dvh");
    expect(screen.getByLabelText("대화 내용")).toHaveClass(
      "min-h-0",
      "flex-1",
      "overflow-y-auto",
    );
    expect(screen.getByRole("textbox", { name: "메시지 입력" })).toHaveClass(
      "focus-visible:ring-2",
    );
  });

  it("scrolls to new messages when appropriate without interrupting older-message reading", async () => {
    const scrollIntoView = vi.fn();
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    const { rerender } = render(
      <ChatRoomPage room={room} messages={[]} />,
    );
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());

    const conversation = screen.getByLabelText("대화 내용");
    Object.defineProperties(conversation, {
      scrollHeight: { configurable: true, value: 1000 },
      clientHeight: { configurable: true, value: 200 },
      scrollTop: { configurable: true, value: 0, writable: true },
    });
    fireEvent.scroll(conversation);
    scrollIntoView.mockClear();

    rerender(<ChatRoomPage room={room} messages={[oldestMessage]} />);
    expect(await screen.findByText(oldestMessage.content)).toBeInTheDocument();
    expect(scrollIntoView).not.toHaveBeenCalled();

    fireEvent.change(screen.getByRole("textbox", { name: "메시지 입력" }), {
      target: { value: "새 메시지" },
    });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalled());

    delete (Element.prototype as { scrollIntoView?: unknown }).scrollIntoView;
  });

  it("separates adjacent messages when their display times differ", () => {
    const messages = [
      { ...oldestMessage, sender: "me" as const },
      { ...newestMessage, sender: "me" as const },
    ];
    render(<ChatRoomPage room={room} messages={messages} />);

    const groups = screen.getAllByTestId("chat-message-group");
    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.getAttribute("data-sender"))).toEqual([
      "me",
      "me",
    ]);
    groups.forEach((group) => {
      expect(within(group).getAllByTestId("chat-message")).toHaveLength(1);
    });
  });

  it("reports back and product selection actions", () => {
    const onBack = vi.fn();
    const onSelectProduct = vi.fn();
    render(
      <ChatRoomPage
        room={room}
        messages={[]}
        onBack={onBack}
        onSelectProduct={onSelectProduct}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "뒤로가기" }));
    fireEvent.click(
      screen.getByRole("button", {
        name: `${room.product.title}, ${formatPrice(room.product.price)}원`,
      }),
    );

    expect(onBack).toHaveBeenCalledOnce();
    expect(onSelectProduct).toHaveBeenCalledWith(room.product.id);
  });

  it("blocks blank text and clears a successful text send", async () => {
    const onSendMessage = vi.fn();
    render(<ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText("메시지를 입력하세요...");
    const send = screen.getByRole("button", { name: "전송" });

    expect(send).toBeDisabled();
    fireEvent.change(input, { target: { value: "   " } });
    expect(send).toBeDisabled();

    fireEvent.change(input, { target: { value: "안녕하세요" } });
    fireEvent.click(send);

    await waitFor(() =>
      expect(onSendMessage).toHaveBeenCalledWith({
        type: "text",
        content: "안녕하세요",
      }),
    );
    expect(input).toHaveValue("");
    expect(screen.getByText("안녕하세요")).toBeInTheDocument();
  });

  it("uses a canonical sent message so later server synchronization does not duplicate it", async () => {
    const canonicalMessage = {
      ...newestMessage,
      id: "server-message-1",
      content: "서버에 저장된 메시지",
    };
    const onSendMessage = vi.fn().mockResolvedValue(canonicalMessage);
    const { rerender } = render(
      <ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "메시지 입력" }), {
      target: { value: "서버에 저장할 메시지" },
    });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));
    expect(await screen.findByText(canonicalMessage.content)).toBeInTheDocument();

    rerender(
      <ChatRoomPage
        room={room}
        messages={[canonicalMessage]}
        onSendMessage={onSendMessage}
      />,
    );
    await waitFor(() =>
      expect(screen.getAllByText(canonicalMessage.content)).toHaveLength(1),
    );
  });

  it("resets the composer and ignores an old send when the room changes", async () => {
    let resolveSend: () => void = () => {};
    const onSendMessage = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSend = resolve;
        }),
    );
    const { rerender } = render(
      <ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />,
    );

    fireEvent.change(screen.getByRole("textbox", { name: "메시지 입력" }), {
      target: { value: "이전 방 메시지" },
    });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));
    await waitFor(() => expect(onSendMessage).toHaveBeenCalledOnce());

    const nextRoom = {
      ...room,
      id: "room-2",
      partnerNickname: "다음 판매자",
    };
    rerender(
      <ChatRoomPage
        room={nextRoom}
        messages={[]}
        onSendMessage={onSendMessage}
      />,
    );
    expect(screen.getByRole("textbox", { name: "메시지 입력" })).toHaveValue("");

    await act(async () => resolveSend());
    expect(screen.queryByText("이전 방 메시지")).not.toBeInTheDocument();
  });

  it("previews, removes, and sends an image with a caption", async () => {
    const file = new File(["image"], "machine.png", { type: "image/png" });
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:machine");
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    createObjectURL.mockClear();
    revoke.mockClear();
    const onSendMessage = vi.fn();
    render(<ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />);

    const imageInput = screen.getByLabelText("이미지 첨부");
    expect(imageInput).toHaveAttribute("accept", "image/*");
    fireEvent.change(imageInput, { target: { files: [file] } });
    expect(screen.getByAltText("선택한 이미지 미리보기")).toHaveAttribute(
      "src",
      "blob:machine",
    );

    fireEvent.click(screen.getByRole("button", { name: "이미지 선택 취소" }));
    expect(screen.queryByAltText("선택한 이미지 미리보기")).not.toBeInTheDocument();
    expect(revoke).toHaveBeenCalledWith("blob:machine");
    revoke.mockClear();

    fireEvent.change(imageInput, { target: { files: [file] } });
    fireEvent.change(screen.getByPlaceholderText("메시지를 입력하세요..."), {
      target: { value: "상태 사진입니다" },
    });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));

    await waitFor(() =>
      expect(onSendMessage).toHaveBeenCalledWith({
        type: "image",
        content: "blob:machine",
        file,
        caption: "상태 사진입니다",
      }),
    );
    expect(screen.queryByAltText("선택한 이미지 미리보기")).not.toBeInTheDocument();
    expect(revoke).not.toHaveBeenCalledWith("blob:machine");
  });

  it("preserves the image draft while its send is unresolved", async () => {
    const file = new File(["image"], "machine.png", { type: "image/png" });
    const replacementFile = new File(["replacement"], "replacement.png", {
      type: "image/png",
    });
    const createObjectURL = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:machine");
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    createObjectURL.mockClear();
    revoke.mockClear();
    let resolveSend: () => void = () => {};
    const onSendMessage = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSend = resolve;
        }),
    );
    const { unmount } = render(
      <ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />,
    );

    const imageInput = screen.getByLabelText("이미지 첨부");
    const input = screen.getByPlaceholderText("메시지를 입력하세요...");
    fireEvent.change(imageInput, { target: { files: [file] } });
    fireEvent.change(input, { target: { value: "전송 중인 사진" } });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));

    await waitFor(() => expect(onSendMessage).toHaveBeenCalledTimes(1));
    const cancel = screen.getByRole("button", { name: "이미지 선택 취소" });
    expect(input).toBeDisabled();
    expect(screen.getByRole("button", { name: "이미지 선택" })).toBeDisabled();
    expect(imageInput).toBeDisabled();
    expect(cancel).toBeDisabled();
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();

    fireEvent.change(input, { target: { value: "새 초안" } });
    fireEvent.change(imageInput, { target: { files: [replacementFile] } });
    fireEvent.click(cancel);
    expect(input).toHaveValue("전송 중인 사진");
    expect(screen.getByAltText("선택한 이미지 미리보기")).toHaveAttribute(
      "src",
      "blob:machine",
    );
    expect(createObjectURL).toHaveBeenCalledTimes(1);
    expect(revoke).not.toHaveBeenCalledWith("blob:machine");

    resolveSend();
    await waitFor(() => expect(input).toHaveValue(""));
    expect(screen.queryByAltText("선택한 이미지 미리보기")).not.toBeInTheDocument();
    expect(revoke).not.toHaveBeenCalledWith("blob:machine");

    unmount();
    expect(revoke).toHaveBeenCalledWith("blob:machine");
  });

  it("ignores non-image files and sends only on Enter without Shift", async () => {
    const onSendMessage = vi.fn();
    render(<ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />);

    const imageInput = screen.getByLabelText("이미지 첨부");
    const input = screen.getByPlaceholderText("메시지를 입력하세요...");
    fireEvent.change(imageInput, {
      target: { files: [new File(["text"], "note.txt", { type: "text/plain" })] },
    });
    expect(screen.queryByAltText("선택한 이미지 미리보기")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "전송" })).toBeDisabled();

    fireEvent.change(input, { target: { value: "Enter 전송" } });
    const shiftEnter = createEvent.keyDown(input, {
      key: "Enter",
      shiftKey: true,
    });
    fireEvent(input, shiftEnter);
    expect(shiftEnter.defaultPrevented).toBe(false);
    expect(onSendMessage).not.toHaveBeenCalled();

    fireEvent.keyDown(input, { key: "Enter" });
    await waitFor(() =>
      expect(onSendMessage).toHaveBeenCalledWith({
        type: "text",
        content: "Enter 전송",
      }),
    );
  });

  it("keeps failed content and retries the failed message", async () => {
    const onSendMessage = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(undefined);
    render(<ChatRoomPage room={room} messages={[]} onSendMessage={onSendMessage} />);

    const input = screen.getByPlaceholderText("메시지를 입력하세요...");
    fireEvent.change(input, { target: { value: "재시도할 메시지" } });
    fireEvent.click(screen.getByRole("button", { name: "전송" }));

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("메시지를 전송할 수 없습니다.");
    expect(input).toHaveValue("재시도할 메시지");

    fireEvent.click(screen.getByRole("button", { name: "재시도" }));
    await waitFor(() => expect(onSendMessage).toHaveBeenCalledTimes(2));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).toHaveValue("");
    expect(screen.getAllByText("재시도할 메시지")).toHaveLength(1);
  });
});
