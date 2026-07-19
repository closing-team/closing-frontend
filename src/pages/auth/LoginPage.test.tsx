import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LoginPage from "./LoginPage";
import type { KakaoLoginHandler } from "../../types/auth";

const navigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

describe("LoginPage", () => {
  beforeEach(() => {
    navigate.mockReset();
  });
  it("shows the Figma login copy and a Kakao start button", () => {
    render(<LoginPage />);

    expect(screen.getByRole("heading", { name: "클로징" })).toBeInTheDocument();
    expect(
      screen.getByText("혼란 없이 정리하고, 더 빠르게 다시 시작하세요"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "카카오톡으로 시작하기" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다."),
    ).toBeInTheDocument();
  });

  it("navigates an existing user to home after Kakao login", async () => {
    const onKakaoLogin: KakaoLoginHandler = async () => ({ status: "existing" });
    render(<LoginPage onKakaoLogin={onKakaoLogin} />);

    fireEvent.click(screen.getByRole("button", { name: "카카오톡으로 시작하기" }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/", { replace: true }));
  });

  it("navigates a new user to the terms screen after Kakao login", async () => {
    const onKakaoLogin: KakaoLoginHandler = async () => ({ status: "new" });
    render(<LoginPage onKakaoLogin={onKakaoLogin} />);

    fireEvent.click(screen.getByRole("button", { name: "카카오톡으로 시작하기" }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/terms", { replace: true }));
  });

  it("announces a failed login and permits a retry", async () => {
    const onKakaoLogin = vi
      .fn<() => Promise<{ status: "existing" }>>()
      .mockRejectedValueOnce(new Error("cancelled"))
      .mockResolvedValueOnce({ status: "existing" });
    render(<LoginPage onKakaoLogin={onKakaoLogin} />);

    const button = screen.getByRole("button", { name: "카카오톡으로 시작하기" });
    fireEvent.click(button);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
    );
    expect(navigate).not.toHaveBeenCalled();

    fireEvent.click(button);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/", { replace: true }));
    expect(onKakaoLogin).toHaveBeenCalledTimes(2);
  });

  it("disables the button while a login attempt is in progress", () => {
    let resolveLogin: ((result: { status: "existing" }) => void) | undefined;
    const onKakaoLogin = vi.fn(
      () =>
        new Promise<{ status: "existing" }>((resolve) => {
          resolveLogin = resolve;
        }),
    );
    render(<LoginPage onKakaoLogin={onKakaoLogin} />);

    const button = screen.getByRole("button", { name: "카카오톡으로 시작하기" });
    fireEvent.click(button);
    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(onKakaoLogin).toHaveBeenCalledOnce();

    resolveLogin?.({ status: "existing" });
  });
});
