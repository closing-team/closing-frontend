import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import FilterTabs from "../../components/used/FilterTabs";
import SortDropdown from "../../components/used/SortDropdown";
import ProductCard from "../../components/used/ProductCard";
import BusinessAuthModal from "../../components/used/BusinessAuthModal";
import UsedEmptyView from "../../components/used/UsedEmptyView";
import { PlusMdIcon, SearchIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import type { UsedFilter, UsedSort, Product } from "../../types/used";
import { MOCK_PRODUCTS } from "./mockProducts";

const DEFAULT_NEARBY_LABEL = "원홍동 근처";

function applyFilter(products: Product[], filter: UsedFilter): Product[] {
  switch (filter) {
    case "nearby":
      return products.filter((p) => p.distanceM <= 3000);
    case "parcel":
      return products.filter((p) => p.dealTypes.includes("택배거래"));
    case "direct":
      return products.filter((p) => p.dealTypes.includes("직거래"));
    default:
      return products;
  }
}

function applySort(products: Product[], sort: UsedSort): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "latest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "distance":
      return sorted.sort((a, b) => a.distanceM - b.distanceM);
    case "priceLow":
      return sorted.sort((a, b) => a.price - b.price);
    case "priceHigh":
      return sorted.sort((a, b) => b.price - a.price);
    case "popular":
    default:
      return sorted.sort((a, b) => b.likes - a.likes);
  }
}

export default function UsedListPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [filter, setFilter] = useState<UsedFilter>("all");
  const [sort, setSort] = useState<UsedSort>("popular");
  const [locationGranted, setLocationGranted] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalShown, setAuthModalShown] = useState(false);

  const navigate = useNavigate();

  const requestLocation = () => {
    if (!("geolocation" in navigator)) return;
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
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.likes + (p.liked ? -1 : 1) }
          : p,
      ),
    );
  };

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
      <TopBar
        title="중고거래"
        right={
          <button type="button" aria-label="검색" className="p-1 text-gray-900">
            <SearchIcon />
          </button>
        }
      />

      <FilterTabs
        value={filter}
        onChange={setFilter}
        nearbyLabel={DEFAULT_NEARBY_LABEL}
      />

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
      <Fab
        variant="used"
        icon={<PlusMdIcon className="h-6 w-6 text-white" />}
        ariaLabel="글쓰기"
        onClick={handleWrite}
      />

      {showAuthModal && (
        <BusinessAuthModal
          onClose={() => setShowAuthModal(false)}
          onVerify={handleVerify}
        />
      )}

      <NavigationBar />
    </div>
  );
}
