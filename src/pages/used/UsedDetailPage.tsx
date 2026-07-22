import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import LikeButton from "../../components/used/LikeButton";
import SellerInfo from "../../components/used/SellerInfo";
import ProductStatusSheet from "../../components/used/ProductStatusSheet";
import DeleteProductModal from "../../components/used/DeleteProductModal";
import { MenuKebabIcon } from "../../assets/icons";
import NaverMap from "../../components/used/NaverMap";
import ProductThumbnail from "../../components/used/ProductThumbnail";
import { formatPrice } from "../../utils/formatPrice";
import { ROUTES, chatRoomPath } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";

function InfoRow({
  label,
  value,
  showBorder = true,
}: {
  label: string;
  value: string;
  showBorder?: boolean;
}) {
  return (
    <div
      className={`flex items-start gap-3 px-0.5 py-4 ${showBorder ? "border-b border-gray-100" : ""}`}
    >
      <span className="w-20 shrink-0 text-caption-1 text-gray-900">
        {label}
      </span>
      <span className="text-body-3 text-gray-900">{value}</span>
    </div>
  );
}

export default function UsedDetailPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const id = Number(productId);

  const product = useUsedStore((s) => s.products.find((p) => p.id === id));
  const toggleLike = useUsedStore((s) => s.toggleLike);
  const updateProductStatus = useUsedStore((s) => s.updateProductStatus);
  const removeProduct = useUsedStore((s) => s.removeProduct);
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar title="상품 상세" onBack={() => navigate(ROUTES.USED)} />
        <p className="px-4 pt-10 text-center text-body-2 text-gray-400">
          상품을 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  const meta = [product.industry, product.itemCategory, product.timeAgo]
    .filter(Boolean)
    .join(" · ");
  const dealTypeLabel = product.dealTypes.join(", ");
  const isMine = product.isMine ?? true;
  const showDealLocation =
    product.dealTypes.includes("직거래") && product.dealLocation;

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar
        onBack={() => navigate(-1)}
        right={
          isMine ? (
            <button
              type="button"
              aria-label="더보기"
              onClick={() => setMenuOpen(true)}
              className="p-1 text-gray-900"
            >
              <MenuKebabIcon />
            </button>
          ) : undefined
        }
      />

      <div className="aspect-square w-full bg-gray-100">
        <ProductThumbnail
          imageUrl={product.imageUrl}
          alt={product.title}
          iconClassName="h-14 w-14"
        />
      </div>

      <div className="flex flex-col gap-5 px-4">
        <SellerInfo
          name={product.sellerName ?? "판매자"}
          neighborhood={product.sellerNeighborhood}
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-title-3 text-gray-900">{product.title}</h1>
          <p className="text-title-2 text-gray-900">
            {formatPrice(product.price)}원
          </p>
          {meta && <p className="text-body-3 text-gray-500">{meta}</p>}
        </div>

        {product.description && (
          <p className="whitespace-pre-line px-0.5 text-body-2 text-gray-900">
            {product.description}
          </p>
        )}

        <div>
          <InfoRow
            label="거래 방식"
            value={dealTypeLabel}
            showBorder={!!showDealLocation}
          />
          {showDealLocation && (
            <InfoRow
              label="직거래 장소"
              value={product.dealLocation!}
              showBorder={false}
            />
          )}

          {showDealLocation &&
            product.lat !== undefined &&
            product.lng !== undefined && (
              <div className="px-0.5 pb-4">
                <NaverMap
                  lat={product.lat}
                  lng={product.lng}
                  className="aspect-[343/233] w-full overflow-hidden rounded-lg"
                />
              </div>
            )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 items-center gap-5 border-t border-gray-100 bg-white p-4">
        <Button
          fullWidth
          onClick={() => navigate(chatRoomPath(product.id))}
        >
          구매 문의
        </Button>
        <LikeButton
          liked={product.liked}
          onToggle={() => toggleLike(product.id)}
          unlikedClassName="text-gray-500"
          className="h-10 w-10"
        />
      </div>

      {menuOpen && (
        <ProductStatusSheet
          onChangeToReserved={() => {
            updateProductStatus(product.id, "reserved");
            setMenuOpen(false);
          }}
          onChangeToCompleted={() => {
            updateProductStatus(product.id, "completed");
            setMenuOpen(false);
          }}
          onEdit={() => setMenuOpen(false)}
          onDelete={() => {
            setMenuOpen(false);
            setDeleteOpen(true);
          }}
          onClose={() => setMenuOpen(false)}
        />
      )}

      {deleteOpen && (
        <DeleteProductModal
          onCancel={() => setDeleteOpen(false)}
          onConfirm={() => {
            removeProduct(product.id);
            setDeleteOpen(false);
            navigate(ROUTES.USED_MY);
          }}
        />
      )}
    </div>
  );
}
