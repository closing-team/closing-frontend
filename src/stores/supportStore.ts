import { create } from "zustand";
import type { SupportPostDetail } from "../mocks/support/mockSupport";
import { SUPPORT_POSTS } from "../mocks/support/mockSupport";

interface SupportState {
  posts: SupportPostDetail[];
  toggleBookmark: (id: number) => void;
}

export const useSupportStore = create<SupportState>((set) => ({
  posts: SUPPORT_POSTS,

  toggleBookmark: (id) =>
    set((state) => ({
      posts: state.posts.map((post) =>
        post.id === id ? { ...post, bookmarked: !post.bookmarked } : post,
      ),
    })),
}));
