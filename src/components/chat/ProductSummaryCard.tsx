import type { ChatProductSummary } from "../../types/chat";

interface ProductSummaryCardProps {
  product: ChatProductSummary;
  onSelect: (productId: string) => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("ko-KR").format(price);
}

export default function ProductSummaryCard({
  product,
  onSelect,
}: ProductSummaryCardProps) {
  const price = formatPrice(product.price);

  return (
    <button
      type="button"
      aria-label={`${product.title}, ${price}원`}
      onClick={() => onSelect(product.id)}
      className="flex w-full items-center gap-3 bg-gray-30 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500"
    >
      <span className="h-9 w-9 shrink-0 overflow-hidden rounded">
        <img
          src={product.imageUrl}
          alt={`${product.title} 상품 이미지`}
          className="h-full w-full object-cover"
        />
      </span>
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-body-3 text-gray-900">{product.title}</span>
        <span className="text-caption-1 font-semibold text-gray-900">{price}원</span>
      </span>
    </button>
  );
}
