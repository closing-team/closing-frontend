import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import {
  MemoryRouter,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { logoutCurrentSession } from "../../auth/logoutCurrentSession";
import SideMenu from "./SideMenu";

vi.mock("../../auth/logoutCurrentSession", () => ({
  logoutCurrentSession: vi.fn(),
}));

vi.mock("../../hooks/useAccount", async () => {
  const actual =
    await vi.importActual<typeof import("../../hooks/useAccount")>(
      "../../hooks/useAccount",
    );
  return {
    ...actual,
    useMyProfileQuery: () => ({
      data: { nickname: "원흥동 상사", businessVerified: true },
    }),
  };
});

function MenuScreen() {
  const [open, setOpen] = useState(true);
  return <SideMenu open={open} onClose={() => setOpen(false)} />;
}

function LoginScreen() {
  const navigate = useNavigate();

  return (
    <main>
      <h1>로그인 화면</h1>
      <button type="button" onClick={() => navigate(-1)}>
        이전 기록
      </button>
    </main>
  );
}

function renderSideMenu() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  queryClient.setQueryData(["private-data"], { secret: true });

  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/origin", "/menu"]} initialIndex={1}>
        <Routes>
          <Route path="/origin" element={<h1>이전 화면</h1>} />
          <Route path="/menu" element={<MenuScreen />} />
          <Route path="/login" element={<LoginScreen />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );

  return queryClient;
}

async function openLogoutConfirm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole("button", { name: "로그아웃" }));
  expect(screen.getByText("로그아웃 할까요?")).toBeInTheDocument();
}

function getLogoutConfirmButton() {
  const buttons = screen.getAllByRole("button", { name: "로그아웃" });
  return buttons[buttons.length - 1];
}

describe("SideMenu logout", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("확인하면 로그아웃하고 캐시를 비운 뒤 로그인 화면으로 replace 이동한다", async () => {
    const user = userEvent.setup();
    const queryClient = renderSideMenu();
    await openLogoutConfirm(user);

    await user.click(getLogoutConfirmButton());

    expect(
      await screen.findByRole("heading", { name: "로그인 화면" }),
    ).toBeInTheDocument();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "이전 기록" }));
    expect(
      await screen.findByRole("heading", { name: "이전 화면" }),
    ).toBeInTheDocument();
  });

  it("로그아웃 처리 중 확인 버튼을 다시 눌러도 한 번만 요청한다", async () => {
    const user = userEvent.setup();
    let resolveLogout: (() => void) | undefined;
    vi.mocked(logoutCurrentSession).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveLogout = resolve;
        }),
    );
    renderSideMenu();
    await openLogoutConfirm(user);
    const confirmButton = getLogoutConfirmButton();

    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(logoutCurrentSession).toHaveBeenCalledTimes(1);

    resolveLogout?.();
    expect(
      await screen.findByRole("heading", { name: "로그인 화면" }),
    ).toBeInTheDocument();
  });

  it("로그아웃 실패 시 메뉴와 확인 모달을 유지하고 재시도 문구를 표시한다", async () => {
    const user = userEvent.setup();
    vi.mocked(logoutCurrentSession).mockRejectedValue(new Error("network"));
    const queryClient = renderSideMenu();
    await openLogoutConfirm(user);

    await user.click(getLogoutConfirmButton());

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "로그아웃하지 못했습니다. 다시 시도해주세요.",
    );
    expect(screen.getByText("로그아웃 할까요?")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "사이드 메뉴 닫기" }),
    ).toBeInTheDocument();
    expect(queryClient.getQueryCache().getAll()).toHaveLength(1);
  });
});
