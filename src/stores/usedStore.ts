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

  authenticated: boolean;
  setAuthenticated: (value: boolean) => void;

  locationGranted: boolean;
  setLocationGranted: (value: boolean) => void;
  location: GeoLocation | null;
  setLocation: (location: GeoLocation) => void;

  locationPromptAnswered: boolean;
  setLocationPromptAnswered: (value: boolean) => void;
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
