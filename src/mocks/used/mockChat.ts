import type { ChatMessage } from "../../types/used";

export const MOCK_MESSAGES: Record<number, ChatMessage[]> = {
  3: [
    { id: 1, mine: true, text: "안녕하세요! 구매 가능할까요?", time: "오후 2:10" },
    { id: 2, mine: true, text: "내일 직거래 하고싶어요.", time: "오후 2:10" },
    { id: 3, mine: false, text: "네 가능해요!", time: "오후 2:10" },
  ],
};
