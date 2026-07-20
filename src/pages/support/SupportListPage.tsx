import { useMemo, useState } from "react";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Tabs from "../../components/common/Tabs";
import Dropdown from "../../components/common/Dropdown";
import SupportCard from "../../components/support/SupportCard";
import type { SupportPost } from "../../components/support/SupportCard";
import { MenuHamburgerIcon } from "../../assets/icons";

const INITIAL_SUPPORT_POSTS: SupportPost[] = [
  {
    id: 1,
    organization: "중소벤처기업부",
    title: "2026년 희망리턴패키지 원스톱폐업지원 소상공인 모집",
    period: "2026.01.01 - 2026.03.05",
    startDate: "2026-01-01",
    endDate: "2026-03-05",
    bookmarked: true,
  },
  {
    id: 2,
    organization: "서울특별시",
    title: "[서울] 2026년 새 길 여는 폐업지원 사업 모집 공고",
    period: "2026.03.03 - 예산 소진시까지",
    startDate: "2026-03-03",
    endDate: null,
    bookmarked: true,
  },
  {
    id: 3,
    organization: "전북특별자치도",
    title: "[전북] 2026년 폐업 소상공인 사업정리 지원사업 공고",
    period: "2026.03.05 - 예산 소진시까지",
    startDate: "2026-03-05",
    endDate: null,
    bookmarked: false,
  },
  {
    id: 4,
    organization: "전북특별자치도",
    title: "[전북] 2026년 새출발 재기지원 모집 공고",
    period: "2026.03.26 - 예산 소진시까지",
    startDate: "2026-03-26",
    endDate: null,
    bookmarked: false,
  },
];

type SupportTab = "notice" | "bookmark";
type SortOption = "popular" | "registered" | "deadline";

const TABS: { key: SupportTab; label: string }[] = [
  { key: "notice", label: "공고" },
  { key: "bookmark", label: "북마크" },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: "popular", label: "인기순" },
  { key: "registered", label: "등록일순" },
  { key: "deadline", label: "마감일순" },
];

function sortPosts(posts: SupportPost[], sort: SortOption): SupportPost[] {
  if (sort === "popular") {
    return posts;
  }

  if (sort === "registered") {
    return [...posts].sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  return [...posts].sort((a, b) => {
    if (a.endDate === null && b.endDate === null) return 0;
    if (a.endDate === null) return 1;
    if (b.endDate === null) return -1;
    return a.endDate.localeCompare(b.endDate);
  });
}

export default function SupportListPage() {
  const [posts, setPosts] = useState<SupportPost[]>(INITIAL_SUPPORT_POSTS);
  const [activeTab, setActiveTab] = useState<SupportTab>("notice");
  const [sort, setSort] = useState<SortOption>("popular");

  const visiblePosts = useMemo(() => {
    const filtered =
      activeTab === "bookmark"
        ? posts.filter((post) => post.bookmarked)
        : posts;
    return sortPosts(filtered, sort);
  }, [posts, activeTab, sort]);

  const toggleBookmark = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, bookmarked: !post.bookmarked } : post,
      ),
    );
  };

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
          >
            <MenuHamburgerIcon />
          </button>
        }
      />

      <Tabs
        tabs={TABS}
        value={activeTab}
        onChange={(key) => setActiveTab(key as SupportTab)}
      />

      <div className="flex items-center justify-between px-4 pb-3 pt-5">
        <h2 className="text-title-3 text-gray-900">폐업지원 공고</h2>
        <Dropdown
          options={SORT_OPTIONS}
          value={sort}
          onChange={(key) => setSort(key as SortOption)}
        />
      </div>

      {/* 공고 목록 */}
      <div className="flex flex-col gap-3 px-4">
        {visiblePosts.map((post) => (
          <SupportCard
            key={post.id}
            post={post}
            onToggleBookmark={toggleBookmark}
          />
        ))}
      </div>

      <NavigationBar />
    </div>
  );
}
