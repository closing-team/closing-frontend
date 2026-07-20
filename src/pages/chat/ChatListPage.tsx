import TopBar from "../../components/common/TopBar";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatListItem from "../../components/chat/ChatListItem";
import { MOCK_CHAT_ROOMS } from "../../mocks/mockChat";
import type { ChatRoomSummary } from "../../types/chat";

interface ChatListPageProps {
  rooms?: ChatRoomSummary[];
  onBack?: () => void;
  onNavigateHome?: () => void;
  onSelectRoom?: (roomId: string) => void;
}

function sortRoomsByLatestMessage(rooms: ChatRoomSummary[]) {
  return [...rooms].sort(
    (first, second) =>
      new Date(second.lastMessageAt).getTime() -
      new Date(first.lastMessageAt).getTime(),
  );
}

function navigateToHome() {
  window.location.assign("/");
}

export default function ChatListPage({
  rooms = MOCK_CHAT_ROOMS,
  onBack,
  onNavigateHome,
  onSelectRoom = () => {},
}: ChatListPageProps) {
  const sortedRooms = sortRoomsByLatestMessage(rooms);
  const handleBack = onBack ?? onNavigateHome ?? navigateToHome;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <TopBar title="채팅" onBack={handleBack} />

      <section className="mt-4 flex flex-1 flex-col" aria-label="채팅 목록">
        {sortedRooms.length === 0 ? (
          <ChatEmptyView />
        ) : (
          sortedRooms.map((room) => (
            <ChatListItem key={room.id} room={room} onSelect={onSelectRoom} />
          ))
        )}
      </section>
    </main>
  );
}
