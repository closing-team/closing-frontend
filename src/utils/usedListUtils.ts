import type { Product, UsedFilter } from "../types/used";

const NEARBY_DISTANCE_M = 3000;

export function applyFilter(
  products: Product[],
  filter: UsedFilter,
): Product[] {
  switch (filter) {
    case "nearby":
      return products.filter((p) => p.distanceM <= NEARBY_DISTANCE_M);
    case "parcel":
      return products.filter((p) => p.dealTypes.includes("택배거래"));
    case "direct":
      return products.filter((p) => p.dealTypes.includes("직거래"));
    default:
      return products;
  }
}

export function searchProducts(
  products: Product[],
  keyword: string,
): Product[] {
  const kw = keyword.trim().toLowerCase();
  if (!kw) return products;
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(kw) ||
      p.industry?.toLowerCase().includes(kw) ||
      p.itemCategory?.toLowerCase().includes(kw),
  );
}
