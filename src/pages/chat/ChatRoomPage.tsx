import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ChatComposer from "../../components/chat/ChatComposer";
import ProductBanner from "../../components/chat/ProductBanner";
import ChatRoomEmptyView from "../../components/chat/ChatRoomEmptyView";
import ChatBubble from "../../components/common/ChatBubble";
import TopBar from "../../components/common/TopBar";
import InvalidChatRoomPage from "./InvalidChatRoomPage";
import { usedDetailPath } from "../../constants/routes";
import {
  useChatMessagesQuery,
  useChatRoomsQuery,
  useMarkChatRoomReadMutation,
  useSendChatImagesMutation,
  useSendChatTextMutation,
} from "../../hooks/useChat";
import { toChatMessages, toChatRoomDetail } from "../../utils/chatAdapter";
import type { CreateChatRoomResponseData } from "../../types/chatApi";
import type {
  ChatMessage,
  ChatRoomDetail,
  PendingChatMessage,
} from "../../types/chat";

function sortMessagesBySentAt(messages: ChatMessage[]) {
  return [...messages].sort(
    (first, second) => Date.parse(first.sentAt) - Date.parse(second.sentAt),
  );
}

function groupAdjacentMessages(messages: ChatMessage[]) {
  return messages.reduce<ChatMessage[][]>((groups, message) => {
    const previousGroup = groups.at(-1);
    const previousMessage = previousGroup?.at(-1);

    if (
      previousGroup &&
      previousMessage &&
      previousMessage.sender === message.sender &&
      previousMessage.displayTime === message.displayTime
    ) {
      previousGroup.push(message);
    } else {
      groups.push([message]);
    }

    return groups;
  }, []);
}

interface ChatRoomViewProps {
  room: ChatRoomDetail;
  messages: ChatMessage[];
  onBack: () => void;
  onSelectProduct: (productId: string) => void;
  onSendMessage: (message: PendingChatMessage) => void | Promise<void>;
}

function ChatRoomView({
  room,
  messages,
  onBack,
  onSelectProduct,
  onSendMessage,
}: ChatRoomViewProps) {
  const sortedMessages = sortMessagesBySentAt(messages);
  const messageGroups = groupAdjacentMessages(sortedMessages);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const previousRoomIdRef = useRef(room.id);

  useLayoutEffect(() => {
    if (previousRoomIdRef.current !== room.id) {
      previousRoomIdRef.current = room.id;
      isNearBottomRef.current = true;
    }
  }, [room.id]);

  useEffect(() => {
    if (isNearBottomRef.current) {
      conversationEndRef.current?.scrollIntoView?.({ block: "end" });
    }
  }, [messages]);

  const handleSend = async (pendingMessage: PendingChatMessage) => {
    isNearBottomRef.current = true;
    await onSendMessage(pendingMessage);
  };

  return (
    <main className="flex h-dvh flex-col bg-white">
      <TopBar title={room.partnerNickname} onBack={onBack} />
      <ProductBanner
        imageUrl={room.product.imageUrl}
        title={room.product.title}
        price={room.product.price}
        onClick={() => onSelectProduct(room.product.id)}
      />

      <section
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4"
        aria-label="대화 내용"
        onScroll={(event) => {
          const target = event.currentTarget;
          isNearBottomRef.current =
            target.scrollHeight - target.scrollTop - target.clientHeight <= 24;
        }}
      >
        {messageGroups.length === 0 ? (
          <ChatRoomEmptyView partnerNickname={room.partnerNickname} />
        ) : (
          <p className="mt-5 self-stretch text-center text-body-3 text-gray-500">
            {room.dateLabel}
          </p>
        )}
        {messageGroups.map((group) => {
          const firstMessage = group[0];
          const isMine = firstMessage.sender === "me";

          return (
            <div
              key={firstMessage.id}
              data-testid="chat-message-group"
              data-sender={firstMessage.sender}
              className={`flex items-start gap-2 ${isMine ? "justify-end" : "justify-start"}`}
            >
              {!isMine && (
                <img
                  src={room.partnerAvatarUrl}
                  alt={`${room.partnerNickname} 프로필 이미지`}
                  className="h-8 w-8 shrink-0 rounded-full object-cover shadow-[0_5.333px_24.889px_0_rgba(0,0,0,0.08)]"
                />
              )}
              <div
                className={`flex flex-col gap-[5px] ${isMine ? "items-end" : "items-start"}`}
              >
                {group.map((message, index) => {
                  const isLastInGroup = index === group.length - 1;

                  return (
                    <div
                      key={message.id}
                      data-testid="chat-message"
                      data-sender={message.sender}
                    >
                      <ChatBubble
                        me={isMine}
                        time={isLastInGroup ? message.displayTime : undefined}
                        read={isLastInGroup && message.read}
                      >
                        {message.type === "image" ? (
                          <span className="flex flex-col gap-2">
                            <img
                              src={message.content}
                              alt="채팅 이미지"
                              className="max-w-full rounded"
                            />
                            {message.caption && <span>{message.caption}</span>}
                          </span>
                        ) : (
                          message.content
                        )}
                      </ChatBubble>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <div ref={conversationEndRef} aria-hidden="true" />
      </section>
      <ChatComposer key={room.id} onSend={handleSend} />
    </main>
  );
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatRoomId: chatRoomIdParam = "" } = useParams();
  const chatRoomId = Number(chatRoomIdParam);

  const stateRoom = (
    location.state as { room?: CreateChatRoomResponseData } | null
  )?.room;
  const { data: roomsData } = useChatRoomsQuery();
  const fallbackItem = roomsData?.chatRooms.find(
    (r) => r.chatRoomId === chatRoomId,
  );

  const room: CreateChatRoomResponseData | null =
    stateRoom && stateRoom.chatRoomId === chatRoomId
      ? stateRoom
      : fallbackItem
        ? {
            chatRoomId: fallbackItem.chatRoomId,
            product: fallbackItem.product,
            otherMember: fallbackItem.otherMember,
            createdAt: fallbackItem.lastMessageAt,
          }
        : null;

  const { data: messagesData } = useChatMessagesQuery(
    chatRoomId ? chatRoomId : null,
  );
  const sendText = useSendChatTextMutation();
  const sendImages = useSendChatImagesMutation();
  const markRead = useMarkChatRoomReadMutation();

  useEffect(() => {
    if (chatRoomId) markRead.mutate(chatRoomId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomId]);

  if (!chatRoomId || !room) return <InvalidChatRoomPage />;

  const messages = toChatMessages(chatRoomId, messagesData?.messages ?? []);

  return (
    <ChatRoomView
      room={toChatRoomDetail(room, messagesData?.messages ?? [])}
      messages={messages}
      onBack={() => navigate(-1)}
      onSelectProduct={() => navigate(usedDetailPath(room.product.productId))}
      onSendMessage={async (pending) => {
        if (pending.type === "text") {
          await sendText.mutateAsync({ chatRoomId, content: pending.content });
          return;
        }
        await sendImages.mutateAsync({ chatRoomId, images: [pending.file] });
        if (pending.caption) {
          await sendText.mutateAsync({ chatRoomId, content: pending.caption });
        }
      }}
    />
  );
}
