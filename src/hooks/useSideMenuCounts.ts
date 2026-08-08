import { useSupportBookmarkCount } from "./useSupportQueries";
import { useInterestCount } from "./useInterestCount";
import { useChatRoomsQuery } from "./useChat";

export function useSideMenuCounts() {
  const { data: chatRooms = [] } = useChatRoomsQuery();
  const bookmarkCount = useSupportBookmarkCount();
  const interestCount = useInterestCount();
  const chatCount = chatRooms.length;

  return { bookmarkCount, interestCount, chatCount };
}
