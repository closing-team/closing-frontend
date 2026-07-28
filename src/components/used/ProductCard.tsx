import { memo } from "react";
import LikeButton from "./LikeButton";
import ProductThumbnail from "./ProductThumbnail";
import { formatPrice, isFreePrice } from "../../utils/formatPrice";
import type { Product } from "../../types/used";

interface ProductCardProps {
  product: Product;
  onClick: (id: number) => void;
  onToggleLike: (id: number) => void;
}

function ProductCard({ product, onClick, onToggleLike }: ProductCardProps) {
  const meta = [
    ...product.dealTypes,
    `${formatDistance(product.distanceM)}`,
    product.neighborhood,
    product.timeAgo,
  ].join(" · ");

  return (
    <button
      type="button"
      onClick={() => onClick(product.id)}
      className="flex flex-col text-left active:opacity-80"
    >
      <div
        className="relative w-full overflow-hidden rounded-lg bg-gray-100"
        style={{ aspectRatio: "1 / 1" }}
      >
        <ProductThumbnail imageUrl={product.imageUrl} alt={product.title} />

        <LikeButton
          liked={product.liked}
          onToggle={() => onToggleLike(product.id)}
          className="absolute bottom-2 right-2"
        />
      </div>

      <p className="mt-2 line-clamp-2 text-subtitle-2 text-gray-700">
        {product.title}
      </p>

      <p className="mt-0.5 truncate text-caption-3 text-gray-500">{meta}</p>

      <p className="mt-1 flex text-subtitle-2 text-gray-900">
        {isFreePrice(product.price) ? (
          "나눔"
        ) : (
          <>
            <span className="min-w-0 truncate">{formatPrice(product.price)}</span>
            <span className="shrink-0">원</span>
          </>
        )}
      </p>
    </button>
  );
}

function formatDistance(distanceM: number) {
  if (distanceM < 1000) return `${distanceM}m`;
  return `${(distanceM / 1000).toFixed(1)}km`;
}

export default memo(ProductCard);
