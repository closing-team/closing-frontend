import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductCard from "../../components/used/ProductCard";
import UsedEmptyView from "../../components/used/UsedEmptyView";
import UsedContentSkeleton from "../../components/used/UsedContentSkeleton";
import LocationPermissionModal from "../../components/used/LocationPermissionModal";
import { MenuHamburgerIcon, PlusMdIcon, SearchIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import type { UsedFilter, UsedSort } from "../../types/used";
import { applyFilter } from "../../utils/usedListUtils";
import { useUsedStore } from "../../stores/usedStore";
import { useLocationGate } from "../../hooks/useLocationGate";

const DEFAULT_NEARBY_LABEL = "원홍동 근처";

export default function UsedListPage() {
  const navigate = useNavigate();

  const products = useUsedStore((s) => s.products);
  const toggleLike = useUsedStore((s) => s.toggleLike);
  const authenticated = useUsedStore((s) => s.authenticated);
  const {
    locationGranted,
    showLocationModal,
    locationError,
    handleAllow,
    handleDeny,
  } = useLocationGate();

  const [filter, setFilter] = useState<UsedFilter>("all");
  const [sort, setSort] = useState<UsedSort>("popular");

  const visibleProducts = useMemo(
    () => applyFilter(products, filter),
    [products, filter],
  );

  const handleWrite = () => {
    navigate(authenticated ? ROUTES.USED_WRITE : ROUTES.USED_BUSINESS_AUTH);
  };

  const isEmpty = visibleProducts.length === 0;

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
            >
              <MenuHamburgerIcon />
            </button>
          </>
        }
      />

      {locationGranted ? (
        <>
          <FilterTabs
            value={filter}
            onChange={setFilter}
            nearbyLabel={DEFAULT_NEARBY_LABEL}
          />

          <div className="flex flex-col gap-4 px-4 py-3">
            <div className="flex justify-end">
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {isEmpty ? (
              <UsedEmptyView onWrite={handleWrite} />
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
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
        <LocationPermissionModal
          onAllow={handleAllow}
          onDeny={handleDeny}
          error={locationError}
        />
      )}
    </div>
  );
}
