import partnerAvatar from "../assets/images/chat/chat-partner-avatar.png";
import productImage1 from "../assets/images/chat/chat-product-1.png";
import productImage2 from "../assets/images/chat/chat-product-2.png";
import productImage3 from "../assets/images/chat/chat-product-3.png";
import productImage4 from "../assets/images/chat/chat-product-4.png";
import type { ChatRoomSummary } from "../types/chat";

export const MOCK_CHAT_ROOMS: ChatRoomSummary[] = [
  {
    id: "chat-1",
    productId: "product-1",
    productName: "업소용 에스프레소 머신",
    productImageUrl: productImage1,
    partnerNickname: "민수아빠",
    partnerAvatarUrl: partnerAvatar,
    location: "부산 해운대구",
    lastMessage: "제품 상태는 어떤가요? 사진 추가 가능할까요?",
    lastMessageAt: "2026-07-19T10:00:00.000Z",
    relativeTime: "10분 전",
    unreadCount: 5,
  },
  {
    id: "chat-2",
    productId: "product-2",
    productName: "업소용 제빙기",
    productImageUrl: productImage2,
    partnerNickname: "자영업8년차",
    partnerAvatarUrl: partnerAvatar,
    location: "대구 수성구",
    lastMessage: "사진 확인했습니다. 조금만 네고 가능할까요?",
    lastMessageAt: "2026-07-19T09:10:00.000Z",
    relativeTime: "1시간 전",
    unreadCount: 3,
  },
  {
    id: "chat-3",
    productId: "product-3",
    productName: "카페 주방 집기",
    productImageUrl: productImage3,
    partnerNickname: "일괄매입환영",
    partnerAvatarUrl: partnerAvatar,
    location: "광주 동구",
    lastMessage: "전체 집기 리스트 보내주시면 견적 드립니다.",
    lastMessageAt: "2026-07-19T07:10:00.000Z",
    relativeTime: "3시간 전",
    unreadCount: 0,
  },
  {
    id: "chat-4",
    productId: "product-4",
    productName: "업소용 냉장 쇼케이스",
    productImageUrl: productImage4,
    partnerNickname: "주방마켓",
    partnerAvatarUrl: partnerAvatar,
    location: "서울 원흥동",
    lastMessage: "내일 오전 10시쯤 방문 수거 가능할까요?",
    lastMessageAt: "2026-07-14T10:00:00.000Z",
    relativeTime: "5일전",
    unreadCount: 0,
  },
];
