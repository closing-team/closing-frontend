import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ChatMessage } from "../types/used";
import { MOCK_MESSAGES } from "../mocks/used/mockUsedMessages";

export interface GeoLocation {
  lat: number;
  lng: number;
}

interface UsedState {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;

  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  locationGranted: boolean;
  setLocationGranted: (value: boolean) => void;
  location: GeoLocation | null;
  setLocation: (location: GeoLocation) => void;

  locationPromptAnswered: boolean;
  setLocationPromptAnswered: (value: boolean) => void;

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

export const useUsedStore = create<UsedState>()(
  persist(
    (set) => ({
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

      authenticated: true,
      setAuthenticated: (value) => set({ authenticated: value }),

      locationGranted: false,
      setLocationGranted: (value) => set({ locationGranted: value }),
      location: null,
      setLocation: (location) =>
        set({ locationGranted: true, locationPromptAnswered: true, location }),

      locationPromptAnswered: false,
      setLocationPromptAnswered: (value) =>
        set({ locationPromptAnswered: value }),

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
    }),
    {
      name: "used-store",
      partialize: (state) => ({
        locationGranted: state.locationGranted,
        locationPromptAnswered: state.locationPromptAnswered,
        location: state.location,
        recentSearches: state.recentSearches,
      }),
    },
  ),
);
