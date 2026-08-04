import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryKey } from "@tanstack/react-query";
import { addBookmark, removeBookmark } from "../api/support";
import { supportKeys } from "./useSupportQueries";

function useInvalidateSupportQueries() {
  const queryClient = useQueryClient();
  return (keys: QueryKey[]) =>
    Promise.all(keys.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
}

export function useAddBookmarkMutation() {
  const invalidate = useInvalidateSupportQueries();

  return useMutation({
    mutationFn: (supportId: number) => addBookmark(supportId),
    onSuccess: (_data, supportId) =>
      invalidate([
        supportKeys.lists(),
        supportKeys.bookmarksAll(),
        supportKeys.detail(supportId),
      ]),
  });
}

export function useRemoveBookmarkMutation() {
  const invalidate = useInvalidateSupportQueries();

  return useMutation({
    mutationFn: (supportId: number) => removeBookmark(supportId),
    onSuccess: (_data, supportId) =>
      invalidate([
        supportKeys.lists(),
        supportKeys.bookmarksAll(),
        supportKeys.detail(supportId),
      ]),
  });
}
