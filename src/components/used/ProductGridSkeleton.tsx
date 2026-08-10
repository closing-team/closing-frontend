import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGridSkeleton() {
  return (
    <div aria-hidden="true" className="grid grid-cols-2 gap-x-3 gap-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
