import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Tabs from "../../components/common/Tabs";
import Dropdown from "../../components/common/Dropdown";
import SupportCard from "../../components/support/SupportCard";
import EmptyView from "../../components/common/EmptyView";
import SideMenu from "../../components/sidemenu/SideMenu";
import {
  MenuHamburgerIcon,
  FileSearchIcon,
  BookmarkEmptyIcon,
} from "../../assets/icons";
import { useUsedStore } from "../../stores/usedStore";
import { useSupportStore } from "../../stores/supportStore";
import { useSupportListQuery } from "../../hooks/useSupports";
import { useSideMenuCounts } from "../../hooks/useSideMenuCounts";
import { ROUTES } from "../../constants/routes";
import type { SupportListItem, SupportSortCode } from "../../types/supportApi";

type SupportTab = "notice" | "bookmark";
type SortOption = "popular" | "registered" | "deadline";

const SORT_TO_CODE: Record<SortOption, SupportSortCode> = {
  popular: "POPULAR",
  registered: "LATEST",
  deadline: "DEADLINE",
};

const TABS: { key: SupportTab; label: string }[] = [
  { key: "notice", label: "공고" },
  { key: "bookmark", label: "북마크" },
];

const SECTION_TITLE: Record<SupportTab, string> = {
  notice: "폐업지원 공고",
  bookmark: "나의 관심 공고",
};

const EMPTY_STATE: Record<SupportTab, { title: string; description: string }> = {
  notice: {
    title: "현재 진행 중인 폐업지원 공고가 없어요",
    description: "새로운 공고가 등록되면 이곳에서 확인할 수 있어요.",
  },
  bookmark: {
    title: "아직 저장한 공고가 없어요",
    description: "관심 있는 공고를 저장하면 이곳에서 모아볼 수 있어요.",
  },
};

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "registered", label: "등록일순" },
  { key: "deadline", label: "마감일순" },
];

function sortPosts(
  posts: SupportListItem[],
  sort: SortOption,
): SupportListItem[] {
  if (sort === "popular") {
    return posts;
  }

  if (sort === "registered") {
    return [...posts].sort((a, b) =>
      b.applyStartDate.localeCompare(a.applyStartDate),
    );
  }

  return [...posts].sort((a, b) => {
    if (a.applyEndDate === null && b.applyEndDate === null) return 0;
    if (a.applyEndDate === null) return 1;
    if (b.applyEndDate === null) return -1;
    return a.applyEndDate.localeCompare(b.applyEndDate);
  });
}

export default function SupportListPage() {
  const location = useLocation();
  const isBookmarkEntry = location.pathname === ROUTES.SUPPORT_BOOKMARK;

  const [activeTab, setActiveTab] = useState<SupportTab>(
    isBookmarkEntry ? "bookmark" : "notice",
  );
  const [sort, setSort] = useState<SortOption>("popular");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const authenticated = useUsedStore((s) => s.authenticated);
  const { bookmarkCount, interestCount, chatCount } = useSideMenuCounts();

  useSupportListQuery(SORT_TO_CODE[sort]);
  const posts = useSupportStore((s) => s.posts);
  const flippedIds = useSupportStore((s) => s.flippedIds);
  const toggleBookmark = useSupportStore((s) => s.toggleBookmark);

  const visiblePosts = useMemo(() => {
    const withBookmarkState = posts.map((post) => ({
      ...post,
      isBookmarked: flippedIds.has(post.supportId)
        ? !post.isBookmarked
        : post.isBookmarked,
    }));
    const filtered =
      activeTab === "bookmark"
        ? withBookmarkState.filter((post) => post.isBookmarked)
        : withBookmarkState;
    return sortPosts(filtered, sort);
  }, [posts, flippedIds, activeTab, sort]);

  return (
    <div className="min-h-screen bg-gray-30 pb-20">
      <TopBar
        logo
        bordered={false}
        right={
          <button
            type="button"
            aria-label="전체 메뉴"
            className="p-1 text-gray-900"
            onClick={() => setIsSideMenuOpen(true)}
          >
            <MenuHamburgerIcon />
          </button>
        }
      />

      <SideMenu
        open={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        verified={authenticated}
        bookmarkCount={bookmarkCount}
        interestCount={interestCount}
        chatCount={chatCount}
      />

      <Tabs
        tabs={TABS}
        value={activeTab}
        // TODO: 탭 클릭 시 URL(/support ↔ /support/bookmark)도 함께 바꿀지 여부는
        // 아직 정해지지 않음 — 사용자와 상의 후 결정
        onChange={(key) => setActiveTab(key as SupportTab)}
      />

      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <h2 className="text-title-3 text-gray-900">
          {SECTION_TITLE[activeTab]}
        </h2>
        <Dropdown
          options={SORT_OPTIONS}
          value={sort}
          onChange={(key) => setSort(key as SortOption)}
        />
      </div>

      {/* 공고 목록 */}
      {visiblePosts.length === 0 ? (
        <EmptyView
          icon={
            <div className="flex h-[53px] w-[53px] items-center justify-center rounded-full bg-gray-100">
              {activeTab === "bookmark" ? (
                <BookmarkEmptyIcon className="h-8 w-8 text-gray-200" />
              ) : (
                <FileSearchIcon className="h-8 w-8 text-gray-200" />
              )}
            </div>
          }
          title={EMPTY_STATE[activeTab].title}
          description={EMPTY_STATE[activeTab].description}
          actionLabel={activeTab === "bookmark" ? "공고 보러가기" : undefined}
          onAction={
            activeTab === "bookmark"
              ? () => setActiveTab("notice")
              : undefined
          }
        />
      ) : (
        <div className="flex flex-col gap-3 px-4">
          {visiblePosts.map((post) => (
            <SupportCard
              key={post.supportId}
              post={post}
              onToggleBookmark={toggleBookmark}
            />
          ))}
        </div>
      )}

      <NavigationBar />
    </div>
  );
}
