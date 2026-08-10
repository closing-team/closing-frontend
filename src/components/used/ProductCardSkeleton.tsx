export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col">
      <div
        className="w-full animate-pulse rounded-lg bg-gray-100"
        style={{ aspectRatio: "1 / 1" }}
      />
      <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      <div className="mt-1 h-3 w-3/5 animate-pulse rounded bg-gray-100" />
      <div className="mt-1 h-4 w-2/5 animate-pulse rounded bg-gray-100" />
    </div>
  );
}
