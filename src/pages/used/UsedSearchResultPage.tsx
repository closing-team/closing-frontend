import { useCallback, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import SearchBar from "../../components/used/SearchBar";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductGrid from "../../components/used/ProductGrid";
import InfiniteScrollTrigger from "../../components/common/InfiniteScrollTrigger";
import SearchEmptyView from "../../components/used/SearchEmptyView";
import LocationPermissionSheet from "../../components/used/LocationPermissionSheet";
import NavigationBar from "../../components/common/NavigationBar";
import Fab from "../../components/common/Fab";
import SideMenu from "../../components/sidemenu/SideMenu";
import { MenuHamburgerIcon, PlusMdIcon, SearchIcon } from "../../assets/icons";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import type { UsedFilter, UsedSort } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import { useLocationGate } from "../../hooks/useLocationGate";
import { useProductListQuery } from "../../hooks/useProducts";
import { useProductLikeToggle } from "../../hooks/useProductLikeToggle";
import { useCommitSearch } from "../../hooks/useCommitSearch";
import { useNearbyLabel } from "../../hooks/useNearbyLabel";
import { useSideMenuCounts } from "../../hooks/useSideMenuCounts";

export default function UsedSearchResultPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const businessCategory = searchParams.get("businessCategory") ?? undefined;
  const productCategory = searchParams.get("productCategory") ?? undefined;
  const categoryLabel = searchParams.get("label");
  const isCategoryMode = Boolean(businessCategory || productCategory);
  const displayQuery = query || categoryLabel || "";

  const authenticated = useUsedStore((s) => s.authenticated);
  const location = useUsedStore((s) => s.location);
  const commitSearch = useCommitSearch();
  const nearbyLabel = useNearbyLabel(location);
  const { bookmarkCount, interestCount, chatCount } = useSideMenuCounts();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  } = useLocationGate();

  const [keyword, setKeyword] = useState(displayQuery);
  const [filter, setFilter] = useState<UsedFilter>("all");
  const [sort, setSort] = useState<UsedSort>("popular");

  const {
    products: results,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductListQuery({
    keyword: query || undefined,
    businessCategory,
    productCategory,
    filter,
    sort,
    location,
  });
  const handleToggleLike = useProductLikeToggle(results);
  const handleProductClick = useCallback(
    (id: number) => navigate(usedDetailPath(id)),
    [navigate],
  );

  const runSearch = () => {
    const q = commitSearch(keyword);
    if (q) setSearchParams({ q });
  };

  const handleWrite = () => {
    navigate(authenticated ? ROUTES.USED_WRITE : ROUTES.BUSINESS_AUTH);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {isCategoryMode ? (
        <>
          <TopBar
            onBack={() => navigate(-1)}
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
          <h1 className="flex items-center gap-2.5 self-stretch px-4 py-2 text-title-2 text-gray-900">
            {categoryLabel}
          </h1>

          <SideMenu
            open={isSideMenuOpen}
            onClose={() => setIsSideMenuOpen(false)}
            verified={authenticated}
            bookmarkCount={bookmarkCount}
            interestCount={interestCount}
            chatCount={chatCount}
          />
        </>
      ) : (
        <SearchBar
          value={keyword}
          onChange={setKeyword}
          onBack={() => navigate(ROUTES.USED)}
          onSearch={runSearch}
        />
      )}

      <FilterTabs
        value={filter}
        onChange={setFilter}
        nearbyLabel={nearbyLabel}
        showNearby={locationGranted}
      />

      <div className="flex flex-col gap-4 px-4 py-3">
        <div
          className={
            isCategoryMode
              ? "flex justify-end"
              : "flex items-center justify-between"
          }
        >
          {!isCategoryMode && (
            <p className="text-body-2 text-gray-700">검색결과 {results.length}개</p>
          )}
          <SortDropdown
            value={sort}
            onChange={setSort}
            showDistance={locationGranted}
          />
        </div>

        {results.length === 0 ? (
          <SearchEmptyView query={displayQuery} />
        ) : (
          <>
            <ProductGrid
              products={results}
              onProductClick={handleProductClick}
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

      {isCategoryMode && (
        <Fab
          variant="used"
          icon={<PlusMdIcon className="h-6 w-6 text-white" />}
          ariaLabel="글쓰기"
          onClick={handleWrite}
        />
      )}

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
