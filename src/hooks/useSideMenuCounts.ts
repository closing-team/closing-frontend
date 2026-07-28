import { useChatStore } from "../stores/chatStore";
import { useSupportStore } from "../stores/supportStore";
import { useInterestCount } from "./useInterestCount";

export function useSideMenuCounts() {
  const messagesByProduct = useChatStore((s) => s.messagesByProduct);
  const bookmarkCount = useSupportStore(
    (s) =>
      s.posts.filter((post) => s.isBookmarked(post.supportId, post.isBookmarked))
        .length,
  );
  const interestCount = useInterestCount();
  const chatCount = Object.keys(messagesByProduct).length;

  return { bookmarkCount, interestCount, chatCount };
}
