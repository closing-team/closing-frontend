import { useUsedStore } from "../stores/usedStore";
import { useSupportStore } from "../stores/supportStore";
import { useInterestCount } from "./useInterestCount";

export function useSideMenuCounts() {
  const messagesByProduct = useUsedStore((s) => s.messagesByProduct);
  const bookmarkCount = useSupportStore(
    (s) => s.posts.filter((post) => post.isBookmarked).length,
  );
  const interestCount = useInterestCount();
  const chatCount = Object.keys(messagesByProduct).length;

  return { bookmarkCount, interestCount, chatCount };
}
