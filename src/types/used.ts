export type DealType = "직거래" | "택배거래";

export type SaleStatus = "selling" | "completed";

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
  status?: SaleStatus;
  sellerName?: string;
  sellerNeighborhood?: string;
  industry?: string;
  itemCategory?: string;
  description?: string;
  dealLocation?: string;
  images?: string[];
}

export type UsedFilter = "all" | "nearby" | "parcel" | "direct";

export type UsedSort =
  | "popular"
  | "latest"
  | "distance"
  | "priceLow"
  | "priceHigh";

export interface ChatMessage {
  id: number;
  mine: boolean;
  text: string;
  time: string;
}

export interface CategoryGroup {
  title: string;
  items: string[];
}
