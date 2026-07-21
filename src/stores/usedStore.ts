import { create } from "zustand";
import type { ChatMessage, Product, SaleStatus } from "../types/used";
import { MOCK_PRODUCTS } from "../mocks/used/mockProducts";
import { MOCK_MESSAGES } from "../mocks/used/mockChat";

type NewProduct = Omit<Product, "id" | "likes" | "liked">;

interface UsedState {
  products: Product[];
  toggleLike: (id: number) => void;
  addProduct: (product: NewProduct) => number;
  updateProductStatus: (id: number, status: SaleStatus) => void;
  removeProduct: (id: number) => void;

  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;

  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  locationGranted: boolean;
  setLocationGranted: (value: boolean) => void;

  messagesByProduct: Record<number, ChatMessage[]>;
  sendMessage: (productId: number, text: string) => void;
}

function nowLabel(): string {
  const d = new Date();
  const h = d.getHours();
  const meridiem = h < 12 ? "오전" : "오후";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  const minute = String(d.getMinutes()).padStart(2, "0");
  return `${meridiem} ${hour12}:${minute}`;
}

export const useUsedStore = create<UsedState>((set) => ({
  products: MOCK_PRODUCTS,

  toggleLike: (id) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    })),

  addProduct: (product) => {
    let id = 0;
    set((state) => {
      id = Math.max(0, ...state.products.map((p) => p.id)) + 1;
      return {
        products: [
          { ...product, id, likes: 0, liked: false },
          ...state.products,
        ],
      };
    });
    return id;
  },

  updateProductStatus: (id, status) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, status } : p,
      ),
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  recentSearches: ["카페 패키지", "업소용 제빙기"],

  addRecentSearch: (keyword) =>
    set((state) => {
      const kw = keyword.trim();
      if (!kw) return state;
      return {
        recentSearches: [
          kw,
          ...state.recentSearches.filter((k) => k !== kw),
        ].slice(0, 10),
      };
    }),

  removeRecentSearch: (keyword) =>
    set((state) => ({
      recentSearches: state.recentSearches.filter((k) => k !== keyword),
    })),

  authenticated: false,
  setAuthenticated: (value) => set({ authenticated: value }),

  locationGranted: false,
  setLocationGranted: (value) => set({ locationGranted: value }),

  messagesByProduct: MOCK_MESSAGES,

  sendMessage: (productId, text) =>
    set((state) => {
      const list = state.messagesByProduct[productId] ?? [];
      const message: ChatMessage = {
        id: (list.at(-1)?.id ?? 0) + 1,
        mine: true,
        text,
        time: nowLabel(),
        sentAt: new Date().toISOString(),
        read: false,
      };
      return {
        messagesByProduct: {
          ...state.messagesByProduct,
          [productId]: [...list, message],
        },
      };
    }),
}));
