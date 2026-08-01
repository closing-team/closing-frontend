import { useCallback } from "react";
import { useAddBookmarkMutation, useRemoveBookmarkMutation } from "./useSupportMutations";
import { getBookmarkErrorMessage } from "../utils/supportAdapter";
import type { SupportListItem } from "../types/supportApi";

export function useSupportBookmarkToggle(
  posts: SupportListItem[],
  onError?: (message: string) => void,
) {
  const addBookmark = useAddBookmarkMutation();
  const removeBookmark = useRemoveBookmarkMutation();

  return useCallback(
    (supportId: number) => {
      const post = posts.find((p) => p.supportId === supportId);
      if (!post) return;
      const mutation = post.isBookmarked ? removeBookmark : addBookmark;
      mutation.mutate(supportId, {
        onError: (error) => onError?.(getBookmarkErrorMessage(error)),
      });
    },
    [posts, addBookmark, removeBookmark, onError],
  );
}
