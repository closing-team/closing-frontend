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

unregisterStaleMockWorker().then(() => {
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
