import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import GuideListPage from "./pages/guide/GuideListPage";
import LLMPage from "./pages/llm/LLMPage";
import SupportListPage from "./pages/support/SupportListPage";
import SplashPage from "./pages/auth/SplashPage";
import LoginPage from "./pages/auth/LoginPage";
import UsedListPage from "./pages/used/UsedListPage";
import UsedSearchPage from "./pages/used/UsedSearchPage";
import UsedSearchResultPage from "./pages/used/UsedSearchResultPage";
import UsedDetailPage from "./pages/used/UsedDetailPage";
import UsedChatPage from "./pages/used/UsedChatPage";
import BusinessAuthPage from "./pages/used/BusinessAuthPage";
import UsedWritePage from "./pages/used/UsedWritePage";
import ComponentsPage from "./pages/dev/ComponentsPage";
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] bg-white shadow-sm">
      <Routes>
        <Route path={ROUTES.SPLASH} element={<SplashPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GUIDE} element={<GuideListPage />} />
        <Route path="/ai" element={<LLMPage />} />
        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path={ROUTES.USED} element={<UsedListPage />} />
        <Route path={ROUTES.USED_SEARCH} element={<UsedSearchPage />} />
        <Route
          path={ROUTES.USED_SEARCH_RESULT}
          element={<UsedSearchResultPage />}
        />
        <Route path={ROUTES.USED_BUSINESS_AUTH} element={<BusinessAuthPage />} />
        <Route path={ROUTES.USED_WRITE} element={<UsedWritePage />} />
        <Route path={ROUTES.USED_CHAT} element={<UsedChatPage />} />
        <Route path={ROUTES.USED_DETAIL} element={<UsedDetailPage />} />
        <Route path="/dev/components" element={<ComponentsPage />} />
      </Routes>
    </div>
  );
}
