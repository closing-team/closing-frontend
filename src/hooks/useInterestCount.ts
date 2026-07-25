import { useQuery } from "@tanstack/react-query";
import { useUsedStore } from "../stores/usedStore";
import { getBookmarkedProducts } from "../api/used";
import { productKeys } from "./useProducts";

const COUNT_PAGE_SIZE = 100;

export function useInterestCount(): number {
  const location = useUsedStore((s) => s.location);
  const { data } = useQuery({
    queryKey: [...productKeys.bookmarks(location), "total"],
    queryFn: async () => {
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
