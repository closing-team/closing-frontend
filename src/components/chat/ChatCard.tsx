import { ImageIcon } from "../../assets/icons";
import type { ChatRoomSummary } from "../../types/chat";

interface ChatCardProps {
  room: ChatRoomSummary;
  onSelect: (roomId: string) => void;
}

export default function ChatCard({ room, onSelect }: ChatCardProps) {
  const unreadMessageLabel =
    room.unreadCount > 0 ? `읽지 않은 메시지 ${room.unreadCount}개` : null;
  const meta = [room.location, room.relativeTime].filter(Boolean).join(" · ");
  const accessibleName = [
    `${room.partnerNickname} 채팅방`,
    room.lastMessage,
    meta,
    unreadMessageLabel,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      aria-label={accessibleName}
      onClick={() => onSelect(room.id)}
      className="flex h-[99px] w-full items-center gap-3 bg-white p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
    >
      <span className="relative h-[66px] w-[66px] shrink-0">
        {room.productImageUrl ? (
          <img
            src={room.productImageUrl}
            alt={`${room.productName} 상품 이미지`}
            className="absolute left-0 top-0 h-[58px] w-[58px] rounded-lg object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${room.productName} 상품 이미지`}
            className="absolute left-0 top-0 flex h-[58px] w-[58px] items-center justify-center rounded-lg bg-gray-100 text-gray-200"
          >
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        {room.partnerAvatarUrl ? (
          <img
            src={room.partnerAvatarUrl}
            alt={`${room.partnerNickname} 프로필 이미지`}
            className="absolute left-[30px] top-[30px] h-9 w-9 rounded-full border-2 border-white object-cover shadow-[0_6px_28px_0_rgba(0,0,0,0.08)]"
          />
        ) : (
          <span
            aria-label={`${room.partnerNickname} 프로필 이미지`}
            className="absolute left-[30px] top-[30px] h-9 w-9 rounded-full border-2 border-white bg-gray-100 shadow-[0_6px_28px_0_rgba(0,0,0,0.08)]"
          />
        )}
      </span>

      <span className="flex min-w-0 flex-1 items-center gap-8">
        <span className="flex w-[216px] shrink-0 flex-col gap-0.5">
          <span className="text-title-3 text-gray-900">{room.partnerNickname}</span>
          <span className="truncate text-body-2 text-gray-900">{room.lastMessage}</span>
          {meta && <span className="text-body-3 text-gray-500">{meta}</span>}
        </span>

        <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center">
          {room.unreadCount > 0 && (
            <span
              aria-label={unreadMessageLabel!}
              className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-primary-500 py-0 pl-[5px] pr-1 text-caption-1 leading-[18px] text-white"
            >
              {room.unreadCount}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
