import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../../components/layout/BottomTabBar';
import FilterTabs from '../../components/used/FilterTabs';
import SortDropdown from '../../components/used/SortDropdown';
import ProductCard from '../../components/used/ProductCard';
import BusinessAuthModal from '../../components/used/BusinessAuthModal';
import UsedEmptyView from '../../components/used/UsedEmptyView';
import SearchIcon from '../../assets/icons/search-md.svg?react';
import { ROUTES } from '../../constants/routes';
import type { UsedFilter, UsedSort, Product } from '../../types/used';
import { MOCK_PRODUCTS } from './mockProducts';

// 위치 권한 미허용 시 필터 탭에 표시할 기본 라벨
const DEFAULT_NEARBY_LABEL = '원홍동 근처';

function applyFilter(products: Product[], filter: UsedFilter): Product[] {
  switch (filter) {
    case 'nearby':
      // TODO: (MKT001) 실제 위치 기반 반경 필터 연동 — 임시로 3km 이내
      return products.filter((p) => p.distanceM <= 3000);
    case 'parcel':
      return products.filter((p) => p.dealTypes.includes('택배거래'));
    case 'direct':
      return products.filter((p) => p.dealTypes.includes('직거래'));
    default:
      return products;
  }
}

function applySort(products: Product[], sort: UsedSort): Product[] {
  const sorted = [...products];
  switch (sort) {
    case 'latest':
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case 'distance':
      return sorted.sort((a, b) => a.distanceM - b.distanceM);
    case 'priceLow':
      return sorted.sort((a, b) => a.price - b.price);
    case 'priceHigh':
      return sorted.sort((a, b) => b.price - a.price);
    case 'popular':
    default:
      return sorted.sort((a, b) => b.likes - a.likes);
  }
}

export default function UsedListPage() {
  // TODO: (MKT001) API 연동 시 여기서 상품 목록을 fetch
  //   - 로드 실패 시 토스트 + 재시도 버튼 제공
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filter, setFilter] = useState<UsedFilter>('all');
  const [sort, setSort] = useState<UsedSort>('popular');
  const [locationGranted, setLocationGranted] = useState(false);

  // 사업자 인증 상태 — TODO: (MKT001) 실제 인증 여부로 대체
  const [authenticated, setAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalShown, setAuthModalShown] = useState(false); // 1회 노출 가드

  const navigate = useNavigate();

  // 탭 진입 시 위치 권한 요청 — 허용 시 거리순 정렬 활성화
  const requestLocation = () => {
    if (!('geolocation' in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      () => setLocationGranted(true),
      () => setLocationGranted(false),
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const visibleProducts = useMemo(
    () => applySort(applyFilter(products, filter), sort),
    [products, filter, sort],
  );

  const toggleLike = (id: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) } : p,
      ),
    );
  };

  // 글쓰기 진입 — 인증 완료 시 MKT003, 미인증 시 사업자 인증 모달(1회) 노출
  const handleWrite = () => {
    if (authenticated) {
      navigate(ROUTES.USED_WRITE);
      return;
    }
    if (!authModalShown) {
      setShowAuthModal(true);
      setAuthModalShown(true);
    }
  };

  const handleVerify = () => {
    setAuthenticated(true);
    setShowAuthModal(false);
    navigate(ROUTES.USED_WRITE);
  };

  const isEmpty = visibleProducts.length === 0;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 pb-2 pt-6">
        <h1 className="text-xl font-bold text-gray-900">중고거래</h1>
        <div className="flex items-center gap-3">
          {/* 검색 — 추후 개발 */}
          <button
            type="button"
            aria-label="검색"
            onClick={() => {
              // TODO: (MKT001) 검색 화면 연동 — 추후 개발
            }}
            className="p-1"
          >
            <SearchIcon width={24} height={24} className="text-gray-900" />
          </button>
        </div>
      </header>

      {/* 필터 탭 */}
      <FilterTabs
        value={filter}
        onChange={setFilter}
        nearbyLabel={DEFAULT_NEARBY_LABEL}
      />

      {/* 정렬 드롭다운 */}
      <div className="flex justify-end px-4 pb-3 pt-1">
        <SortDropdown
          value={sort}
          onChange={setSort}
          distanceEnabled={locationGranted}
          onDistanceRequest={requestLocation}
        />
      </div>

      {/* 상품 목록 or 엠티 뷰 */}
      {isEmpty ? (
        <UsedEmptyView onWrite={handleWrite} />
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 px-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={(id) => navigate(`/used/${id}`)}
              onToggleLike={toggleLike}
            />
          ))}
        </div>
      )}

      {/* FAB — 글쓰기 진입 */}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-40 mx-auto flex w-full max-w-app justify-end px-4">
        <button
          type="button"
          aria-label="글쓰기"
          onClick={handleWrite}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-90"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M12 6V18M18 12H6" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* 사업자 인증 모달 */}
      {showAuthModal && (
        <BusinessAuthModal onClose={() => setShowAuthModal(false)} onVerify={handleVerify} />
      )}

      <BottomTabBar />
    </div>
  );
}
