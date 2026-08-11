import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import {
  createChatRoom,
  getChatMessages,
  getChatRooms,
  markChatRoomRead,
  sendImageMessages,
  sendTextMessage,
} from "../api/chat";
import type { ChatMessage, ChatRoomDetail, ChatRoomSummary } from "../types/chat";
import type { SendChatMessageDto } from "../types/chatApi";
import {
  chatMessageDtoToMessage,
  chatRoomDtoToDetail,
  chatRoomDtoToSummary,
} from "../utils/chatApiAdapter";

const CHAT_POLL_INTERVAL = 3_000;
const CHAT_LIST_SIZE = 20;
const CHAT_MESSAGE_SIZE = 100;
const MAX_POLL_FAILURES = 5;

// query-core가 fetch 시작마다 state.fetchFailureCount를 0으로 초기화(fetchState)해,
// retry를 끈 폴링에서는 임계치 판정에 사용 불가. 연속 실패 횟수는 직접 카운트해
// 마운트, 포커스 재조회에도 초기화되지 않도록 모듈 스코프에 보관
const pollFailures = new Map<string, number>();

async function countPollResult<T>(
  key: string,
  run: () => Promise<T>,
): Promise<T> {
  try {
    const result = await run();
    pollFailures.set(key, 0);
    return result;
  } catch (error) {
    pollFailures.set(key, (pollFailures.get(key) ?? 0) + 1);
    throw error;
  }
}

function pollUnlessFailing(key: string) {
  return () =>
    (pollFailures.get(key) ?? 0) >= MAX_POLL_FAILURES
      ? false
      : CHAT_POLL_INTERVAL;
}

export const chatKeys = {
  all: ["chat"] as const,
  rooms: () => ["chat", "rooms"] as const,
  room: (chatRoomId: number) => ["chat", "room", chatRoomId] as const,
  messages: (chatRoomId: number) => ["chat", "messages", chatRoomId] as const,
};

function cacheSentMessages(
  queryClient: QueryClient,
  chatRoomId: number,
  data: SendChatMessageDto,
) {
  const sentMessages = data.messages.map((message) =>
    chatMessageDtoToMessage(chatRoomId, message),
  );
  queryClient.setQueryData<ChatMessage[]>(
    chatKeys.messages(chatRoomId),
    (current = []) => {
      const byId = new Map(current.map((message) => [message.id, message]));
      sentMessages.forEach((message) => byId.set(message.id, message));
      return [...byId.values()];
    },
  );
  void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
}

export function useChatRoomsQuery() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () =>
      countPollResult("rooms", async (): Promise<ChatRoomSummary[]> => {
        const data = await getChatRooms({ size: CHAT_LIST_SIZE });
        data.chatRooms.forEach((room) => {
          queryClient.setQueryData<ChatRoomDetail>(
            chatKeys.room(room.chatRoomId),
            chatRoomDtoToDetail(room),
          );
        });
        return data.chatRooms.map((room) => chatRoomDtoToSummary(room));
      }),
    refetchInterval: pollUnlessFailing("rooms"),
    retry: false,
  });
}

export function useChatRoomQuery(chatRoomId: number) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: chatKeys.room(chatRoomId),
    queryFn: async (): Promise<ChatRoomDetail> => {
      const cached = queryClient.getQueryData<ChatRoomDetail>(
        chatKeys.room(chatRoomId),
      );
      if (cached) return cached;

      const data = await getChatRooms({ size: CHAT_LIST_SIZE });
      const room = data.chatRooms.find((item) => item.chatRoomId === chatRoomId);
      if (!room) throw new Error("채팅방을 찾을 수 없습니다.");
      return chatRoomDtoToDetail(room);
    },
    enabled: Number.isInteger(chatRoomId) && chatRoomId > 0,
  });
}

export function useChatMessagesQuery(chatRoomId: number) {
  return useQuery({
    queryKey: chatKeys.messages(chatRoomId),
    queryFn: () =>
      countPollResult(`messages:${chatRoomId}`, async (): Promise<ChatMessage[]> => {
        const data = await getChatMessages(chatRoomId, {
          size: CHAT_MESSAGE_SIZE,
        });
        return data.messages.map((message) =>
          chatMessageDtoToMessage(chatRoomId, message),
        );
      }),
    enabled: Number.isInteger(chatRoomId) && chatRoomId > 0,
    refetchInterval: pollUnlessFailing(`messages:${chatRoomId}`),
    retry: false,
  });
}

export function useCreateChatRoomMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChatRoom,
    onSuccess: (room) => {
      queryClient.setQueryData(
        chatKeys.room(room.chatRoomId),
        chatRoomDtoToDetail(room),
      );
      void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}

export function useSendTextMessageMutation(chatRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => sendTextMessage(chatRoomId, content),
    onSuccess: (data) => {
      cacheSentMessages(queryClient, chatRoomId, data);
    },
  });
}

export function useSendImageMessagesMutation(chatRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: File[]) => sendImageMessages(chatRoomId, images),
    onSuccess: (data) => {
      cacheSentMessages(queryClient, chatRoomId, data);
    },
  });
}

export function useMarkChatRoomRead(chatRoomId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markChatRoomRead(chatRoomId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}
