import { useMemo } from "react";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookmarks, getSupportDetail, getSupports } from "../api/support";
import type { SupportSortCode } from "../types/supportApi";

const PAGE_SIZE = 20;
const COUNT_PAGE_SIZE = 100;

export const supportKeys = {
  lists: () => ["supports", "list"] as const,
  list: (sort: SupportSortCode) => ["supports", "list", sort] as const,
  detail: (supportId: number) => ["supports", "detail", supportId] as const,
  bookmarksAll: () => ["supports", "bookmarks"] as const,
  bookmarks: (sort: SupportSortCode) => ["supports", "bookmarks", sort] as const,
};

export function useSupportListQuery(sort: SupportSortCode) {
  const query = useQuery({
    queryKey: supportKeys.list(sort),
    queryFn: () => getSupports({ sort, size: PAGE_SIZE }),
  });

  return { posts: query.data?.supports ?? [], isLoading: query.isLoading };
}

export function useSupportDetailQuery(supportId: number | undefined) {
  return useQuery({
    queryKey: supportKeys.detail(supportId ?? -1),
    queryFn: () => getSupportDetail(supportId!),
    enabled: supportId !== undefined && !Number.isNaN(supportId),
  });
}

export function useBookmarksQuery(sort: SupportSortCode) {
  const query = useInfiniteQuery({
    queryKey: supportKeys.bookmarks(sort),
    queryFn: ({ pageParam }) =>
      getBookmarks({ sort, cursor: pageParam, size: PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasNext ? (lastPage.page.nextCursor ?? undefined) : undefined,
  });

  const bookmarks = useMemo(
    () => query.data?.pages.flatMap((page) => page.bookmarks) ?? [],
    [query.data],
  );

  return {
    bookmarks,
    isLoading: query.isLoading,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isFetchingNextPage: query.isFetchingNextPage,
  };
}

export function useSupportBookmarkCount(): number {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [...supportKeys.bookmarks("LATEST"), "total"],
    queryFn: async () => {
      const cached = queryClient.getQueryData<{
        pages: { bookmarks: unknown[]; page: { hasNext: boolean } }[];
      }>(supportKeys.bookmarks("LATEST"));
      if (cached && !cached.pages.at(-1)?.page.hasNext) {
        return cached.pages.reduce((sum, page) => sum + page.bookmarks.length, 0);
      }

      let total = 0;
      let cursor: string | undefined;
      for (;;) {
        const page = await getBookmarks({ sort: "LATEST", size: COUNT_PAGE_SIZE, cursor });
        total += page.bookmarks.length;
        if (!page.page.hasNext) break;
        cursor = page.page.nextCursor ?? undefined;
      }
      return total;
    },
  });

  return data ?? 0;
}
