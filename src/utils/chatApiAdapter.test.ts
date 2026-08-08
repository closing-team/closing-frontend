import { describe, expect, it } from "vitest";
import {
  chatMessageDtoToMessage,
  chatRoomDtoToDetail,
  chatRoomDtoToSummary,
} from "./chatApiAdapter";
import type { ChatMessageDto, ChatRoomDto } from "../types/chatApi";

const room: ChatRoomDto = {
  chatRoomId: 31,
  otherMember: {
    memberId: 2,
    nickname: "정리왕",
    profileImageUrl: null,
  },
  product: {
    productId: 7,
    title: "작업용 의자",
    thumbnailUrl: "https://example.com/chair.jpg",
    price: 45000,
    status: "SELLING",
    tradeLocation: {
      district: "서울특별시 중구 명동",
      latitude: 37.5665,
      longitude: 126.978,
      distanceKm: null,
    },
  },
  lastMessage: "구매 가능한가요?",
  lastMessageAt: "2026-08-03T10:30:00",
  unreadMessageCount: 2,
};

describe("chat API adapter", () => {
  it("채팅방 목록 DTO를 상품명이 포함된 화면 모델로 바꾼다", () => {
    expect(chatRoomDtoToSummary(room, new Date("2026-08-03T10:35:00"))).toEqual({
      id: "31",
      productId: "7",
      productName: "작업용 의자",
      productImageUrl: "https://example.com/chair.jpg",
      partnerNickname: "정리왕",
      partnerAvatarUrl: "",
      location: "서울특별시 중구 명동",
      lastMessage: "구매 가능한가요?",
      lastMessageAt: "2026-08-03T10:30:00",
      relativeTime: "5분 전",
      unreadCount: 2,
    });
  });

  it("직거래 장소가 없는 상품은 장소를 빈 값으로 변환한다", () => {
    const summary = chatRoomDtoToSummary({
      ...room,
      product: { ...room.product, tradeLocation: null },
    });

    expect(summary.location).toBe("");
  });

  it("최근 메시지가 없는 새 채팅방도 안전하게 변환한다", () => {
    const summary = chatRoomDtoToSummary({
      ...room,
      lastMessage: null,
      lastMessageAt: null,
      unreadMessageCount: 0,
    });

    expect(summary.lastMessage).toBe("아직 메시지가 없습니다.");
    expect(summary.lastMessageAt).toBe("");
    expect(summary.relativeTime).toBe("");
  });

  it("채팅방 DTO를 채팅방 헤더 모델로 바꾼다", () => {
    expect(chatRoomDtoToDetail(room)).toMatchObject({
      id: "31",
      partnerNickname: "정리왕",
      partnerAvatarUrl: "",
      product: {
        id: "7",
        title: "작업용 의자",
        price: 45000,
        imageUrl: "https://example.com/chair.jpg",
        status: "selling",
      },
    });
  });

  it.each([
    [{ read: true }, true],
    [{ isRead: true }, true],
    [{ read: false, isRead: true }, false],
    [{}, false],
  ])("메시지의 읽음 필드 변형 %o을 허용한다", (readFields, expected) => {
    const message: ChatMessageDto = {
      messageId: 101,
      senderId: 1,
      messageType: "TEXT",
      content: "안녕하세요",
      mine: true,
      createdAt: "2026-08-03T10:30:00",
      ...readFields,
    };

    expect(chatMessageDtoToMessage(31, message).read).toBe(expected);
  });

  it("메시지를 화면 표시 시간과 발신자 정보가 있는 모델로 바꾼다", () => {
    const message: ChatMessageDto = {
      messageId: 101,
      senderId: 1,
      messageType: "TEXT",
      content: "안녕하세요",
      mine: false,
      read: true,
      createdAt: "2026-08-03T13:05:00",
    };

    expect(chatMessageDtoToMessage(31, message)).toEqual({
      id: "101",
      roomId: "31",
      sender: "other",
      type: "text",
      content: "안녕하세요",
      sentAt: "2026-08-03T13:05:00",
      displayTime: "오후 1:05",
      read: true,
    });
  });
});
