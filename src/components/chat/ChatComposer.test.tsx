import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatComposer from "./ChatComposer";

describe("ChatComposer", () => {
  it("does not send when Enter finalizes Korean text composition", () => {
    const onSend = vi.fn();
    render(<ChatComposer onSend={onSend} />);

    const input = screen.getByRole("textbox", { name: "메시지 입력" });
    fireEvent.change(input, { target: { value: "안녕하세요" } });
    fireEvent.keyDown(input, { key: "Enter", isComposing: true });

    expect(onSend).not.toHaveBeenCalled();
  });
});
