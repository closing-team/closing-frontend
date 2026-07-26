import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import TermsPage from "./pages/auth/TermsPage";
import HomePage from "./pages/home/HomePage";
import AIPage from "./pages/ai/AIPage";
import AIPlanPage from "./pages/ai/AIPlanPage";
import GuideListPage from "./pages/guide/GuideListPage";
import GuideDetailPage from "./pages/guide/GuideDetailPage";
import GuideNoticeTemplatePage from "./pages/guide/GuideNoticeTemplatePage";
import GuideReportTemplatePage from "./pages/guide/GuideReportTemplatePage";
import SupportListPage from "./pages/support/SupportListPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";
import UsedListPage from "./pages/used/UsedListPage";
import UsedDetailPage from "./pages/used/UsedDetailPage";
import UsedSearchPage from "./pages/used/UsedSearchPage";
import UsedSearchResultPage from "./pages/used/UsedSearchResultPage";
import UsedWritePage from "./pages/used/UsedWritePage";
import UsedMyProductsPage from "./pages/used/UsedMyProductsPage";
import UsedLikedProductsPage from "./pages/used/UsedLikedProductsPage";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import ProfileEditPage from "./pages/account/ProfileEditPage";
import BusinessAuthPage from "./pages/account/BusinessAuthPage";
import InquiryPage from "./pages/inquiry/InquiryPage";
import InquiryHistoryPage from "./pages/inquiry/InquiryHistoryPage";
import PolicyPage from "./pages/policy/PolicyPage";
import ComponentsPage from "./pages/dev/ComponentsPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import DocumentMeta from "./components/common/DocumentMeta";
import { ROUTES } from "./constants/routes";

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] bg-white shadow-sm">
      <DocumentMeta />
      <Routes>
        <Route
          path={ROUTES.SPLASH}
          element={<Navigate to={ROUTES.HOME} replace />}
        />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />

        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.AI} element={<AIPage />} />
        <Route path={ROUTES.AI_PLAN} element={<AIPlanPage />} />

        <Route path={ROUTES.GUIDE} element={<GuideListPage />} />
        <Route path={ROUTES.GUIDE_DETAIL} element={<GuideDetailPage />} />
        <Route
          path={ROUTES.GUIDE_NOTICE_TEMPLATE}
          element={<GuideNoticeTemplatePage />}
        />
        <Route
          path={ROUTES.GUIDE_REPORT_TEMPLATE}
          element={<GuideReportTemplatePage />}
        />

        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path={ROUTES.SUPPORT_BOOKMARK} element={<SupportListPage />} />
        <Route path={ROUTES.SUPPORT_DETAIL} element={<SupportDetailPage />} />

        <Route path={ROUTES.USED} element={<UsedListPage />} />
        <Route path={ROUTES.USED_DETAIL} element={<UsedDetailPage />} />
        <Route path={ROUTES.USED_SEARCH} element={<UsedSearchPage />} />
        <Route
          path={ROUTES.USED_SEARCH_RESULT}
          element={<UsedSearchResultPage />}
        />
        <Route path={ROUTES.USED_WRITE} element={<UsedWritePage />} />
        <Route path={ROUTES.USED_MY} element={<UsedMyProductsPage />} />
        <Route path={ROUTES.USED_LIKED} element={<UsedLikedProductsPage />} />

        <Route path={ROUTES.CHAT} element={<ChatListPage />} />
        <Route path={ROUTES.CHAT_ROOM} element={<ChatRoomPage />} />

        <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditPage />} />
        <Route path={ROUTES.BUSINESS_AUTH} element={<BusinessAuthPage />} />

        <Route path={ROUTES.INQUIRY} element={<InquiryPage />} />
        <Route path={ROUTES.INQUIRY_HISTORY} element={<InquiryHistoryPage />} />

        <Route path={ROUTES.POLICY} element={<PolicyPage />} />

        <Route path={ROUTES.DEV} element={<ComponentsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
