import { create } from "zustand";
import type { SupportListItem } from "../types/supportApi";

interface SupportState {
  posts: SupportListItem[];
  setPosts: (posts: SupportListItem[]) => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  posts: [],

  setPosts: (posts) => set({ posts }),
}));
