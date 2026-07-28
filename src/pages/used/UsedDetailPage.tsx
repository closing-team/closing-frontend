import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import LikeButton from "../../components/used/LikeButton";
import SellerInfo from "../../components/used/SellerInfo";
import ProductActionSheets from "../../components/used/ProductActionSheets";
import { MenuKebabIcon, SearchIcon } from "../../assets/icons";
import NaverMap from "../../components/used/NaverMap";
import ProductThumbnail from "../../components/used/ProductThumbnail";
import { formatPriceLabel } from "../../utils/formatPrice";
import { ROUTES, chatRoomPath, usedEditPath } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";
import { useChatStore } from "../../stores/chatStore";
import { useProductDetailQuery } from "../../hooks/useProducts";
import { useToggleBookmarkMutation } from "../../hooks/useProductMutations";
import { useProductActionsSheet } from "../../hooks/useProductActionsSheet";

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

  const location = useUsedStore((s) => s.location);
  const messagesByProduct = useChatStore((s) => s.messagesByProduct);
  const { data: product, isLoading } = useProductDetailQuery(id, location);
  const toggleBookmark = useToggleBookmarkMutation();
  const actions = useProductActionsSheet();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar title="상품 상세" onBack={() => navigate(ROUTES.USED)} />
      </div>
    );
  }

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
  const chatMessageCount = messagesByProduct[product.id]?.length ?? 0;
  const hasChat = chatMessageCount > 0;

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar
        onBack={() => navigate(-1)}
        right={
          isMine ? (
            <button
              type="button"
              aria-label="더보기"
              onClick={() => actions.openMenu(product.id)}
              className="p-1 text-gray-900"
            >
              <MenuKebabIcon />
            </button>
          ) : (
            <button
              type="button"
              aria-label="검색"
              onClick={() => navigate(ROUTES.USED_SEARCH)}
              className="p-1 text-gray-900"
            >
              <SearchIcon />
            </button>
          )
        }
      />

      {product.imageUrl && (
        <div className="aspect-square w-full bg-gray-100">
          <ProductThumbnail
            imageUrl={product.imageUrl}
            alt={product.title}
            iconClassName="h-14 w-14"
          />
        </div>
      )}

      <div className="flex flex-col gap-5 px-4">
        <SellerInfo
          name={product.sellerName ?? "판매자"}
          neighborhood={product.sellerNeighborhood}
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-title-3 text-gray-900">{product.title}</h1>
          <p className="text-title-2 text-gray-900">
            {formatPriceLabel(product.price)}
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
          variant={hasChat ? "secondary" : "primary"}
          className={hasChat ? "text-primary-500" : ""}
          onClick={() => navigate(chatRoomPath(product.id))}
        >
          {hasChat ? `대화중인 채팅 ${chatMessageCount}` : "구매 문의"}
        </Button>
        {!isMine && (
          <LikeButton
            liked={product.liked}
            onToggle={() =>
              toggleBookmark.mutate({ productId: product.id, liked: product.liked })
            }
            unlikedClassName="text-gray-500"
            className="h-10 w-10"
          />
        )}
      </div>

      <ProductActionSheets
        menuOpen={actions.menuProductId === product.id}
        deleteOpen={actions.deleteProductId === product.id}
        onChangeToReserved={() => actions.changeStatus("reserved")}
        onChangeToCompleted={() => actions.changeStatus("completed")}
        onEdit={() => {
          actions.closeMenu();
          navigate(usedEditPath(product.id));
        }}
        onRequestDelete={actions.requestDelete}
        onCloseMenu={actions.closeMenu}
        onCancelDelete={actions.cancelDelete}
        onConfirmDelete={() =>
          actions.confirmDelete(() =>
            navigate(ROUTES.USED_MY, { replace: true }),
          )
        }
      />
    </div>
  );
}
