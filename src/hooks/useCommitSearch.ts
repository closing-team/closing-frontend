import { useUsedStore } from "../stores/usedStore";

export function useCommitSearch() {
  const addRecentSearch = useUsedStore((s) => s.addRecentSearch);

  return (keyword: string): string | null => {
    const q = keyword.trim();
    if (!q) return null;
    addRecentSearch(q);
    return q;
  };
}
