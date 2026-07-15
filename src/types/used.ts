
export type DealType = "직거래" | "택배거래";

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  dealTypes: DealType[];
  distanceM: number;
  neighborhood: string;
  timeAgo: string;
  createdAt: string;
  likes: number;
  liked: boolean;
}

export type UsedFilter = "all" | "nearby" | "parcel" | "direct";

export type UsedSort =
  | "popular"
  | "latest"
  | "distance"
  | "priceLow"
  | "priceHigh";
