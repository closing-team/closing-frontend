import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import TermsPage from "./TermsPage";

const navigate = vi.fn();

vi.mock("react-router-dom", () => ({
  useNavigate: () => navigate,
}));

describe("TermsPage", () => {
  beforeEach(() => {
    navigate.mockReset();
  });

  it("requires all mandatory agreements before signup can continue", () => {
    render(<TermsPage />);

    const signupButton = screen.getByRole("button", { name: "동의하고 가입하기" });
    expect(signupButton).toBeDisabled();

    fireEvent.click(screen.getByRole("checkbox", { name: "약관 및 안내에 전체 동의합니다." }));

    expect(signupButton).toBeEnabled();
  });

  it("navigates home after all mandatory agreements are accepted", () => {
    render(<TermsPage />);

    fireEvent.click(screen.getByRole("checkbox", { name: "약관 및 안내에 전체 동의합니다." }));
    fireEvent.click(screen.getByRole("button", { name: "동의하고 가입하기" }));

    expect(navigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
