import { api } from "./axios";
import type { ApiEnvelope } from "../types/api";
import type {
  BookmarkListDataDto,
  SupportBookmarkResponseData,
  GetBookmarksParams,
  GetSupportsParams,
  SupportDetail,
  SupportListDataDto,
} from "../types/supportApi";

export async function getSupports(
  params: GetSupportsParams,
): Promise<SupportListDataDto> {
  const res = await api.get<ApiEnvelope<SupportListDataDto>>("/api/v1/supports", {
    params,
  });
  return res.data.data;
}

export async function getSupportDetail(
  supportId: number,
): Promise<SupportDetail> {
  const res = await api.get<ApiEnvelope<SupportDetail>>(
    `/api/v1/supports/${supportId}`,
  );
  return res.data.data;
}

export async function addBookmark(
  supportId: number,
): Promise<SupportBookmarkResponseData> {
  const res = await api.post<ApiEnvelope<SupportBookmarkResponseData>>(
    "/api/v1/bookmarks",
    { supportId },
  );
  return res.data.data;
}

export async function removeBookmark(supportId: number): Promise<void> {
  await api.delete<ApiEnvelope<null>>(`/api/v1/bookmarks/${supportId}`);
}

export async function getBookmarks(
  params: GetBookmarksParams,
): Promise<BookmarkListDataDto> {
  const res = await api.get<ApiEnvelope<BookmarkListDataDto>>(
    "/api/v1/bookmarks",
    { params },
  );
  return res.data.data;
}
