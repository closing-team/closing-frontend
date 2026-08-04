import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatCard from "../../components/chat/ChatCard";
import { ROUTES, chatRoomPath } from "../../constants/routes";
import { useChatRoomsQuery } from "../../hooks/useChat";
import { toChatRoomSummaries } from "../../utils/chatAdapter";

export default function ChatListPage() {
  const navigate = useNavigate();
  const { data } = useChatRoomsQuery();
  const rooms = toChatRoomSummaries(data?.chatRooms ?? []);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <TopBar title="채팅" onBack={() => navigate(ROUTES.HOME)} />

      <section className="mt-4 flex flex-1 flex-col" aria-label="채팅 목록">
        {rooms.length === 0 ? (
          <ChatEmptyView />
        ) : (
          rooms.map((room) => {
            const item = data?.chatRooms.find(
              (r) => String(r.chatRoomId) === room.id,
            );
            return (
              <ChatCard
                key={room.id}
                room={room}
                onSelect={(roomId) =>
                  navigate(chatRoomPath(roomId), {
                    state: item
                      ? {
                          room: {
                            chatRoomId: item.chatRoomId,
                            product: item.product,
                            otherMember: item.otherMember,
                            createdAt: item.lastMessageAt,
                          },
                        }
                      : undefined,
                  })
                }
              />
            );
          })
        )}
      </section>
    </main>
  );
}
