import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatBubble from "../../components/common/ChatBubble";
import MessageInput from "../../components/used/MessageInput";
import { ImageIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import type { ChatMessage } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import cloySm from "../../assets/images/cloy-sm.png";

const EMPTY_MESSAGES: ChatMessage[] = [];

function todayLabel(): string {
  const d = new Date();
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function UsedChatPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const id = Number(productId);

  const product = useUsedStore((s) => s.products.find((p) => p.id === id));
  const messages =
    useUsedStore((s) => s.messagesByProduct[id]) ?? EMPTY_MESSAGES;
  const sendMessage = useUsedStore((s) => s.sendMessage);

  const sellerName = product?.sellerName ?? "판매자";

  return (
    <div className="flex min-h-screen flex-col bg-white pb-24">
      <TopBar title={sellerName} onBack={() => navigate(-1)} />

      {product && (
        <div className="flex items-center gap-3 border-b border-gray-100 bg-gray-30 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 text-gray-200">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-5 w-5" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-3 text-gray-900">
              {product.title}
            </p>
            <p className="text-caption-1 text-gray-900">
              {product.price.toLocaleString("ko-KR")}원
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 pb-4 pt-5">
        {messages.length > 0 && (
          <p className="w-full py-1 text-center text-body-3 text-gray-500">
            {todayLabel()}
          </p>
        )}
        {messages.map((message, i) => {
          const prev = messages[i - 1];
          const next = messages[i + 1];
          const showTime = !next || next.mine !== message.mine;
          const sameAsPrev = !!prev && prev.mine === message.mine;
          const marginClass = i === 0 ? "mt-3" : sameAsPrev ? "mt-[5px]" : "mt-3";
          const avatar =
            message.mine || sameAsPrev ? (
              <span className="h-9 w-9 shrink-0" />
            ) : (
              <img
                src={cloySm}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full"
              />
            );
          return (
            <div key={message.id} className={marginClass}>
              <ChatBubble
                me={message.mine}
                time={showTime ? message.time : undefined}
                read={message.mine && showTime}
                avatar={avatar}
              >
                {message.text}
              </ChatBubble>
            </div>
          );
        })}
      </div>

      <MessageInput onSend={(text) => sendMessage(id, text)} />

      {!product && (
        <p className="px-4 text-center text-body-2 text-gray-400">
          <button type="button" onClick={() => navigate(ROUTES.USED)}>
            목록으로 돌아가기
          </button>
        </p>
      )}
    </div>
  );
}
