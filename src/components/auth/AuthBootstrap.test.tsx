import { StrictMode } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { RestoreSession } from "../../auth/sessionBootstrap";
import AuthBootstrap from "./AuthBootstrap";

function TestRoutes() {
  return (
    <Routes>
      <Route path="/" element={<div>홈 화면</div>} />
      <Route path="/login" element={<div>로그인 화면</div>} />
      <Route path="/chats" element={<div>채팅 화면</div>} />
    </Routes>
  );
}

function renderBootstrap(
  restoreSession: RestoreSession,
  initialEntry = "/",
) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <AuthBootstrap restoreSession={restoreSession}>
        <TestRoutes />
      </AuthBootstrap>
    </MemoryRouter>,
  );
}

async function advanceTime(ms: number) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("AuthBootstrap", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    localStorage.clear();
  });

  it("authenticated 결과여도 1.5초 전에는 홈을 노출하지 않는다", async () => {
    renderBootstrap(async () => "authenticated");

    expect(screen.getByLabelText("클로징")).toBeInTheDocument();
    expect(screen.queryByText("홈 화면")).not.toBeInTheDocument();

    await advanceTime(1499);
    expect(screen.queryByText("홈 화면")).not.toBeInTheDocument();

    await advanceTime(1);
    expect(screen.getByText("홈 화면")).toBeInTheDocument();
  });

  it("unauthenticated 결과이면 로그인으로 이동한다", async () => {
    renderBootstrap(async () => "unauthenticated");

    await advanceTime(1500);

    expect(screen.getByText("로그인 화면")).toBeInTheDocument();
  });

  it("localStorage 토큰 문자열을 인증 결과로 사용하지 않는다", async () => {
    localStorage.setItem("accessToken", "arbitrary");
    renderBootstrap(async () => "unauthenticated");

    await advanceTime(1500);

    expect(screen.getByText("로그인 화면")).toBeInTheDocument();
  });

  it("5000ms timeout 후 재시도 화면을 표시한다", async () => {
    const restoreSession: RestoreSession = (signal) =>
      new Promise((_, reject) => {
        signal.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
      });

    renderBootstrap(restoreSession);
    await advanceTime(5000);

    expect(
      screen.getByText("로그인 상태를 확인하지 못했습니다."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "다시 시도" })).toBeEnabled();
  });

  it("실패 후 재시도 성공 결과를 반영한다", async () => {
    const restoreSession = vi
      .fn<RestoreSession>()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce("authenticated");

    renderBootstrap(restoreSession);
    await advanceTime(1500);

    fireEvent.click(screen.getByRole("button", { name: "다시 시도" }));
    await advanceTime(1500);

    expect(screen.getByText("홈 화면")).toBeInTheDocument();
    expect(restoreSession).toHaveBeenCalledTimes(2);
  });

  it("인증된 사용자가 내부 경로로 진입하면 해당 경로를 유지한다", async () => {
    renderBootstrap(async () => "authenticated", "/chats");

    await advanceTime(1500);

    expect(screen.getByText("채팅 화면")).toBeInTheDocument();
  });

  it("인증된 사용자가 로그인으로 진입하면 홈으로 이동한다", async () => {
    renderBootstrap(async () => "authenticated", "/login");

    await advanceTime(1500);

    expect(screen.getByText("홈 화면")).toBeInTheDocument();
  });

  it("재시도 버튼을 연속 클릭해도 새 요청은 한 번만 시작한다", async () => {
    const restoreSession = vi
      .fn<RestoreSession>()
      .mockRejectedValueOnce(new Error("network"))
      .mockResolvedValueOnce("unauthenticated");

    renderBootstrap(restoreSession);
    await advanceTime(1500);

    const retryButton = screen.getByRole("button", { name: "다시 시도" });
    fireEvent.click(retryButton);
    fireEvent.click(retryButton);
    await advanceTime(1500);

    expect(restoreSession).toHaveBeenCalledTimes(2);
    expect(screen.getByText("로그인 화면")).toBeInTheDocument();
  });

  it("Strict Mode에서 cleanup된 시도의 늦은 결과를 무시한다", async () => {
    let resolveFirst: ((result: "authenticated") => void) | undefined;
    const restoreSession = vi
      .fn<RestoreSession>()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveFirst = resolve;
          }),
      )
      .mockResolvedValueOnce("unauthenticated");

    render(
      <StrictMode>
        <MemoryRouter initialEntries={["/"]}>
          <AuthBootstrap restoreSession={restoreSession}>
            <TestRoutes />
          </AuthBootstrap>
        </MemoryRouter>
      </StrictMode>,
    );

    await advanceTime(1500);
    expect(screen.getByText("로그인 화면")).toBeInTheDocument();

    await act(async () => {
      resolveFirst?.("authenticated");
      await Promise.resolve();
    });

    expect(screen.getByText("로그인 화면")).toBeInTheDocument();
  });
});
