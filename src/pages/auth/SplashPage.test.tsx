import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import SplashPage from "./SplashPage";

function renderSplash(
  props: React.ComponentProps<typeof SplashPage> = {},
) {
  return render(
    <MemoryRouter>
      <SplashPage {...props} />
    </MemoryRouter>,
  );
}

describe("SplashPage", () => {
  it("checking 상태에서는 브랜드만 표시한다", () => {
    renderSplash({ status: "checking" });

    expect(screen.getByLabelText("클로징")).toBeInTheDocument();
    expect(
      screen.queryByText("로그인 상태를 확인하지 못했습니다."),
    ).not.toBeInTheDocument();
  });

  it("error 상태에서 안내와 재시도 동작을 제공한다", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderSplash({ status: "error", onRetry });

    expect(
      screen.getByText("로그인 상태를 확인하지 못했습니다."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("네트워크를 확인한 뒤 다시 시도해 주세요."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "다시 시도" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("재시도 중에는 버튼을 비활성화한다", () => {
    renderSplash({ status: "error", isRetrying: true });

    expect(screen.getByRole("button", { name: "확인 중..." })).toBeDisabled();
  });
});
