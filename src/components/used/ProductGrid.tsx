import ProductCard from "./ProductCard";
import type { Product } from "../../types/used";

interface ProductGridProps {
  products: Product[];
  onProductClick: (id: number) => void;
  onToggleLike: (id: number) => void;
  className?: string;
}

export default function ProductGrid({
  products,
  onProductClick,
  onToggleLike,
  className = "grid grid-cols-2 gap-x-3 gap-y-3",
}: ProductGridProps) {
  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          onToggleLike={onToggleLike}
        />
      ))}
    </div>
  );
}
