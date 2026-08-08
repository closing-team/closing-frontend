import { QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { agreeTerms, getTerms, signup } from "../../api/auth";
import {
  clearPendingSignup,
  readPendingSignup,
  saveAuthSession,
} from "../../auth/authSession";
import { queryClient } from "../../queryClient";
import type { SignupResponseData, TermDto } from "../../types/authApi";
import TermsPage from "./TermsPage";

vi.mock("../../api/auth", () => ({
  agreeTerms: vi.fn(),
  getTerms: vi.fn(),
  signup: vi.fn(),
}));

vi.mock("../../auth/authSession", () => ({
  clearPendingSignup: vi.fn(),
  readPendingSignup: vi.fn(),
  saveAuthSession: vi.fn(),
}));

const terms: TermDto[] = [
  {
    termId: 1,
    type: "SERVICE",
    version: "1.0",
    content: "서비스 이용약관 내용",
    effectiveDate: "2026-08-01",
    required: true,
  },
  {
    termId: 2,
    type: "PRIVACY",
    version: "1.0",
    content: "개인정보 처리방침 내용",
    effectiveDate: "2026-08-01",
    required: true,
  },
  {
    termId: 3,
    type: "AGE",
    version: "1.0",
    content: "만 14세 이상 확인",
    effectiveDate: "2026-08-01",
    required: true,
  },
];

const signupResponse: SignupResponseData = {
  accessToken: "new-access-token",
  refreshToken: "new-refresh-token",
};

function apiError(code: string) {
  return new AxiosError("backend message", code, undefined, undefined, {
    status: 400,
    statusText: "Bad Request",
    headers: {},
    config: { headers: {} } as never,
    data: {
      success: false,
      code,
      message: "backend message",
      data: null,
    },
  });
}

function renderTermsPage() {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/terms"]}>
        <Routes>
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/login" element={<h1>login route</h1>} />
          <Route path="/" element={<h1>home route</h1>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function enterSignupInformation(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("이름"), "김준영");
  await user.type(screen.getByLabelText("닉네임"), "준영");
  await user.type(screen.getByLabelText("전화번호"), "01012345678");
  await user.type(screen.getByLabelText("이메일"), "junyoung@example.com");
  await user.type(
    screen.getByLabelText("프로필 이미지 URL (선택)"),
    "https://example.com/profile.png",
  );
}

describe("TermsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
    queryClient.setDefaultOptions({
      queries: { retry: false },
      mutations: { retry: false },
    });
    vi.mocked(readPendingSignup).mockReturnValue({ kind: "oauth" });
    vi.mocked(getTerms).mockResolvedValue(terms);
    vi.mocked(agreeTerms).mockResolvedValue(undefined);
    vi.mocked(signup).mockResolvedValue(signupResponse);
  });

  it("Swagger 약관 type을 사용자가 이해할 수 있는 체크박스로 표시한다", async () => {
    renderTermsPage();

    expect(
      await screen.findByRole("checkbox", { name: "[필수] 서비스 이용약관" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "[필수] 개인정보 처리방침" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "[필수] 만 14세 이상입니다" }),
    ).toBeInTheDocument();
  });

  it("가입 정보와 필수 약관이 모두 준비되기 전에는 가입 버튼을 비활성화한다", async () => {
    const user = userEvent.setup();
    renderTermsPage();
    const button = await screen.findByRole("button", { name: "동의하고 가입하기" });

    expect(button).toBeDisabled();
    await enterSignupInformation(user);
    expect(button).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "약관 및 안내에 전체 동의합니다." }));
    expect(button).toBeEnabled();
  });

  it("약관 동의 후 Swagger 회원가입 정보를 보내고 새 토큰을 저장한다", async () => {
    const user = userEvent.setup();
    renderTermsPage();
    await screen.findByRole("checkbox", { name: "[필수] 서비스 이용약관" });
    await enterSignupInformation(user);
    await user.click(screen.getByRole("checkbox", { name: "약관 및 안내에 전체 동의합니다." }));

    await user.click(screen.getByRole("button", { name: "동의하고 가입하기" }));

    expect(agreeTerms).toHaveBeenCalledWith({ termIds: [1, 2, 3] });
    expect(signup).toHaveBeenCalledWith({
      name: "김준영",
      nickname: "준영",
      phone: "01012345678",
      email: "junyoung@example.com",
      profileImageUrl: "https://example.com/profile.png",
    });
    expect(saveAuthSession).toHaveBeenCalledWith(signupResponse);
    expect(clearPendingSignup).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole("heading", { name: "home route" })).toBeInTheDocument();
  });

  it("pending signup이 없으면 API를 호출하지 않고 로그인으로 이동한다", async () => {
    vi.mocked(readPendingSignup).mockReturnValue(null);

    renderTermsPage();

    expect(await screen.findByRole("heading", { name: "login route" })).toBeInTheDocument();
    expect(getTerms).not.toHaveBeenCalled();
  });

  it("약관 조회 실패 후 다시 시도할 수 있다", async () => {
    const user = userEvent.setup();
    vi.mocked(getTerms)
      .mockRejectedValueOnce(apiError("COMMON500"))
      .mockResolvedValueOnce(terms);
    renderTermsPage();

    expect(await screen.findByRole("alert")).toHaveTextContent("약관을 불러오지 못했습니다.");
    await user.click(screen.getByRole("button", { name: "다시 시도" }));

    expect(
      await screen.findByRole("checkbox", { name: "[필수] 서비스 이용약관" }),
    ).toBeInTheDocument();
  });

  it("회원가입이 실패하면 인증 정보를 확정하지 않고 현재 화면에 오류를 표시한다", async () => {
    const user = userEvent.setup();
    vi.mocked(signup).mockRejectedValue(apiError("COMMON500"));
    renderTermsPage();
    await screen.findByRole("checkbox", { name: "[필수] 서비스 이용약관" });
    await enterSignupInformation(user);
    await user.click(screen.getByRole("checkbox", { name: "약관 및 안내에 전체 동의합니다." }));
    await user.click(screen.getByRole("button", { name: "동의하고 가입하기" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "일시적인 오류가 발생했습니다. 다시 시도해주세요.",
    );
    expect(saveAuthSession).not.toHaveBeenCalled();
    expect(clearPendingSignup).not.toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: /안전한 서비스 이용을 위해/ })).toBeInTheDocument();
  });
});
