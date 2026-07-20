const CHIP_WIDTHS = ["4rem", "6rem", "4rem", "4.5rem"];

function ProductCardSkeleton() {
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

export default function UsedContentSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex gap-1.5 overflow-x-auto px-4 py-2">
        {CHIP_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="h-8 shrink-0 animate-pulse rounded-full bg-gray-100"
            style={{ width }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 px-4 py-3">
        <div className="flex justify-end">
          <div className="h-8 w-20 animate-pulse rounded-md bg-gray-100" />
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
