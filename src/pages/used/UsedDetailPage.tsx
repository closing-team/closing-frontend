import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import LikeButton from "../../components/used/LikeButton";
import SellerRow from "../../components/used/SellerRow";
import { ImageIcon, SearchIcon } from "../../assets/icons";
import { ROUTES } from "../../constants/routes";
import { useUsedStore } from "../../stores/usedStore";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-0.5 py-4">
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

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar
        onBack={() => navigate(-1)}
        right={
          <button
            type="button"
            aria-label="검색"
            onClick={() => navigate(ROUTES.USED_SEARCH)}
            className="p-1 text-gray-900"
          >
            <SearchIcon />
          </button>
        }
      />

      <div className="aspect-square w-full bg-gray-100">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-200">
            <ImageIcon className="h-14 w-14" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 px-4">
        <SellerRow
          name={product.sellerName ?? "판매자"}
          neighborhood={product.sellerNeighborhood}
        />

        <div className="flex flex-col gap-1">
          <h1 className="text-title-3 text-gray-900">{product.title}</h1>
          <p className="text-title-2 text-gray-900">
            {product.price.toLocaleString("ko-KR")}원
          </p>
          {meta && <p className="text-body-3 text-gray-500">{meta}</p>}
        </div>

        {product.description && (
          <p className="whitespace-pre-line px-0.5 text-body-2 text-gray-900">
            {product.description}
          </p>
        )}

        <div>
          <InfoRow label="거래 방식" value={dealTypeLabel} />
          {product.dealTypes.includes("직거래") && product.dealLocation && (
            <InfoRow label="직거래 장소" value={product.dealLocation} />
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 flex w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 items-center gap-5 border-t border-gray-100 bg-white p-4">
        <Button
          fullWidth
          onClick={() => navigate(`/used/chat/${product.id}`)}
        >
          구매 문의
        </Button>
        <LikeButton
          liked={product.liked}
          onToggle={() => toggleLike(product.id)}
        />
      </div>
    </div>
  );
}
