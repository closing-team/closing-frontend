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

export interface SupportDetail extends SupportListItem {
  // TODO: 백엔드 상세 섹션 구조 확정 전까지 기존 목업 필드 그대로 유지
  overview: string;
  target: string;
  applicationHeading: string;
  applicationMethods: string[];
  contactHeading: string;
  contactLines: string[];
  applyUrlLabel: string;

  // 명세 확정 필드
  // TODO: 백엔드가 구조화된 섹션 필드를 안 주면 이 content를 파싱해서 렌더링하는 걸로 전환 예정
  content: string;
  externalUrl: string;
}

export interface SupportListDataDto {
  supports: SupportListItem[];
  page: PageInfoDto<string>;
}

export interface GetSupportsParams {
  sort?: SupportSortCode;
  cursor?: string;
  size?: number;
}

export interface BookmarkRequestJson {
  supportId: number;
}

export interface BookmarkResponseData {
  bookmarkId: number;
  supportId: number;
  createdAt: string;
}

export interface BookmarkListDataDto {
  bookmarks: SupportListItem[];
  page: PageInfoDto<string>;
}

export interface GetBookmarksParams {
  sort?: SupportSortCode;
  cursor?: string;
  size?: number;
}
