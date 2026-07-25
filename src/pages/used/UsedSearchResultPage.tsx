import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/used/SearchBar";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductGrid from "../../components/used/ProductGrid";
import InfiniteScrollTrigger from "../../components/common/InfiniteScrollTrigger";
import SearchEmptyView from "../../components/used/SearchEmptyView";
import LocationPermissionSheet from "../../components/used/LocationPermissionSheet";
import NavigationBar from "../../components/common/NavigationBar";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import { DEFAULT_NEARBY_LABEL } from "../../constants/location";
import type { UsedFilter, UsedSort } from "../../types/used";
import { useUsedStore } from "../../stores/usedStore";
import { useLocationGate } from "../../hooks/useLocationGate";
import { useProductListQuery } from "../../hooks/useProducts";
import { useProductLikeToggle } from "../../hooks/useProductLikeToggle";
import { useCommitSearch } from "../../hooks/useCommitSearch";

export default function UsedSearchResultPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const businessCategory = searchParams.get("businessCategory") ?? undefined;
  const productCategory = searchParams.get("productCategory") ?? undefined;
  const categoryLabel = searchParams.get("label");
  const displayQuery = query || categoryLabel || "";

  const location = useUsedStore((s) => s.location);
  const commitSearch = useCommitSearch();
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

  const runSearch = () => {
    const q = commitSearch(keyword);
    if (q) setSearchParams({ q });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onBack={() => navigate(ROUTES.USED)}
        onSearch={runSearch}
      />

      <FilterTabs
        value={filter}
        onChange={setFilter}
        nearbyLabel={DEFAULT_NEARBY_LABEL}
        showNearby={locationGranted}
      />

      <div className="flex flex-col gap-4 px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-body-2 text-gray-700">검색결과 {results.length}개</p>
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
