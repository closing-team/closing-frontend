import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe("chat routes", () => {
  it("renders the chat list at /chats", async () => {
    renderAt("/chat");

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /네 가능해요!/ })).toBeInTheDocument();
  });

  it("opens the selected chat room from the list", async () => {
    renderAt("/chat");

    fireEvent.click(await screen.findByRole("button", { name: /네 가능해요!/ }));

    expect(await screen.findByRole("heading", { name: "클로저 123" })).toBeInTheDocument();
    expect(
      screen.getByText("시모넬리 아피아 2그룹 커피머신"),
    ).toBeInTheDocument();
  });

  it("renders a chat room when its URL is opened directly", async () => {
    renderAt("/chat/3");

    expect(await screen.findByRole("heading", { name: "클로저 123" })).toBeInTheDocument();
    expect(
      screen.getByText("시모넬리 아피아 2그룹 커피머신"),
    ).toBeInTheDocument();
  });

  it("shows a recovery action for an unknown product chat", async () => {
    renderAt("/chat/999");

    expect(await screen.findByText("채팅방을 찾을 수 없습니다.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "채팅 목록으로" }));

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
  });

  it("returns to the chat list when the user goes back from a selected room", async () => {
    renderAt("/chat");

    fireEvent.click(await screen.findByRole("button", { name: /네 가능해요!/ }));
    fireEvent.click(await screen.findByRole("button", { name: "뒤로가기" }));

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
  });
});
