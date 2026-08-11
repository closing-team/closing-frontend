function InquiryItemSkeleton() {
  return (
    <div className="flex w-full flex-col gap-4 border-b border-gray-100 px-4 pb-7">
      <div className="h-6 w-16 animate-pulse rounded bg-gray-100" />
      <div className="flex flex-col gap-1">
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function InquiryHistorySkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5 pt-5">
      <div className="mx-4 h-11 animate-pulse rounded-md bg-gray-100" />
      <div className="flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <InquiryItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
