export default function TermsListSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="mt-7 h-[68px] w-full animate-pulse rounded-xl bg-gray-100" />
      <div className="mt-4 flex flex-col gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[56px] items-center gap-3"
          >
            <div className="h-6 w-6 shrink-0 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
