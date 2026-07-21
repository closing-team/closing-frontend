import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ChatComposer from "../../components/chat/ChatComposer";
import ProductBanner from "../../components/chat/ProductBanner";
import ChatBubble from "../../components/common/ChatBubble";
import TopBar from "../../components/common/TopBar";
import {
  MOCK_CHAT_MESSAGES,
  MOCK_CHAT_ROOM_DETAIL,
} from "../../mocks/chat/mockChat";
import type {
  ChatMessage,
  ChatRoomDetail,
  PendingChatMessage,
} from "../../types/chat";

export interface ChatRoomPageProps {
  room?: ChatRoomDetail;
  messages?: ChatMessage[];
  onBack?: () => void;
  onSelectProduct?: (productId: string) => void;
  onSendMessage?: (
    message: PendingChatMessage,
  ) => ChatMessage | void | Promise<ChatMessage | void>;
}

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

export default function ChatRoomPage({
  room = MOCK_CHAT_ROOM_DETAIL,
  messages = MOCK_CHAT_MESSAGES,
  onBack = () => {},
  onSelectProduct = () => {},
  onSendMessage = () => {},
}: ChatRoomPageProps) {
  const [localMessages, setLocalMessages] = useState(() => [...messages]);
  const sentBlobUrlsRef = useRef(new Set<string>());
  const localMessageIdsRef = useRef(new Set<string>());
  const previousRoomIdRef = useRef(room.id);
  const activeRoomIdRef = useRef(room.id);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);
  const sortedMessages = sortMessagesBySentAt(localMessages);
  const messageGroups = groupAdjacentMessages(sortedMessages);

  useLayoutEffect(() => {
    activeRoomIdRef.current = room.id;
  }, [room.id]);

  useEffect(
    () => () => {
      sentBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );

  useLayoutEffect(() => {
    const roomChanged = previousRoomIdRef.current !== room.id;

    if (roomChanged) {
      sentBlobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      sentBlobUrlsRef.current.clear();
      localMessageIdsRef.current.clear();
      previousRoomIdRef.current = room.id;
      isNearBottomRef.current = true;
      shouldScrollToBottomRef.current = true;
    }

    setLocalMessages((currentMessages) => {
      if (roomChanged) {
        return [...messages];
      }

      const incomingIds = new Set(messages.map((message) => message.id));
      incomingIds.forEach((id) => localMessageIdsRef.current.delete(id));
      const unacknowledgedLocalMessages = currentMessages.filter(
        (message) =>
          localMessageIdsRef.current.has(message.id) &&
          !incomingIds.has(message.id),
      );

      return [...messages, ...unacknowledgedLocalMessages];
    });
  }, [messages, room.id]);

  useEffect(() => {
    if (shouldScrollToBottomRef.current || isNearBottomRef.current) {
      conversationEndRef.current?.scrollIntoView?.({ block: "end" });
      shouldScrollToBottomRef.current = false;
    }
  }, [room.id, localMessages]);

  const handleSend = async (pendingMessage: PendingChatMessage) => {
    const sendingRoomId = room.id;
    const savedMessage = await onSendMessage(pendingMessage);

    if (activeRoomIdRef.current !== sendingRoomId) {
      return;
    }

    const sentAt = new Date();
    const messageId = crypto.randomUUID();
    const message: ChatMessage = savedMessage ?? {
      id: messageId,
      roomId: sendingRoomId,
      sender: "me",
      type: pendingMessage.type,
      content: pendingMessage.content,
      ...(pendingMessage.type === "image" && pendingMessage.caption
        ? { caption: pendingMessage.caption }
        : {}),
      sentAt: sentAt.toISOString(),
      displayTime: new Intl.DateTimeFormat("ko-KR", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(sentAt),
      read: false,
    };

    if (
      pendingMessage.type === "image" &&
      pendingMessage.content.startsWith("blob:")
    ) {
      if (message.content === pendingMessage.content) {
        sentBlobUrlsRef.current.add(pendingMessage.content);
      } else {
        URL.revokeObjectURL(pendingMessage.content);
      }
    }

    localMessageIdsRef.current.add(message.id);
    shouldScrollToBottomRef.current = true;
    setLocalMessages((currentMessages) => [...currentMessages, message]);
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
        <p className="mt-5 self-stretch text-center text-body-3 text-gray-500">
          {room.dateLabel}
        </p>
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
