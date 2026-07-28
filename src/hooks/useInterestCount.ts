import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { useUsedStore } from "../stores/usedStore";
import { getBookmarkedProducts } from "../api/used";
import { productKeys } from "./useProducts";
import type { BookmarkedProductListDataDto } from "../types/productApi";

const COUNT_PAGE_SIZE = 100;

export function useInterestCount(): number {
  const location = useUsedStore((s) => s.location);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: [...productKeys.bookmarks(location), "total"],
    queryFn: async () => {
      const cached = queryClient.getQueryData<
        InfiniteData<BookmarkedProductListDataDto, number | undefined>
      >(productKeys.bookmarks(location));
      if (cached && !cached.pages.at(-1)?.page.hasNext) {
        return cached.pages.reduce((sum, page) => sum + page.products.length, 0);
      }

      let total = 0;
      let cursor: number | undefined;
      for (;;) {
        const page = await getBookmarkedProducts({
          size: COUNT_PAGE_SIZE,
          cursor,
          latitude: location?.lat,
          longitude: location?.lng,
        });
        total += page.products.length;
        if (!page.page.hasNext) break;
        cursor = page.page.nextCursor ?? undefined;
      }
      return total;
    },
  });
  return data ?? 0;
}
