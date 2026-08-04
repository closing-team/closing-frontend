import { SUPPORT_POSTS } from "./mockSupport";
import type { SupportDetail } from "../../types/supportApi";

export interface BookmarkRecord {
  bookmarkId: number;
  supportId: number;
  createdAt: string;
}

let bookmarks: BookmarkRecord[] = SUPPORT_POSTS.filter(
  (post) => post.isBookmarked,
).map((post, index) => ({
  bookmarkId: index + 1,
  supportId: post.supportId,
  createdAt: new Date(2026, 0, index + 1).toISOString(),
}));
let nextBookmarkId = bookmarks.length + 1;

export function findSupport(supportId: number): SupportDetail | undefined {
  return SUPPORT_POSTS.find((post) => post.supportId === supportId);
}

export function findBookmarkBySupportId(
  supportId: number,
): BookmarkRecord | undefined {
  return bookmarks.find((b) => b.supportId === supportId);
}

export function listBookmarks(): BookmarkRecord[] {
  return bookmarks;
}

export function addBookmark(supportId: number): BookmarkRecord {
  const record: BookmarkRecord = {
    bookmarkId: nextBookmarkId++,
    supportId,
    createdAt: new Date().toISOString(),
  };
  bookmarks = [record, ...bookmarks];
  const post = findSupport(supportId);
  if (post) post.isBookmarked = true;
  return record;
}

export function removeBookmark(supportId: number): boolean {
  const existing = findBookmarkBySupportId(supportId);
  if (!existing) return false;
  bookmarks = bookmarks.filter((b) => b.supportId !== supportId);
  const post = findSupport(supportId);
  if (post) post.isBookmarked = false;
  return true;
}
