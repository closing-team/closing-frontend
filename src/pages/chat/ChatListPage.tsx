import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatCard from "../../components/chat/ChatCard";
import { ROUTES, chatRoomPath } from "../../constants/routes";
import { useChatRoomsQuery } from "../../hooks/useChat";
import type { ChatRoomSummary } from "../../types/chat";

function sortRoomsByLatestMessage(rooms: ChatRoomSummary[]) {
  return [...rooms].sort(
    (first, second) => {
      const firstTime = Date.parse(first.lastMessageAt) || 0;
      const secondTime = Date.parse(second.lastMessageAt) || 0;
      return secondTime - firstTime;
    },
  );
}

export default function ChatListPage() {
  const navigate = useNavigate();
  const roomsQuery = useChatRoomsQuery();
  const sortedRooms = sortRoomsByLatestMessage(roomsQuery.data ?? []);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <TopBar title="채팅" onBack={() => navigate(ROUTES.HOME)} />

      <section className="mt-4 flex flex-1 flex-col" aria-label="채팅 목록">
        {roomsQuery.isLoading ? (
          <p className="px-4 py-12 text-center text-body-2 text-gray-400">
            채팅 목록을 불러오는 중입니다.
          </p>
        ) : roomsQuery.isError && sortedRooms.length === 0 ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 px-4 py-12 text-center"
          >
            <p className="text-body-2 text-gray-500">
              채팅 목록을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              className="text-body-3 font-semibold text-primary-500"
              onClick={() => void roomsQuery.refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : sortedRooms.length === 0 ? (
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
