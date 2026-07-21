import type { ChatMessage } from "../../types/used";

export const MOCK_MESSAGES: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      mine: true,
      text: "안녕하세요, 냉동고 상태 좀 더 자세히 볼 수 있을까요?",
      time: "오전 11:20",
      sentAt: "2026-07-18T02:20:00.000Z",
      read: true,
    },
    {
      id: 2,
      mine: true,
      text: "박스 개수도 25개 맞는지 궁금해요.",
      time: "오전 11:20",
      sentAt: "2026-07-18T02:20:30.000Z",
      read: true,
    },
    {
      id: 3,
      mine: false,
      text: "네, 사진 추가로 보내드릴게요.",
      time: "오전 11:25",
      sentAt: "2026-07-18T02:25:00.000Z",
      read: true,
    },
  ],
  3: [
    {
      id: 1,
      mine: true,
      text: "안녕하세요! 구매 가능할까요?",
      time: "오후 2:10",
      sentAt: "2026-05-10T05:10:00.000Z",
      read: true,
    },
    {
      id: 2,
      mine: true,
      text: "내일 직거래 하고싶어요.",
      time: "오후 2:10",
      sentAt: "2026-05-10T05:10:01.000Z",
      read: true,
    },
    {
      id: 3,
      mine: false,
      text: "네 가능해요!",
      time: "오후 2:10",
      sentAt: "2026-05-10T05:10:02.000Z",
      read: true,
    },
  ],
  4: [
    {
      id: 1,
      mine: true,
      text: "빙삭기 내일 오전에 방문 수거 가능할까요?",
      time: "오전 9:40",
      sentAt: "2026-07-14T00:40:00.000Z",
      read: true,
    },
    {
      id: 2,
      mine: false,
      text: "네, 10시쯤 오시면 될 것 같아요.",
      time: "오전 9:42",
      sentAt: "2026-07-14T00:42:00.000Z",
      read: false,
    },
  ],
  6: [
    {
      id: 1,
      mine: true,
      text: "작업대 사이즈가 1200 맞나요?",
      time: "오후 4:05",
      sentAt: "2026-07-12T07:05:00.000Z",
      read: true,
    },
    {
      id: 2,
      mine: false,
      text: "네 맞습니다, 미사용급이에요.",
      time: "오후 4:10",
      sentAt: "2026-07-12T07:10:00.000Z",
      read: true,
    },
  ],
};
