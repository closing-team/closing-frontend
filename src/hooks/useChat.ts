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
    queryFn: async (): Promise<ChatRoomSummary[]> => {
      const data = await getChatRooms({ size: CHAT_LIST_SIZE });
      data.chatRooms.forEach((room) => {
        queryClient.setQueryData<ChatRoomDetail>(
          chatKeys.room(room.chatRoomId),
          chatRoomDtoToDetail(room),
        );
      });
      return data.chatRooms.map((room) => chatRoomDtoToSummary(room));
    },
    refetchInterval: CHAT_POLL_INTERVAL,
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
    queryFn: async (): Promise<ChatMessage[]> => {
      const data = await getChatMessages(chatRoomId, { size: CHAT_MESSAGE_SIZE });
      return data.messages.map((message) =>
        chatMessageDtoToMessage(chatRoomId, message),
      );
    },
    enabled: Number.isInteger(chatRoomId) && chatRoomId > 0,
    refetchInterval: CHAT_POLL_INTERVAL,
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
