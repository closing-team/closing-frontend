import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import type { KakaoCodeLoginHandler } from "../../types/auth";
import KakaoCallbackPage from "./KakaoCallbackPage";

function renderCallback(
  initialEntry: string,
  onCompleteKakaoLogin: KakaoCodeLoginHandler,
  strict = false,
) {
  const content = (
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/auth/kakao/callback"
          element={
            <KakaoCallbackPage onCompleteKakaoLogin={onCompleteKakaoLogin} />
          }
        />
        <Route path="/" element={<h1>홈 화면</h1>} />
        <Route path="/terms" element={<h1>약관 화면</h1>} />
        <Route path="/login" element={<h1>로그인 화면</h1>} />
      </Routes>
    </MemoryRouter>
  );

  return render(strict ? <StrictMode>{content}</StrictMode> : content);
}

describe("KakaoCallbackPage", () => {
  it("인가 코드를 교환하고 기존 사용자를 홈으로 이동시킨다", async () => {
    const handler = vi
      .fn<KakaoCodeLoginHandler>()
      .mockResolvedValue({ status: "existing" });

    renderCallback("/auth/kakao/callback?code=existing-code", handler);

    expect(screen.getByText("카카오 로그인을 완료하는 중..."))
      .toBeInTheDocument();
    expect(await screen.findByRole("heading", { name: "홈 화면" }))
      .toBeInTheDocument();
    expect(handler).toHaveBeenCalledWith(
      "existing-code",
      expect.any(AbortSignal),
    );
  });

  it("신규 사용자를 약관 화면으로 이동시킨다", async () => {
    const handler = vi
      .fn<KakaoCodeLoginHandler>()
      .mockResolvedValue({ status: "new" });

    renderCallback("/auth/kakao/callback?code=new-code", handler);

    expect(await screen.findByRole("heading", { name: "약관 화면" }))
      .toBeInTheDocument();
  });

  it("StrictMode에서도 같은 일회용 코드를 한 번만 교환한다", async () => {
    let resolveLogin: ((value: { status: "existing" }) => void) | undefined;
    const handler = vi.fn<KakaoCodeLoginHandler>().mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      }),
    );

    renderCallback("/auth/kakao/callback?code=strict-code", handler, true);

    expect(handler).toHaveBeenCalledTimes(1);
    resolveLogin?.({ status: "existing" });
    expect(await screen.findByRole("heading", { name: "홈 화면" }))
      .toBeInTheDocument();
  });

  it("code가 없으면 API를 호출하지 않고 로그인으로 돌아갈 수 있다", async () => {
    const user = userEvent.setup();
    const handler = vi.fn<KakaoCodeLoginHandler>();

    renderCallback("/auth/kakao/callback", handler);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "카카오 인증 코드를 확인할 수 없습니다.",
    );
    expect(handler).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "로그인으로 돌아가기" }));
    expect(await screen.findByRole("heading", { name: "로그인 화면" }))
      .toBeInTheDocument();
  });

  it("카카오가 인증을 거부하면 취소 안내를 표시한다", () => {
    const handler = vi.fn<KakaoCodeLoginHandler>();

    renderCallback(
      "/auth/kakao/callback?error=access_denied&error_description=cancelled",
      handler,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "카카오 로그인이 취소되었습니다.",
    );
    expect(handler).not.toHaveBeenCalled();
  });

  it("백엔드 교환 실패 후 다시 시도할 수 있다", async () => {
    const user = userEvent.setup();
    const handler = vi
      .fn<KakaoCodeLoginHandler>()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce({ status: "existing" });

    renderCallback("/auth/kakao/callback?code=retry-code", handler);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "카카오 로그인에 실패했습니다. 다시 시도해주세요.",
    );
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByRole("heading", { name: "홈 화면" }))
      .toBeInTheDocument();
    expect(handler).toHaveBeenCalledTimes(2);
  });
});
