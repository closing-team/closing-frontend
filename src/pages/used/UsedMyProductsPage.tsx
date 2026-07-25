import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import Chip from "../../components/common/Chip";
import MyProductCard from "../../components/used/MyProductCard";
import ProductActionSheets from "../../components/used/ProductActionSheets";
import InfiniteScrollTrigger from "../../components/common/InfiniteScrollTrigger";
import { PlusMdIcon } from "../../assets/icons";
import { ROUTES, usedDetailPath } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { useMyProductsQuery } from "../../hooks/useProducts";
import { useProductActionsSheet } from "../../hooks/useProductActionsSheet";
import { saleStatusToStatusCode } from "../../utils/productAdapter";
import type { SaleStatus } from "../../types/used";

type StatusFilter = "all" | SaleStatus;

export default function UsedMyProductsPage() {
  const navigate = useNavigate();
  const authenticated = useUsedStore((s) => s.authenticated);
  const actions = useProductActionsSheet();
  const [filter, setFilter] = useState<StatusFilter>("all");

  const statusCode = filter === "all" ? undefined : saleStatusToStatusCode(filter);
  const {
    products: visibleProducts,
    counts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMyProductsQuery(statusCode);

  const currentCount =
    filter === "all"
      ? counts.total
      : filter === "selling"
        ? counts.selling
        : filter === "reserved"
          ? counts.reserved
          : counts.soldOut;

  const handleWrite = () => {
    navigate(authenticated ? ROUTES.USED_WRITE : ROUTES.BUSINESS_AUTH);
  };

  return (
    <div className="min-h-screen bg-gray-30 pb-24">
      <TopBar title="나의 판매물품" onBack={() => navigate(-1)} />

      <div className="flex gap-1.5 overflow-x-auto p-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip
          label="전체"
          selected={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <Chip
          label={`판매중 ${counts.selling}`}
          selected={filter === "selling"}
          onClick={() => setFilter("selling")}
        />
        <Chip
          label={`거래완료 ${counts.soldOut}`}
          selected={filter === "completed"}
          onClick={() => setFilter("completed")}
        />
        <Chip
          label={`예약중 ${counts.reserved}`}
          selected={filter === "reserved"}
          onClick={() => setFilter("reserved")}
        />
      </div>

      <p className="flex items-center gap-2.5 self-stretch px-0.5 text-subtitle-2 text-gray-500">
        상품 {currentCount}개
      </p>

      {visibleProducts.length === 0 ? (
        <p className="px-4 pt-20 text-center text-body-2 text-gray-400">
          해당하는 상품이 없어요.
        </p>
      ) : (
        <>
          <div className="mt-2 flex flex-col gap-2.5 px-4">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="rounded-2xl border border-gray-100"
              >
                <MyProductCard
                  status={product.status ?? "selling"}
                  imageUrl={product.imageUrl}
                  title={product.title}
                  meta={[...product.dealTypes, product.neighborhood, product.timeAgo].join(
                    " · ",
                  )}
                  price={product.price}
                  likeCount={product.likes}
                  liked={product.liked}
                  onClick={() => navigate(usedDetailPath(product.id))}
                  onMenuClick={() => actions.openMenu(product.id)}
                />
              </div>
            ))}
          </div>
          <InfiniteScrollTrigger
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            onLoadMore={fetchNextPage}
          />
        </>
      )}

      <Fab
        variant="used"
        icon={<PlusMdIcon className="h-6 w-6 text-white" />}
        ariaLabel="글쓰기"
        onClick={handleWrite}
        noNavBar
      />

      <ProductActionSheets
        menuOpen={actions.menuProductId !== null}
        deleteOpen={actions.deleteProductId !== null}
        onChangeToReserved={() => actions.changeStatus("reserved")}
        onChangeToCompleted={() => actions.changeStatus("completed")}
        onRequestDelete={actions.requestDelete}
        onCloseMenu={actions.closeMenu}
        onCancelDelete={actions.cancelDelete}
        onConfirmDelete={() => actions.confirmDelete()}
      />
    </div>
  );
}
