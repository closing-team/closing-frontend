import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { frontendSessionRestore } from "./auth/frontendSessionRestore";
import AuthBootstrap from "./components/auth/AuthBootstrap";
import { queryClient } from "./queryClient";
import "./index.css";

// 백엔드 배포 전까지는 dev 환경뿐 아니라 VITE_ENABLE_MSW=true로 켠 배포본에서도
// MSW로 전 도메인 API를 모킹한다. 백엔드 준비가 끝나면 이 플래그를 끄면 된다.
// Service Worker 등록이 드물게 응답하지 않는 환경이 있어(예: 헤드리스 브라우저),
// 그 경우에도 앱 전체가 멈추지 않도록 타임아웃 시 렌더링을 진행시킨다.
async function enableMocking() {
  const shouldMock =
    import.meta.env.DEV || import.meta.env.VITE_ENABLE_MSW === "true";
  if (!shouldMock) return;
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
