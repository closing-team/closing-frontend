import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductGrid from "../../components/used/ProductGrid";
import InfiniteScrollTrigger from "../../components/common/InfiniteScrollTrigger";
import UsedEmptyView from "../../components/used/UsedEmptyView";
import UsedContentSkeleton from "../../components/used/UsedContentSkeleton";
import LocationPermissionSheet from "../../components/used/LocationPermissionSheet";
import SideMenu from "../../components/sidemenu/SideMenu";
import { MenuHamburgerIcon, PlusMdIcon, SearchIcon } from "../../assets/icons";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import { DEFAULT_NEARBY_LABEL } from "../../constants/location";
import type { UsedFilter, UsedSort } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import { useSupportStore } from "../../stores/supportStore";
import { useLocationGate } from "../../hooks/useLocationGate";
import { useProductListQuery } from "../../hooks/useProducts";
import { useProductLikeToggle } from "../../hooks/useProductLikeToggle";
import { useInterestCount } from "../../hooks/useInterestCount";

export default function UsedListPage() {
  const navigate = useNavigate();

  const authenticated = useUsedStore((s) => s.authenticated);
  const location = useUsedStore((s) => s.location);
  const messagesByProduct = useUsedStore((s) => s.messagesByProduct);
  const {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  } = useLocationGate();

  const [filter, setFilter] = useState<UsedFilter>("all");
  const [sort, setSort] = useState<UsedSort>("popular");
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const interestCount = useInterestCount();
  const chatCount = Object.keys(messagesByProduct).length;
  const bookmarkCount = useSupportStore(
    (s) => s.posts.filter((post) => post.bookmarked).length,
  );

  const {
    products: visibleProducts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductListQuery({
    filter,
    sort,
    location,
  });
  const handleToggleLike = useProductLikeToggle(visibleProducts);

  const handleWrite = () => {
    navigate(authenticated ? ROUTES.USED_WRITE : ROUTES.BUSINESS_AUTH);
  };

  const isEmpty = visibleProducts.length === 0;
  const showSkeleton = isLoading || showLocationModal;

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar
        title="중고거래"
        bordered={false}
        right={
          <>
            <button
              type="button"
              aria-label="검색"
              onClick={() => navigate(ROUTES.USED_SEARCH)}
              className="p-1 text-gray-900"
            >
              <SearchIcon />
            </button>
            <button
              type="button"
              aria-label="메뉴"
              className="p-1 text-gray-900"
              onClick={() => setIsSideMenuOpen(true)}
            >
              <MenuHamburgerIcon />
            </button>
          </>
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

      {!showSkeleton ? (
        <>
          <FilterTabs
            value={filter}
            onChange={setFilter}
            nearbyLabel={DEFAULT_NEARBY_LABEL}
            showNearby={locationGranted}
          />

          <div className="flex flex-col gap-4 px-4 py-3">
            <div className="flex justify-end">
              <SortDropdown
                value={sort}
                onChange={setSort}
                showDistance={locationGranted}
              />
            </div>

            {isEmpty ? (
              <UsedEmptyView onWrite={handleWrite} />
            ) : (
              <>
                <ProductGrid
                  products={visibleProducts}
                  onProductClick={(id) => navigate(usedDetailPath(id))}
                  onToggleLike={handleToggleLike}
                />
                <InfiniteScrollTrigger
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  onLoadMore={fetchNextPage}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <UsedContentSkeleton />
      )}

      <Fab
        variant="used"
        icon={<PlusMdIcon className="h-6 w-6 text-white" />}
        ariaLabel="글쓰기"
        onClick={handleWrite}
      />

      <NavigationBar />

      {showLocationModal && (
        <LocationPermissionSheet
          onAllow={handleAllow}
          onDeny={handleDeny}
          error={locationError}
        />
      )}
    </div>
  );
}
