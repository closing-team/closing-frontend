function SupportCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-lg bg-white pb-4 pl-4 pr-3 pt-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)]">
      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-100" />
      <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-2/5 animate-pulse rounded bg-gray-100" />
    </div>
  );
}

export default function SupportListSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 px-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <SupportCardSkeleton key={i} />
      ))}
    </div>
  );
}
