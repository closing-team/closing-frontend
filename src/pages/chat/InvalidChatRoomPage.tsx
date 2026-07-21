import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TopBar from "../../components/common/TopBar";
import { ROUTES } from "../../constants/routes";

export default function InvalidChatRoomPage() {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <TopBar title="채팅" onBack={() => navigate(ROUTES.CHAT)} />
      <section className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <h1 className="text-title-2 text-gray-900">채팅방을 찾을 수 없습니다.</h1>
        <p className="mt-2 text-body-2 text-gray-500">
          채팅 목록에서 다시 선택해주세요.
        </p>
        <Button className="mt-6" onClick={() => navigate(ROUTES.CHAT)}>
          채팅 목록으로
        </Button>
      </section>
    </main>
  );
}
