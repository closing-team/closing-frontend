import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ProductGrid from "../../components/used/ProductGrid";
import InfiniteScrollTrigger from "../../components/common/InfiniteScrollTrigger";
import UsedLikedEmptyView from "../../components/used/UsedLikedEmptyView";
import { useUsedStore } from "../../stores/usedStore";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import { useBookmarkedProductsQuery } from "../../hooks/useProductQueries";
import { useProductLikeToggle } from "../../hooks/useProductLikeToggle";

export default function UsedLikedProductsPage() {
  const navigate = useNavigate();
  const location = useUsedStore((s) => s.location);
  const {
    products: likedProducts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useBookmarkedProductsQuery(location);
  const handleToggleLike = useProductLikeToggle(likedProducts);
  const handleProductClick = useCallback(
    (id: number) => navigate(usedDetailPath(id)),
    [navigate],
  );

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar title="관심 물품" onBack={() => navigate(-1)} />

      {likedProducts.length === 0 ? (
        <UsedLikedEmptyView onGoHome={() => navigate(ROUTES.USED)} />
      ) : (
        <>
          <ProductGrid
            products={likedProducts}
            onProductClick={handleProductClick}
            onToggleLike={handleToggleLike}
            className="grid grid-cols-2 gap-x-3 gap-y-4 px-4 py-3"
          />
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </>
      )}
    </div>
  );
}
