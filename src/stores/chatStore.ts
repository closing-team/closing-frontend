import { create } from "zustand";
import type { ChatMessage } from "../types/used";
import { MOCK_MESSAGES } from "../mocks/used/mockUsedMessages";

interface ChatState {
  messagesByProduct: Record<number, ChatMessage[]>;
  sendMessage: (productId: number, text: string) => void;
}

function nowLabel(): string {
  const d = new Date();
  const h = d.getHours();
  const meridiem = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${meridiem} ${hour12}:${minute}`;
}

export const useChatStore = create<ChatState>((set) => ({
  messagesByProduct: MOCK_MESSAGES,

  sendMessage: (productId, text) =>
    set((state) => {
      const list = state.messagesByProduct[productId] ?? [];
      const message: ChatMessage = {
        id: (list.at(-1)?.id ?? 0) + 1,
        mine: true,
        text,
        time: nowLabel(),
        sentAt: new Date().toISOString(),
        read: false,
      };
      return {
        messagesByProduct: {
          ...state.messagesByProduct,
          [productId]: [...list, message],
        },
      };
    }),
}));
