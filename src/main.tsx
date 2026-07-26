import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { frontendSessionRestore } from "./auth/frontendSessionRestore";
import AuthBootstrap from "./components/auth/AuthBootstrap";
import "./index.css";

const queryClient = new QueryClient();

// 백엔드 배포 전까지 dev 환경에서만 MSW로 중고거래 상품 API를 모킹한다.
// Service Worker 등록이 드물게 응답하지 않는 환경이 있어(예: 헤드리스 브라우저),
// 그 경우에도 앱 전체가 멈추지 않도록 타임아웃 시 렌더링을 진행시킨다.
async function enableMocking() {
  if (!import.meta.env.DEV) return;
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
          <AuthBootstrap restoreSession={frontendSessionRestore}>
            <App />
          </AuthBootstrap>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>,
  );
});
