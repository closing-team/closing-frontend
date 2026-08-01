import { useEffect, useMemo } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getBookmarks, getSupportDetail, getSupports } from "../api/support";
import { useSupportStore } from "../stores/supportStore";
import type { SupportSortCode } from "../types/supportApi";

const PAGE_SIZE = 20;

export const supportKeys = {
  lists: () => ["supports", "list"] as const,
  list: (sort: SupportSortCode) => ["supports", "list", sort] as const,
  detail: (supportId: number) => ["supports", "detail", supportId] as const,
  bookmarksAll: () => ["supports", "bookmarks"] as const,
  bookmarks: (sort: SupportSortCode) => ["supports", "bookmarks", sort] as const,
};

export function useSupportListQuery(sort: SupportSortCode) {
  const setPosts = useSupportStore((s) => s.setPosts);

  // TODO: sort 파라미터는 실제로 요청에 실어 보내지만, MSW 응답은 아직 정렬을
  // 반영하지 않고 전체 목업 데이터를 그대로 반환한다. 실제 정렬은 화면에서 처리한다.
  const query = useQuery({
    queryKey: supportKeys.list(sort),
    queryFn: () => getSupports({ sort, size: PAGE_SIZE }),
  });

  useEffect(() => {
    if (query.data) setPosts(query.data.supports);
  }, [query.data, setPosts]);

  return { isLoading: query.isLoading };
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
