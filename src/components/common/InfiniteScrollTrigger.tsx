import { useInfiniteScrollSentinel } from "../../hooks/useInfiniteScrollSentinel";

interface InfiniteScrollTriggerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export default function InfiniteScrollTrigger({
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useInfiniteScrollSentinel(
    onLoadMore,
    hasNextPage && !isFetchingNextPage,
  );

  if (!hasNextPage) return null;

  return (
    <div ref={sentinelRef} className="py-4 text-center text-body-2 text-gray-400">
      {isFetchingNextPage ? "불러오는 중..." : ""}
    </div>
  );
}
