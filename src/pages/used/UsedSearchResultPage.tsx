import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/used/SearchBar";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductCard from "../../components/used/ProductCard";
import UsedContentSkeleton from "../../components/used/UsedContentSkeleton";
import LocationPermissionSheet from "../../components/used/LocationPermissionSheet";
import NavigationBar from "../../components/common/NavigationBar";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import type { UsedFilter, UsedSort } from "../../types/used";
import { applyFilter, searchProducts } from "../../utils/usedListUtils";
import { useUsedStore } from "../../stores/usedStore";
import { useLocationGate } from "../../hooks/useLocationGate";

const DEFAULT_NEARBY_LABEL = "원홍동 근처";

export default function UsedSearchResultPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const products = useUsedStore((s) => s.products);
  const toggleLike = useUsedStore((s) => s.toggleLike);
  const addRecentSearch = useUsedStore((s) => s.addRecentSearch);
  const {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  } = useLocationGate();

  const [keyword, setKeyword] = useState(query);
  const [filter, setFilter] = useState<UsedFilter>("all");
  const [sort, setSort] = useState<UsedSort>("popular");

  const results = useMemo(
    () => applyFilter(searchProducts(products, query), filter),
    [products, query, filter],
  );

  const runSearch = () => {
    const q = keyword.trim();
    if (!q) return;
    addRecentSearch(q);
    setSearchParams({ q });
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <SearchBar
        value={keyword}
        onChange={setKeyword}
        onBack={() => navigate(ROUTES.USED)}
        onSearch={runSearch}
      />

      {locationGranted ? (
        <>
          <FilterTabs
            value={filter}
            onChange={setFilter}
            nearbyLabel={DEFAULT_NEARBY_LABEL}
          />

          <div className="flex flex-col gap-4 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-body-2 text-gray-700">
                검색결과 {results.length}개
              </p>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {results.length === 0 ? (
              <div className="pt-10 text-center text-body-2 text-gray-400">
                '{query}' 검색 결과가 없습니다.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                {results.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onClick={(id) => navigate(usedDetailPath(id))}
                    onToggleLike={toggleLike}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <UsedContentSkeleton />
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
