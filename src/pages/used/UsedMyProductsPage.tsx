import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import Chip from "../../components/common/Chip";
import MyProductCard from "../../components/used/MyProductCard";
import ProductStatusSheet from "../../components/used/ProductStatusSheet";
import DeleteProductModal from "../../components/used/DeleteProductModal";
import { PlusMdIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import type { SaleStatus } from "../../types/used";

type StatusFilter = "all" | SaleStatus;

export default function UsedMyProductsPage() {
  const navigate = useNavigate();
  const products = useUsedStore((s) => s.products);
  const authenticated = useUsedStore((s) => s.authenticated);
  const updateProductStatus = useUsedStore((s) => s.updateProductStatus);
  const removeProduct = useUsedStore((s) => s.removeProduct);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [menuProductId, setMenuProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);

  const myProducts = products.filter((p) => p.isMine !== false);

  const sellingCount = myProducts.filter(
    (p) => (p.status ?? "selling") === "selling",
  ).length;
  const completedCount = myProducts.filter(
    (p) => p.status === "completed",
  ).length;

  const visibleProducts = myProducts.filter((p) => {
    if (filter === "all") return true;
    return (p.status ?? "selling") === filter;
  });

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
          label={`판매중 ${sellingCount}`}
          selected={filter === "selling"}
          onClick={() => setFilter("selling")}
        />
        <Chip
          label={`거래완료 ${completedCount}`}
          selected={filter === "completed"}
          onClick={() => setFilter("completed")}
        />
      </div>

      {visibleProducts.length === 0 ? (
        <p className="px-4 pt-20 text-center text-body-2 text-gray-400">
          해당하는 상품이 없어요.
        </p>
      ) : (
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
                onClick={() => navigate(`/used/${product.id}`)}
                onMenuClick={() => setMenuProductId(product.id)}
              />
            </div>
          ))}
        </div>
      )}

      <Fab
        variant="used"
        icon={<PlusMdIcon className="h-6 w-6 text-white" />}
        ariaLabel="글쓰기"
        onClick={handleWrite}
        noNavBar
      />

      {menuProductId !== null && (
        <ProductStatusSheet
          onChangeToReserved={() => {
            updateProductStatus(menuProductId, "reserved");
            setMenuProductId(null);
          }}
          onChangeToCompleted={() => {
            updateProductStatus(menuProductId, "completed");
            setMenuProductId(null);
          }}
          onEdit={() => setMenuProductId(null)}
          onDelete={() => {
            setDeleteProductId(menuProductId);
            setMenuProductId(null);
          }}
          onClose={() => setMenuProductId(null)}
        />
      )}

      {deleteProductId !== null && (
        <DeleteProductModal
          onCancel={() => setDeleteProductId(null)}
          onConfirm={() => {
            removeProduct(deleteProductId);
            setDeleteProductId(null);
          }}
        />
      )}
    </div>
  );
}
