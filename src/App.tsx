import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import GuideListPage from "./pages/guide/GuideListPage";
import GuideDetailPage from "./pages/guide/GuideDetailPage";
import GuideNoticeTemplatePage from "./pages/guide/GuideNoticeTemplatePage";
import GuideReportTemplatePage from "./pages/guide/GuideReportTemplatePage";
import AIPage from "./pages/ai/AIPage";
import AIPlanPage from "./pages/ai/AIPlanPage";
import SupportListPage from "./pages/support/SupportListPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";
import InquiryPage from "./pages/inquiry/InquiryPage";
import InquiryHistoryPage from "./pages/inquiry/InquiryHistoryPage";
import PolicyPage from "./pages/policy/PolicyPage";
import ProfileEditPage from "./pages/account/ProfileEditPage";
import SplashPage from "./pages/auth/SplashPage";
import LoginPage from "./pages/auth/LoginPage";
import TermsPage from "./pages/auth/TermsPage";
import UsedListPage from "./pages/used/UsedListPage";
import UsedMyProductsPage from "./pages/used/UsedMyProductsPage";
import UsedLikedProductsPage from "./pages/used/UsedLikedProductsPage";
import UsedSearchPage from "./pages/used/UsedSearchPage";
import UsedSearchResultPage from "./pages/used/UsedSearchResultPage";
import UsedDetailPage from "./pages/used/UsedDetailPage";
import BusinessAuthPage from "./pages/account/BusinessAuthPage";
import UsedWritePage from "./pages/used/UsedWritePage";
import ComponentsPage from "./pages/dev/ComponentsPage";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import InvalidChatRoomPage from "./pages/chat/InvalidChatRoomPage";
import NotFoundPage from "./pages/error/NotFoundPage";
import { ROUTES, chatRoomPath, usedDetailPath } from "./constants/routes";
import { useUsedStore } from "./stores/usedStore";
import {
  toChatMessages,
  toChatRoomDetail,
  toChatRoomSummaries,
} from "./utils/chatAdapter";

function ChatListRoute() {
  const navigate = useNavigate();
  const products = useUsedStore((s) => s.products);
  const messagesByProduct = useUsedStore((s) => s.messagesByProduct);
  const rooms = toChatRoomSummaries(products, messagesByProduct);

  return (
    <ChatListPage
      rooms={rooms}
      onBack={() => navigate(ROUTES.HOME)}
      onSelectRoom={(roomId) => navigate(chatRoomPath(roomId))}
    />
  );
}

function UsedChatRoomRoute() {
  const navigate = useNavigate();
  const { productId = "" } = useParams();
  const product = useUsedStore((s) =>
    s.products.find((p) => String(p.id) === productId),
  );
  const messages =
    useUsedStore((s) => s.messagesByProduct[Number(productId)]) ?? [];
  const sendMessage = useUsedStore((s) => s.sendMessage);

  if (!product) return <InvalidChatRoomPage />;

  return (
    <ChatRoomPage
      room={toChatRoomDetail(product, messages)}
      messages={toChatMessages(product.id, messages)}
      onBack={() => navigate(-1)}
      onSelectProduct={() => navigate(usedDetailPath(product.id))}
      onSendMessage={(pending) => {
        if (pending.type === "text") {
          sendMessage(product.id, pending.content);
        }
      }}
    />
  );
}

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] bg-white shadow-sm">
      <Routes>
        <Route path={ROUTES.SPLASH} element={<SplashPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />

        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.PROFILE_EDIT} element={<ProfileEditPage />} />
        <Route path={ROUTES.BUSINESS_AUTH} element={<BusinessAuthPage />} />

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

        <Route path={ROUTES.AI} element={<AIPage />} />
        <Route path={ROUTES.AI_PLAN} element={<AIPlanPage />} />

        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path={ROUTES.SUPPORT_DETAIL} element={<SupportDetailPage />} />

        <Route path={ROUTES.INQUIRY} element={<InquiryPage />} />
        <Route path={ROUTES.INQUIRY_HISTORY} element={<InquiryHistoryPage />} />

        <Route path={ROUTES.POLICY} element={<PolicyPage />} />

        <Route path={ROUTES.USED} element={<UsedListPage />} />
        <Route path={ROUTES.USED_DETAIL} element={<UsedDetailPage />} />
        <Route path={ROUTES.USED_SEARCH} element={<UsedSearchPage />} />
        <Route
          path={ROUTES.USED_SEARCH_RESULT}
          element={<UsedSearchResultPage />}
        />
        <Route path={ROUTES.USED_WRITE} element={<UsedWritePage />} />
        <Route
          path={ROUTES.USED_MY}
          element={<UsedMyProductsPage />}
        />
        <Route path={ROUTES.USED_LIKED} element={<UsedLikedProductsPage />} />

        <Route path={ROUTES.CHAT} element={<ChatListRoute />} />
        <Route path={ROUTES.CHAT_ROOM} element={<UsedChatRoomRoute />} />

        <Route path={ROUTES.DEV} element={<ComponentsPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}
