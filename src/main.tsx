import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { frontendSessionRestore } from "./auth/frontendSessionRestore";
import AuthBootstrap from "./components/auth/AuthBootstrap";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { queryClient } from "./queryClient";
import "./index.css";

// 예전에 MSW를 켜고 접속했던 브라우저에는 서비스 워커가 그대로 남아 요청을 계속
// 가로챈다. 목업을 끈 상태에서는 남은 워커를 정리해 실제 응답만 오도록 한다.
async function unregisterStaleMockWorker() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(
    registrations
      .filter((registration) =>
        registration.active?.scriptURL.includes("mockServiceWorker.js"),
      )
      .map((registration) => registration.unregister()),
  );
}

// 전 도메인이 실제 백엔드에 연결돼 목업이 더 이상 필요하지 않으므로 기본적으로
// MSW를 띄우지 않는다. 다시 목업으로 확인해야 할 때만 VITE_ENABLE_MSW=true로 켠다.
// Service Worker 등록이 드물게 응답하지 않는 환경이 있어(예: 헤드리스 브라우저),
// 그 경우에도 앱 전체가 멈추지 않도록 타임아웃 시 렌더링을 진행시킨다.
async function enableMocking() {
  if (import.meta.env.VITE_ENABLE_MSW !== "true") {
    await unregisterStaleMockWorker();
    return;
  }
  const { worker } = await import("./mocks/msw/browser");
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, 3000));
  await Promise.race([
    worker.start({ onUnhandledRequest: "bypass" }),
    timeout,
  ]);
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ErrorBoundary>
            <AuthBootstrap restoreSession={frontendSessionRestore}>
              <App />
            </AuthBootstrap>
          </ErrorBoundary>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
