import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "../../assets/icons";
import ChatComposer from "../../components/chat/ChatComposer";
import ChatImageLightbox from "../../components/chat/ChatImageLightbox";
import ProductBanner from "../../components/chat/ProductBanner";
import ChatRoomEmptyView from "../../components/chat/ChatRoomEmptyView";
import ChatBubble from "../../components/common/ChatBubble";
import TopBar from "../../components/common/TopBar";
import InvalidChatRoomPage from "./InvalidChatRoomPage";
import ChatRoomSkeleton from "../../components/chat/ChatRoomSkeleton";
import { MAX_CHAT_IMAGES_PER_MESSAGE } from "../../constants/chat";
import { usedDetailPath } from "../../constants/routes";
import {
  useChatMessagesQuery,
  useChatRoomQuery,
  useMarkChatRoomRead,
  useSendImageMessagesMutation,
  useSendTextMessageMutation,
} from "../../hooks/useChat";
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

type MessageRenderUnit =
  | { kind: "text"; message: ChatMessage }
  | { kind: "images"; messages: ChatMessage[] };

function toRenderUnits(group: ChatMessage[]): MessageRenderUnit[] {
  return group.reduce<MessageRenderUnit[]>((units, message) => {
    if (message.type === "image") {
      const lastUnit = units.at(-1);
      if (
        lastUnit?.kind === "images" &&
        lastUnit.messages.length < MAX_CHAT_IMAGES_PER_MESSAGE
      ) {
        lastUnit.messages.push(message);
        return units;
      }
      units.push({ kind: "images", messages: [message] });
      return units;
    }
    units.push({ kind: "text", message });
    return units;
  }, []);
}

const IMAGE_GROUP_LAYOUT: Record<number, { container: string; cell: string }> = {
  1: { container: "flex", cell: "h-[120px] w-[120px]" },
  2: { container: "flex gap-1", cell: "h-[120px] w-[120px]" },
  3: { container: "flex gap-1", cell: "h-[90px] w-[90px]" },
  4: { container: "grid grid-cols-2 gap-1", cell: "h-[120px] w-[120px]" },
};

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
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const shouldScrollToBottomRef = useRef(true);
  const sortedMessages = sortMessagesBySentAt(messages);
  const messageGroups = groupAdjacentMessages(sortedMessages);
  const [avatarError, setAvatarError] = useState(false);
  const [erroredImageMessages, setErroredImageMessages] = useState<Set<string>>(
    new Set(),
  );
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  useLayoutEffect(() => {
    isNearBottomRef.current = true;
    shouldScrollToBottomRef.current = true;
  }, [room.id]);

  useEffect(() => {
    if (shouldScrollToBottomRef.current || isNearBottomRef.current) {
      conversationEndRef.current?.scrollIntoView?.({ block: "end" });
      shouldScrollToBottomRef.current = false;
    }
  }, [room.id, messages]);

  const handleSend = async (pendingMessage: PendingChatMessage) => {
    await onSendMessage(pendingMessage);
    shouldScrollToBottomRef.current = true;
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
              {!isMine &&
                (room.partnerAvatarUrl && !avatarError ? (
                  <img
                    src={room.partnerAvatarUrl}
                    alt={`${room.partnerNickname} 프로필 이미지`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setAvatarError(true)}
                    className="h-8 w-8 shrink-0 rounded-full object-cover shadow-[0_5.333px_24.889px_0_rgba(0,0,0,0.08)]"
                  />
                ) : (
                  <span
                    aria-label={`${room.partnerNickname} 프로필 이미지`}
                    className="h-8 w-8 shrink-0 rounded-full bg-gray-100 shadow-[0_5.333px_24.889px_0_rgba(0,0,0,0.08)]"
                  />
                ))}
              <div
                className={`flex flex-col gap-[5px] ${isMine ? "items-end" : "items-start"}`}
              >
                {toRenderUnits(group).map((unit, unitIndex, units) => {
                  const isLastUnit = unitIndex === units.length - 1;

                  if (unit.kind === "text") {
                    const { message } = unit;
                    return (
                      <div
                        key={message.id}
                        data-testid="chat-message"
                        data-sender={message.sender}
                      >
                        <ChatBubble
                          me={isMine}
                          time={isLastUnit ? message.displayTime : undefined}
                          read={isLastUnit && message.read}
                        >
                          {message.content}
                        </ChatBubble>
                      </div>
                    );
                  }

                  const { messages: imageMessages } = unit;
                  const lastImageMessage = imageMessages.at(-1)!;
                  const layout = IMAGE_GROUP_LAYOUT[imageMessages.length];
                  const time = isLastUnit ? lastImageMessage.displayTime : undefined;

                  return (
                    <div
                      key={imageMessages[0].id}
                      data-testid="chat-message-images"
                      data-sender={imageMessages[0].sender}
                      className={`flex flex-col gap-[5px] ${isMine ? "items-end" : "items-start"}`}
                    >
                      <div className={layout.container}>
                        {imageMessages.map((message) => (
                          <button
                            key={message.id}
                            type="button"
                            aria-label="이미지 확대보기"
                            disabled={erroredImageMessages.has(message.id)}
                            onClick={() => setLightboxSrc(message.content)}
                            className={`${layout.cell} shrink-0 overflow-hidden rounded-md disabled:cursor-default`}
                          >
                            {erroredImageMessages.has(message.id) ? (
                              <span className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-200">
                                <ImageIcon className="h-8 w-8" />
                              </span>
                            ) : (
                              <img
                                src={message.content}
                                alt="채팅 이미지"
                                loading="lazy"
                                decoding="async"
                                onError={() =>
                                  setErroredImageMessages(
                                    (prev) => new Set(prev).add(message.id),
                                  )
                                }
                                className="h-full w-full object-cover"
                              />
                            )}
                          </button>
                        ))}
                      </div>
                      {time && (
                        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap px-0.5 text-caption-3 text-gray-400">
                          {isMine && lastImageMessage.read && <span>읽음</span>}
                          <span>{time}</span>
                        </span>
                      )}
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
      {lightboxSrc && (
        <ChatImageLightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}
    </main>
  );
}

export default function ChatRoomPage() {
  const navigate = useNavigate();
  const { chatRoomId = "" } = useParams();
  const roomId = Number(chatRoomId);
  const roomQuery = useChatRoomQuery(roomId);
  const messagesQuery = useChatMessagesQuery(roomId);
  const sendMessage = useSendTextMessageMutation(roomId);
  const sendImages = useSendImageMessagesMutation(roomId);
  const { mutate: markRead } = useMarkChatRoomRead(roomId);

  useEffect(() => {
    if (roomQuery.data && Number.isInteger(roomId) && roomId > 0) {
      markRead();
    }
  }, [markRead, roomId, roomQuery.data]);

  if (!Number.isInteger(roomId) || roomId <= 0 || roomQuery.isError) {
    return <InvalidChatRoomPage />;
  }

  if (roomQuery.isLoading || !roomQuery.data) {
    return (
      <main className="flex min-h-dvh flex-col bg-white">
        <TopBar title="채팅" onBack={() => navigate(-1)} />
        <ChatRoomSkeleton />
      </main>
    );
  }

  const room = roomQuery.data;

  return (
    <ChatRoomView
      room={room}
      messages={messagesQuery.data ?? []}
      onBack={() => navigate(-1)}
      onSelectProduct={() => navigate(usedDetailPath(room.product.id))}
      onSendMessage={async (pending) => {
        if (pending.type === "image") {
          await sendImages.mutateAsync(pending.files);
          return;
        }
        await sendMessage.mutateAsync(pending.content);
      }}
    />
  );
}
