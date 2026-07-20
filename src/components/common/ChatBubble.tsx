import type { ReactNode } from "react";

interface ChatBubbleProps {
  me?: boolean;
  time?: string;
  read?: boolean;
  avatar?: ReactNode;
  children: ReactNode;
}

export default function ChatBubble({
  me = false,
  time,
  read = false,
  avatar,
  children,
}: ChatBubbleProps) {
  const column = (
    <div
      className={`flex flex-col gap-[5px] ${me ? "items-end" : "items-start"}`}
    >
      <div
        className={`max-w-[284px] rounded-lg px-4 py-3 text-body-2 ${
          me
            ? "bg-primary-500 text-white"
            : "border border-gray-100 bg-gray-5 text-gray-900"
        }`}
      >
        {children}
      </div>
      {time && (
        <span className="flex shrink-0 items-center gap-1 whitespace-nowrap px-0.5 text-caption-3 text-gray-400">
          {me && read && <span>읽음</span>}
          <span>{time}</span>
        </span>
      )}
    </div>
  );

  if (!me && avatar) {
    return (
      <div className="flex items-start gap-2">
        {avatar}
        {column}
      </div>
    );
  }

  return column;
}
