import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./pages/home/HomePage", () => ({
  default: () => <div>홈 화면</div>,
}));

function LocationProbe() {
  const location = useLocation();

  return <output aria-label="현재 경로">{location.pathname}</output>;
}

describe("App legacy routes", () => {
  it("/splash로 진입하면 홈으로 replace 이동한다", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={["/splash"]}>
          <App />
          <LocationProbe />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    expect(screen.getByText("홈 화면")).toBeInTheDocument();
    expect(screen.getByLabelText("현재 경로")).toHaveTextContent("/");
  });
});
