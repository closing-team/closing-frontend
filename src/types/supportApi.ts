import type { PageInfoDto } from "./productApi";

export type SupportSortCode = "POPULAR" | "LATEST" | "DEADLINE";

// TODO: ONGOING 외 실제 status enum 값은 명세 확정 후 추가
export type SupportStatus = "ONGOING";

export interface SupportListItem {
  supportId: number;
  organizationName: string;
  title: string;
  applyStartDate: string;
  applyEndDate: string | null;
  applicationPeriod: string;
  status: SupportStatus;
  isBookmarked: boolean;
  viewCount: number;
}

// GET /api/v1/supports/{supportId} — 지원정보 상세 조회 응답
export interface SupportDetail extends SupportListItem {
  content: string;
  externalUrl: string;
}

// GET /api/v1/supports — 지원정보 목록 조회 응답
export interface SupportListDataDto {
  supports: SupportListItem[];
  page: PageInfoDto<string>;
}

export interface GetSupportsParams {
  sort?: SupportSortCode;
  cursor?: string;
  size?: number;
}

// POST /api/v1/bookmarks — 북마크 등록 요청과 응답
export interface BookmarkRequestJson {
  supportId: number;
}

export interface SupportBookmarkResponseData {
  supportId: number;
}

// GET /api/v1/bookmarks — 북마크 목록 조회 응답
export interface BookmarkListDataDto {
  bookmarks: SupportListItem[];
  page: PageInfoDto<string>;
}

export interface GetBookmarksParams {
  sort?: SupportSortCode;
  cursor?: string;
  size?: number;
}
