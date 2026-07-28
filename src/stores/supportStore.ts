import { create } from "zustand";
import type { SupportListItem } from "../types/supportApi";

interface SupportState {
  posts: SupportListItem[];
  flippedIds: Set<number>;
  setPosts: (posts: SupportListItem[]) => void;
  toggleBookmark: (supportId: number) => void;
  isBookmarked: (supportId: number, serverIsBookmarked: boolean) => boolean;
}

export const useSupportStore = create<SupportState>((set, get) => ({
  posts: [],
  flippedIds: new Set(),

  setPosts: (posts) => set({ posts }),

  toggleBookmark: (supportId) =>
    set((state) => {
      const next = new Set(state.flippedIds);
      if (next.has(supportId)) next.delete(supportId);
      else next.add(supportId);
      return { flippedIds: next };
    }),

  isBookmarked: (supportId, serverIsBookmarked) =>
    get().flippedIds.has(supportId) ? !serverIsBookmarked : serverIsBookmarked,
}));
