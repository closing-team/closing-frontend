export default function ProductDetailSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="aspect-square w-full animate-pulse bg-gray-100" />

      <div className="flex flex-col gap-5 px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse rounded-full bg-gray-100" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
          <div className="h-6 w-1/3 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </div>
  );
}
