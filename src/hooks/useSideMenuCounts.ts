import { useSupportBookmarkCount } from "./useSupportQueries";
import { useInterestCount } from "./useInterestCount";
import { useChatRoomsQuery } from "./useChat";

export function useSideMenuCounts() {
  const bookmarkCount = useSupportBookmarkCount();
  const interestCount = useInterestCount();
  const { data: chatRoomsData } = useChatRoomsQuery();
  const chatCount = chatRoomsData?.chatRooms.length ?? 0;

  return { bookmarkCount, interestCount, chatCount };
}
