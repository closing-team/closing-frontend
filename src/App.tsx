import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DocumentMeta from "./components/common/DocumentMeta";
import { ROUTES } from "./constants/routes";

const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const KakaoCallbackPage = lazy(
  () => import("./pages/auth/KakaoCallbackPage"),
);
const TermsPage = lazy(() => import("./pages/auth/TermsPage"));
const HomePage = lazy(() => import("./pages/home/HomePage"));
const AIPage = lazy(() => import("./pages/ai/AIPage"));
const AIPlanPage = lazy(() => import("./pages/ai/AIPlanPage"));
const GuideListPage = lazy(() => import("./pages/guide/GuideListPage"));
const GuideDetailPage = lazy(() => import("./pages/guide/GuideDetailPage"));
const GuideNoticeTemplatePage = lazy(
  () => import("./pages/guide/GuideNoticeTemplatePage"),
);
const GuideReportTemplatePage = lazy(
  () => import("./pages/guide/GuideReportTemplatePage"),
);
const SupportListPage = lazy(() => import("./pages/support/SupportListPage"));
const SupportDetailPage = lazy(
  () => import("./pages/support/SupportDetailPage"),
);
const UsedListPage = lazy(() => import("./pages/used/UsedListPage"));
const UsedDetailPage = lazy(() => import("./pages/used/UsedDetailPage"));
const UsedSearchPage = lazy(() => import("./pages/used/UsedSearchPage"));
const UsedSearchResultPage = lazy(
  () => import("./pages/used/UsedSearchResultPage"),
);
const UsedWritePage = lazy(() => import("./pages/used/UsedWritePage"));
const UsedMyProductsPage = lazy(
  () => import("./pages/used/UsedMyProductsPage"),
);
const UsedLikedProductsPage = lazy(
  () => import("./pages/used/UsedLikedProductsPage"),
);
const ChatListPage = lazy(() => import("./pages/chat/ChatListPage"));
const ChatRoomPage = lazy(() => import("./pages/chat/ChatRoomPage"));
const ProfileEditPage = lazy(() => import("./pages/account/ProfileEditPage"));
const BusinessAuthPage = lazy(
  () => import("./pages/account/BusinessAuthPage"),
);
const InquiryPage = lazy(() => import("./pages/inquiry/InquiryPage"));
const InquiryHistoryPage = lazy(
  () => import("./pages/inquiry/InquiryHistoryPage"),
);
const PolicyPage = lazy(() => import("./pages/policy/PolicyPage"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] bg-white shadow-sm">
      <DocumentMeta />
      <Suspense fallback={null}>
        <Routes>
          <Route
            path={ROUTES.SPLASH}
            element={<Navigate to={ROUTES.HOME} replace />}
          />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route
            path={ROUTES.KAKAO_CALLBACK}
            element={<KakaoCallbackPage />}
          />
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
          <Route
            path={ROUTES.SUPPORT_BOOKMARK}
            element={<SupportListPage />}
          />
          <Route
            path={ROUTES.SUPPORT_DETAIL}
            element={<SupportDetailPage />}
          />

          <Route path={ROUTES.USED} element={<UsedListPage />} />
          <Route path={ROUTES.USED_DETAIL} element={<UsedDetailPage />} />
          <Route path={ROUTES.USED_SEARCH} element={<UsedSearchPage />} />
          <Route
            path={ROUTES.USED_SEARCH_RESULT}
            element={<UsedSearchResultPage />}
          />
          <Route path={ROUTES.USED_WRITE} element={<UsedWritePage />} />
          <Route path={ROUTES.USED_EDIT} element={<UsedWritePage />} />
          <Route path={ROUTES.USED_MY} element={<UsedMyProductsPage />} />
          <Route
            path={ROUTES.USED_LIKED}
            element={<UsedLikedProductsPage />}
          />

          <Route path={ROUTES.CHAT} element={<ChatListPage />} />
          <Route path={ROUTES.CHAT_ROOM} element={<ChatRoomPage />} />

          <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditPage />} />
          <Route path={ROUTES.BUSINESS_AUTH} element={<BusinessAuthPage />} />

          <Route path={ROUTES.INQUIRY} element={<InquiryPage />} />
          <Route
            path={ROUTES.INQUIRY_HISTORY}
            element={<InquiryHistoryPage />}
          />

          <Route path={ROUTES.POLICY} element={<PolicyPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}
