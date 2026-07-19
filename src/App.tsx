import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import GuideListPage from "./pages/guide/GuideListPage";
import LLMPage from "./pages/llm/LLMPage";
import SupportListPage from "./pages/support/SupportListPage";
import SplashPage from "./pages/auth/SplashPage";
import LoginPage from "./pages/auth/LoginPage";
import UsedListPage from "./pages/used/UsedListPage";
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
        <Route path={ROUTES.CHATS} element={<ChatListRoute />} />
        <Route path={ROUTES.CHAT_ROOM} element={<ChatRoomRoute />} />
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.GUIDE} element={<GuideListPage />} />
        <Route path="/ai" element={<LLMPage />} />
        <Route path={ROUTES.SUPPORT} element={<SupportListPage />} />
        <Route path="/used" element={<UsedListPage />} />
        <Route path="/dev/components" element={<ComponentsPage />} />
      </Routes>
    </div>
  );
}
