import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GeoLocation {
  lat: number;
  lng: number;
}

interface UsedState {
  recentSearches: string[];
  addRecentSearch: (keyword: string) => void;
  removeRecentSearch: (keyword: string) => void;

  locationGranted: boolean;
  setLocationGranted: (value: boolean) => void;
  location: GeoLocation | null;
  locationUpdatedAt: number | null;
  setLocation: (location: GeoLocation) => void;

  locationPromptAnswered: boolean;
  setLocationPromptAnswered: (value: boolean) => void;
}

interface PersistedUsedState {
  locationGranted: boolean;
  locationPromptAnswered: boolean;
  location: GeoLocation | null;
  locationUpdatedAt: number | null;
  recentSearches: string[];
}

export const useUsedStore = create<UsedState>()(
  persist(
    (set) => ({
      recentSearches: [],

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

      locationGranted: false,
      setLocationGranted: (value) => set({ locationGranted: value }),
      location: null,
      locationUpdatedAt: null,
      setLocation: (location) =>
        set({
          locationGranted: true,
          locationPromptAnswered: true,
          location,
          locationUpdatedAt: Date.now(),
        }),

      locationPromptAnswered: false,
      setLocationPromptAnswered: (value) =>
        set({ locationPromptAnswered: value }),
    }),
    {
      name: "used-store",
      // v1: 목업 시드값("카페 패키지", "업소용 제빙기")이 남아있는 브라우저를 위한 초기화 마이그레이션
      version: 1,
      migrate: (persistedState, version) => {
        const state = persistedState as PersistedUsedState;
        if (version < 1) {
          return { ...state, recentSearches: [] };
        }
        return state;
      },
      partialize: (state) => ({
        locationGranted: state.locationGranted,
        locationPromptAnswered: state.locationPromptAnswered,
        location: state.location,
        locationUpdatedAt: state.locationUpdatedAt,
        recentSearches: state.recentSearches,
      }),
    },
  ),
);
