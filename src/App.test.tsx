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
    renderAt("/chats");

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /민수아빠 채팅방/ })).toBeInTheDocument();
  });

  it("opens the selected chat room from the list", async () => {
    renderAt("/chats");

    fireEvent.click(await screen.findByRole("button", { name: /민수아빠 채팅방/ }));

    expect(await screen.findByRole("heading", { name: "민수아빠" })).toBeInTheDocument();
  });

  it("renders a chat room when its URL is opened directly", async () => {
    renderAt("/chats/chat-1");

    expect(await screen.findByRole("heading", { name: "민수아빠" })).toBeInTheDocument();
  });

  it("shows a recovery action for an unknown room", async () => {
    renderAt("/chats/unknown-room");

    expect(await screen.findByText("채팅방을 찾을 수 없습니다.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "채팅 목록으로" }));

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
  });

  it("returns to the chat list when the user goes back from a selected room", async () => {
    renderAt("/chats");

    fireEvent.click(await screen.findByRole("button", { name: /민수아빠 채팅방/ }));
    fireEvent.click(await screen.findByRole("button", { name: "뒤로가기" }));

    expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
  });
});
