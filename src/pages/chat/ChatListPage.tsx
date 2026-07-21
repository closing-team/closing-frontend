import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatCard from "../../components/chat/ChatCard";
import { ROUTES, chatRoomPath } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { toChatRoomSummaries } from "../../utils/chatAdapter";
import type { ChatRoomSummary } from "../../types/chat";

function sortRoomsByLatestMessage(rooms: ChatRoomSummary[]) {
  return [...rooms].sort(
    (first, second) =>
      new Date(second.lastMessageAt).getTime() -
      new Date(first.lastMessageAt).getTime(),
  );
}

export default function ChatListPage() {
  const navigate = useNavigate();
  const products = useUsedStore((s) => s.products);
  const messagesByProduct = useUsedStore((s) => s.messagesByProduct);
  const sortedRooms = sortRoomsByLatestMessage(
    toChatRoomSummaries(products, messagesByProduct),
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <TopBar title="채팅" onBack={() => navigate(ROUTES.HOME)} />

      <section className="mt-4 flex flex-1 flex-col" aria-label="채팅 목록">
        {sortedRooms.length === 0 ? (
          <ChatEmptyView />
        ) : (
          sortedRooms.map((room) => (
            <ChatCard
              key={room.id}
              room={room}
              onSelect={(roomId) => navigate(chatRoomPath(roomId))}
            />
          ))
        )}
      </section>
    </main>
  );
}
