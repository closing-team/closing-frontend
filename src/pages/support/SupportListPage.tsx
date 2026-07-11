import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../../components/layout/BottomTabBar';
import BookmarkIcon from '../../assets/icons/bookmark.svg?react';
import menuIcon from '../../assets/icons/menu-01.svg';
import chevronDownIcon from '../../assets/icons/chevron-down.svg';

interface SupportPost {
  id: number;
  organization: string;
  title: string;
  period: string;
  startDate: string;
  endDate: string | null;
  bookmarked: boolean;
}

const INITIAL_SUPPORT_POSTS: SupportPost[] = [
  {
    id: 1,
    organization: '중소벤처기업부',
    title: '2026년 희망리턴패키지 원스톱폐업지원 소상공인 모집',
    period: '2026.01.01 - 2026.03.05',
    startDate: '2026-01-01',
    endDate: '2026-03-05',
    bookmarked: true,
  },
  {
    id: 2,
    organization: '서울특별시',
    title: '[서울] 2026년 새 길 여는 폐업지원 사업 모집 공고',
    period: '2026.03.03 - 예산 소진시까지',
    startDate: '2026-03-03',
    endDate: null,
    bookmarked: true,
  },
  {
    id: 3,
    organization: '전북특별자치도',
    title: '[전북] 2026년 폐업 소상공인 사업정리 지원사업 공고',
    period: '2026.03.05 - 예산 소진시까지',
    startDate: '2026-03-05',
    endDate: null,
    bookmarked: false,
  },
  {
    id: 4,
    organization: '전북특별자치도',
    title: '[전북] 2026년 새출발 재기지원 모집 공고',
    period: '2026.03.26 - 예산 소진시까지',
    startDate: '2026-03-26',
    endDate: null,
    bookmarked: false,
  },
];

type SupportTab = 'notice' | 'bookmark';
type SortOption = 'popular' | 'registered' | 'deadline';

const TABS: { key: SupportTab; label: string }[] = [
  { key: 'notice', label: '공고' },
  { key: 'bookmark', label: '북마크' },
];

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'popular', label: '인기순' },
  { key: 'registered', label: '등록일순' },
  { key: 'deadline', label: '마감일순' },
];

function sortPosts(posts: SupportPost[], sort: SortOption): SupportPost[] {
  if (sort === 'popular') {
    // TODO: (SUP001) 실제 인기 지표(조회수 등) 연동 전까지는 등록 순서를 그대로 사용
    return posts;
  }

  if (sort === 'registered') {
    return [...posts].sort((a, b) => b.startDate.localeCompare(a.startDate));
  }

  return [...posts].sort((a, b) => {
    if (a.endDate === null && b.endDate === null) return 0;
    if (a.endDate === null) return 1;
    if (b.endDate === null) return -1;
    return a.endDate.localeCompare(b.endDate);
  });
}

function SupportCard({
  post,
  onToggleBookmark,
}: {
  post: SupportPost;
  onToggleBookmark: (id: number) => void;
}) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/support/${post.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/support/${post.id}`);
      }}
      className="flex flex-col gap-2 rounded-2xl bg-white px-4 py-4 shadow-sm active:opacity-75"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-gray-400">{post.organization}</p>
        <button
          type="button"
          aria-label={post.bookmarked ? '북마크 해제' : '북마크 추가'}
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(post.id);
          }}
          className="shrink-0 p-0.5"
        >
          <BookmarkIcon
            className={
              post.bookmarked
                ? 'h-6 w-6 fill-[#6558FF] stroke-[#6558FF]'
                : 'h-6 w-6 fill-none stroke-[#D9D9E0]'
            }
          />
        </button>
      </div>
      <p className="text-sm font-bold leading-snug text-gray-900">{post.title}</p>
      <p className="text-xs text-gray-400">
        신청기간 <span className="text-gray-500">{post.period}</span>
      </p>
    </div>
  );
}

export default function SupportListPage() {
  // TODO: (SUP001) API 연동 시 여기서 지원정보 목록을 fetch
  //   - 로드 실패 시 로딩 스피너 → 토스트 메시지 + 재시도 버튼 제공
  //   - 공고가 없을 경우 엠티 뷰 표시
  const [posts, setPosts] = useState<SupportPost[]>(INITIAL_SUPPORT_POSTS);
  const [activeTab, setActiveTab] = useState<SupportTab>('notice');
  const [sort, setSort] = useState<SortOption>('popular');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const visiblePosts = useMemo(() => {
    const filtered =
      activeTab === 'bookmark' ? posts.filter((post) => post.bookmarked) : posts;
    return sortPosts(filtered, sort);
  }, [posts, activeTab, sort]);

  const toggleBookmark = (id: number) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === id ? { ...post, bookmarked: !post.bookmarked } : post)),
    );
  };

  return (
    <div className="min-h-screen bg-[#F8F8F9] pb-20">
      {/* 헤더 */}
      <div className="flex items-center justify-between bg-white px-5 pb-4 pt-6">
        <h1 className="text-xl font-bold text-gray-900">클로징</h1>
        <button
          type="button"
          aria-label="전체 메뉴"
          onClick={() => {
            // TODO: 햄버거 메뉴 열기
          }}
          className="p-1"
        >
          <img src={menuIcon} alt="" className="h-6 w-6" />
        </button>
      </div>

      {/* 탭 스위처 */}
      <div className="flex bg-white">
        {TABS.map(({ key, label }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={`flex-1 border-b-2 py-3 text-sm font-bold transition-colors ${
                active ? 'border-[#6558FF] text-[#6558FF]' : 'border-gray-100 text-gray-400'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* 타이틀 + 정렬 드롭다운 */}
      <div className="relative flex items-center justify-between px-4 pb-3 pt-5">
        <h2 className="text-base font-bold text-gray-900">폐업지원 공고</h2>
        <button
          type="button"
          onClick={() => setIsSortOpen((prev) => !prev)}
          className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600"
        >
          {SORT_OPTIONS.find((option) => option.key === sort)?.label}
          <img src={chevronDownIcon} alt="" className="h-4 w-4" />
        </button>

        {isSortOpen && (
          <>
            <button
              type="button"
              aria-label="정렬 옵션 닫기"
              onClick={() => setIsSortOpen(false)}
              className="fixed inset-0 z-10 cursor-default"
            />
            <div className="absolute right-4 top-full z-20 mt-1 w-28 overflow-hidden rounded-xl bg-white shadow-lg">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => {
                    setSort(option.key);
                    setIsSortOpen(false);
                  }}
                  className={`block w-full px-3 py-2 text-left text-xs font-medium ${
                    option.key === sort ? 'text-[#6558FF]' : 'text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* 공고 목록 */}
      <div className="flex flex-col gap-3 px-4">
        {visiblePosts.map((post) => (
          <SupportCard key={post.id} post={post} onToggleBookmark={toggleBookmark} />
        ))}
      </div>

      <BottomTabBar />
    </div>
  );
}
