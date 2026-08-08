import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ChatComposer from "./ChatComposer";

describe("ChatComposer image messages", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
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
  });

  it("여러 이미지를 선택해 한 이미지 메시지로 전송한다", async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<ChatComposer onSend={onSend} />);
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.jpg", { type: "image/jpeg" });

    await user.upload(screen.getByLabelText("이미지 첨부"), [first, second]);

    expect(screen.getByAltText("first.png 미리보기")).toBeInTheDocument();
    expect(screen.getByAltText("second.jpg 미리보기")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "메시지 입력" })).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "전송" }));

    expect(onSend).toHaveBeenCalledWith({ type: "image", files: [first, second] });
    expect(screen.queryByAltText("first.png 미리보기")).not.toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first");
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:second");
  });

  it("선택한 이미지 중 한 장만 취소할 수 있다", async () => {
    const user = userEvent.setup();
    render(<ChatComposer onSend={vi.fn()} />);
    const first = new File(["first"], "first.png", { type: "image/png" });
    const second = new File(["second"], "second.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText("이미지 첨부"), [first, second]);

    await user.click(
      screen.getByRole("button", { name: "first.png 선택 취소" }),
    );

    expect(screen.queryByAltText("first.png 미리보기")).not.toBeInTheDocument();
    expect(screen.getByAltText("second.jpg 미리보기")).toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:first");
  });

  it("이미지를 선택하면 작성 중인 텍스트를 지워 두 형식을 섞지 않는다", async () => {
    const user = userEvent.setup();
    render(<ChatComposer onSend={vi.fn()} />);
    const input = screen.getByRole("textbox", { name: "메시지 입력" });
    await user.type(input, "이미지 설명");

    await user.upload(
      screen.getByLabelText("이미지 첨부"),
      new File(["first"], "first.png", { type: "image/png" }),
    );

    expect(input).toHaveValue("");
    expect(input).toBeDisabled();
  });

  it("이미지 전송 실패 후 같은 파일로 재시도한다", async () => {
    const onSend = vi
      .fn()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce(undefined);
    const user = userEvent.setup();
    render(<ChatComposer onSend={onSend} />);
    const image = new File(["first"], "first.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("이미지 첨부"), image);

    await user.click(screen.getByRole("button", { name: "전송" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "메시지를 전송할 수 없습니다.",
    );

    await user.click(screen.getByRole("button", { name: "재시도" }));
    expect(onSend).toHaveBeenCalledTimes(2);
    expect(onSend).toHaveBeenLastCalledWith({ type: "image", files: [image] });
  });
});
