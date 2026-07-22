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
import LocationPermissionSheet from "../../components/used/LocationPermissionSheet";
import SideMenu from "../../components/sidemenu/SideMenu";
import { MenuHamburgerIcon, PlusMdIcon, SearchIcon } from "../../assets/icons";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import type { UsedFilter, UsedSort } from "../../types/used";
import { applyFilter } from "../../utils/usedListUtils";
import { useUsedStore } from "../../stores/usedStore";
import { useSupportStore } from "../../stores/supportStore";
import { useLocationGate } from "../../hooks/useLocationGate";

const DEFAULT_NEARBY_LABEL = "원홍동 근처";

export default function UsedListPage() {
  const navigate = useNavigate();

  const products = useUsedStore((s) => s.products);
  const toggleLike = useUsedStore((s) => s.toggleLike);
  const authenticated = useUsedStore((s) => s.authenticated);
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
  const interestCount = products.filter((p) => p.liked).length;
  const chatCount = Object.keys(messagesByProduct).length;
  const bookmarkCount = useSupportStore(
    (s) => s.posts.filter((post) => post.bookmarked).length,
  );

  const visibleProducts = useMemo(
    () => applyFilter(products, filter),
    [products, filter],
  );

  const handleWrite = () => {
    navigate(authenticated ? ROUTES.USED_WRITE : ROUTES.BUSINESS_AUTH);
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
