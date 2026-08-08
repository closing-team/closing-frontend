import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { startKakaoAuthorization } from "../../auth/kakaoOAuth";
import LoginPage from "./LoginPage";

vi.mock("../../auth/kakaoOAuth", () => ({
  startKakaoAuthorization: vi.fn(),
}));

function renderLoginPage(onStartKakaoAuthorization?: () => void) {
  render(
    <MemoryRouter>
      <LoginPage onStartKakaoAuthorization={onStartKakaoAuthorization} />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("카카오로 시작하기를 누르면 production OAuth redirect를 시작한다", async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole("button", { name: "카카오로 시작하기" }));

    expect(startKakaoAuthorization).toHaveBeenCalledTimes(1);
  });

  it("연속 클릭해도 OAuth redirect를 한 번만 시작한다", async () => {
    const user = userEvent.setup();
    const onStartKakaoAuthorization = vi.fn();
    renderLoginPage(onStartKakaoAuthorization);

    await user.dblClick(
      screen.getByRole("button", { name: "카카오로 시작하기" }),
    );

    expect(onStartKakaoAuthorization).toHaveBeenCalledTimes(1);
  });
});
