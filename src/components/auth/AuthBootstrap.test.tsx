import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "../../constants/routes";
import AuthBootstrap from "./AuthBootstrap";

describe("AuthBootstrap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("인증되지 않은 카카오 콜백 경로를 로그인으로 보내지 않고 렌더링한다", async () => {
    render(
      <MemoryRouter initialEntries={[`${ROUTES.KAKAO_CALLBACK}?code=one-time-code`]}>
        <AuthBootstrap restoreSession={async () => "unauthenticated"}>
          <Routes>
            <Route path={ROUTES.KAKAO_CALLBACK} element={<h1>callback route</h1>} />
            <Route path={ROUTES.LOGIN} element={<h1>login route</h1>} />
          </Routes>
        </AuthBootstrap>
      </MemoryRouter>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_500);
    });

    expect(screen.getByRole("heading", { name: "callback route" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "login route" })).not.toBeInTheDocument();
  });

  it("인증되지 않은 보호 경로는 로그인으로 이동한다", async () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.CHAT]}>
        <AuthBootstrap restoreSession={async () => "unauthenticated"}>
          <Routes>
            <Route path={ROUTES.CHAT} element={<h1>chat route</h1>} />
            <Route path={ROUTES.LOGIN} element={<h1>login route</h1>} />
          </Routes>
        </AuthBootstrap>
      </MemoryRouter>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_500);
    });

    expect(screen.getByRole("heading", { name: "login route" })).toBeInTheDocument();
  });

  it("인증되지 않은 로그인 경로는 홈으로 보내지 않고 그대로 렌더링한다", async () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.LOGIN]}>
        <AuthBootstrap restoreSession={async () => "unauthenticated"}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<h1>login route</h1>} />
            <Route path={ROUTES.HOME} element={<h1>home route</h1>} />
          </Routes>
        </AuthBootstrap>
      </MemoryRouter>,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_500);
    });

    expect(screen.getByRole("heading", { name: "login route" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "home route" })).not.toBeInTheDocument();
  });
});
