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
import UsedSearchPage from "./pages/used/UsedSearchPage";
import UsedSearchResultPage from "./pages/used/UsedSearchResultPage";
import UsedDetailPage from "./pages/used/UsedDetailPage";
import UsedChatPage from "./pages/used/UsedChatPage";
import BusinessAuthPage from "./pages/used/BusinessAuthPage";
import UsedWritePage from "./pages/used/UsedWritePage";
import ComponentsPage from "./pages/dev/ComponentsPage";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import InvalidChatRoomPage from "./pages/chat/InvalidChatRoomPage";
import { chatRoomPath, ROUTES } from "./constants/routes";
import { getMockChatRoom } from "./mocks/mockChat";

function ChatListRoute() {
  const navigate = useNavigate();

  return (
    <ChatListPage
      onBack={() => navigate(ROUTES.HOME)}
      onSelectRoom={(roomId) => navigate(chatRoomPath(roomId))}
    />
  );
}

function ChatRoomRoute() {
  const navigate = useNavigate();
  const { roomId = "" } = useParams();
  const chat = getMockChatRoom(roomId);

  if (!chat) return <InvalidChatRoomPage />;

  return <ChatRoomPage {...chat} onBack={() => navigate(-1)} />;
}

export default function App() {
  return (
    <div className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] bg-white shadow-sm">
      <Routes>
        <Route path={ROUTES.SPLASH} element={<SplashPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.TERMS} element={<TermsPage />} />
        <Route path={ROUTES.CHATS} element={<ChatListRoute />} />
        <Route path={ROUTES.CHAT_ROOM} element={<ChatRoomRoute />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GUIDE} element={<GuideListPage />} />
        <Route path={ROUTES.GUIDE_DETAIL} element={<GuideDetailPage />} />
        <Route
          path={ROUTES.GUIDE_NOTICE_TEMPLATE}
          element={<GuideNoticeTemplatePage />}
        />
        <Route path={ROUTES.LLM} element={<LLMPage />} />
        <Route path={ROUTES.LLM_CHAT} element={<LLMChatPage />} />
        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path={ROUTES.SUPPORT_DETAIL} element={<SupportDetailPage />} />
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
