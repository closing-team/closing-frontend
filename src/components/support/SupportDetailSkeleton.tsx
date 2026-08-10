export default function SupportDetailSkeleton() {
  return (
    <div aria-hidden="true" className="mx-4 mt-5 overflow-hidden rounded-xl bg-white">
      <div className="px-4">
        <div className="flex flex-col gap-2 py-6">
          <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />
        </div>

        <div className="flex flex-col gap-2 border-y border-gray-100 py-5">
          <div className="h-4 w-16 animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
          <div className="h-3 w-3/5 animate-pulse rounded bg-gray-100" />
        </div>
      </div>

      <div className="px-4 pb-4 pt-5">
        <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    </div>
  );
}
