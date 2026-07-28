import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import TopBar from "../../components/common/TopBar";
import ChatEmptyView from "../../components/chat/ChatEmptyView";
import ChatCard from "../../components/chat/ChatCard";
import { ROUTES, chatRoomPath } from "../../constants/routes";
import { useChatStore } from "../../stores/chatStore";
import { getProductDetail } from "../../api/used";
import { productDetailDtoToProduct } from "../../utils/productAdapter";
import { productKeys } from "../../hooks/useProducts";
import { toChatRoomSummaries } from "../../utils/chatAdapter";
import type { ChatRoomSummary } from "../../types/chat";
import type { Product } from "../../types/used";

function sortRoomsByLatestMessage(rooms: ChatRoomSummary[]) {
  return [...rooms].sort(
    (first, second) =>
      new Date(second.lastMessageAt).getTime() -
      new Date(first.lastMessageAt).getTime(),
  );
}

export default function ChatListPage() {
  const navigate = useNavigate();
  const messagesByProduct = useChatStore((s) => s.messagesByProduct);
  const productIds = Object.keys(messagesByProduct).map(Number);

  const productQueries = useQueries({
    queries: productIds.map((id) => ({
      queryKey: productKeys.detail(id),
      queryFn: async () => productDetailDtoToProduct(await getProductDetail(id)),
    })),
  });
  const products = productQueries
    .map((q) => q.data)
    .filter((p): p is Product => !!p);

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
