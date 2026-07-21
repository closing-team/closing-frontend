import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import GuideListPage from "./pages/guide/GuideListPage";
import GuideDetailPage from "./pages/guide/GuideDetailPage";
import GuideNoticeTemplatePage from "./pages/guide/GuideNoticeTemplatePage";
import LLMPage from "./pages/llm/LLMPage";
import LLMChatPage from "./pages/llm/LLMChatPage";
import SupportListPage from "./pages/support/SupportListPage";
import SupportDetailPage from "./pages/support/SupportDetailPage";
import SplashPage from "./pages/auth/SplashPage";
import LoginPage from "./pages/auth/LoginPage";
import TermsPage from "./pages/auth/TermsPage";
import UsedListPage from "./pages/used/UsedListPage";
import UsedMyProductsPage from "./pages/used/UsedMyProductsPage";
import UsedLikedProductsPage from "./pages/used/UsedLikedProductsPage";
import UsedSearchPage from "./pages/used/UsedSearchPage";
import UsedSearchResultPage from "./pages/used/UsedSearchResultPage";
import UsedDetailPage from "./pages/used/UsedDetailPage";
import BusinessAuthPage from "./pages/used/BusinessAuthPage";
import UsedWritePage from "./pages/used/UsedWritePage";
import ComponentsPage from "./pages/dev/ComponentsPage";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import InvalidChatRoomPage from "./pages/chat/InvalidChatRoomPage";
import { ROUTES } from "./constants/routes";
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
      onSelectRoom={(roomId) => navigate(`/chat/${roomId}`)}
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
      onSelectProduct={() => navigate(`/used/${product.id}`)}
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
        <Route path={ROUTES.CHAT} element={<ChatListRoute />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GUIDE} element={<GuideListPage />} />
        <Route path={ROUTES.GUIDE_DETAIL} element={<GuideDetailPage />} />
        <Route
          path={ROUTES.GUIDE_NOTICE_TEMPLATE}
          element={<GuideNoticeTemplatePage />}
        />
        <Route path={ROUTES.LLM} element={<LLMPage />} />
        <Route path={ROUTES.LLM_PLAN} element={<LLMChatPage />} />
        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path={ROUTES.SUPPORT_DETAIL} element={<SupportDetailPage />} />
        <Route path={ROUTES.USED} element={<UsedListPage />} />
        <Route
          path={ROUTES.USED_MY_PRODUCTS}
          element={<UsedMyProductsPage />}
        />
        <Route path={ROUTES.USED_LIKED} element={<UsedLikedProductsPage />} />
        <Route path={ROUTES.USED_SEARCH} element={<UsedSearchPage />} />
        <Route
          path={ROUTES.USED_SEARCH_RESULT}
          element={<UsedSearchResultPage />}
        />
        <Route path={ROUTES.BUSINESS_AUTH} element={<BusinessAuthPage />} />
        <Route path={ROUTES.USED_WRITE} element={<UsedWritePage />} />
        <Route path={ROUTES.CHAT_DETAIL} element={<UsedChatRoomRoute />} />
        <Route path={ROUTES.USED_DETAIL} element={<UsedDetailPage />} />
        <Route path="/dev" element={<ComponentsPage />} />
      </Routes>
    </div>
  );
}
