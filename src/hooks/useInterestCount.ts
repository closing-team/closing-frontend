import { useUsedStore } from "../stores/usedStore";
import { useBookmarkedProductsQuery } from "./useProducts";

export function useInterestCount(): number {
  const location = useUsedStore((s) => s.location);
  const { products } = useBookmarkedProductsQuery(location);
  return products.length;
}
