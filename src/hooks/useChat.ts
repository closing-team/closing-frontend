import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrGetChatRoom,
  getChatMessages,
  getChatRooms,
  markChatRoomRead,
  sendChatImages,
  sendChatText,
} from "../api/chat";

export const chatKeys = {
  rooms: () => ["chat", "rooms"] as const,
  messages: (chatRoomId: number) => ["chat", "messages", chatRoomId] as const,
};

export function useChatRoomsQuery() {
  return useQuery({
    queryKey: chatKeys.rooms(),
    queryFn: () => getChatRooms({}),
  });
}

export function useChatMessagesQuery(chatRoomId: number | null) {
  return useQuery({
    queryKey: chatKeys.messages(chatRoomId ?? 0),
    queryFn: () => getChatMessages(chatRoomId!, {}),
    enabled: chatRoomId !== null,
  });
}

export function useCreateChatRoomMutation() {
  return useMutation({
    mutationFn: createOrGetChatRoom,
  });
}

export function useSendChatTextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatRoomId, content }: { chatRoomId: number; content: string }) =>
      sendChatText(chatRoomId, content),
    onSuccess: (_data, { chatRoomId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatRoomId) });
    },
  });
}

export function useSendChatImagesMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ chatRoomId, images }: { chatRoomId: number; images: File[] }) =>
      sendChatImages(chatRoomId, images),
    onSuccess: (_data, { chatRoomId }) => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
      queryClient.invalidateQueries({ queryKey: chatKeys.messages(chatRoomId) });
    },
  });
}

export function useMarkChatRoomReadMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markChatRoomRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
}
