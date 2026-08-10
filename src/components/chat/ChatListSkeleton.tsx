function ChatCardSkeleton() {
  return (
    <div className="flex h-[99px] w-full items-center gap-3 bg-white p-4">
      <div className="h-[58px] w-[58px] shrink-0 animate-pulse rounded-lg bg-gray-100" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="h-4 w-2/5 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-4/5 animate-pulse rounded bg-gray-100" />
        <div className="h-3 w-1/4 animate-pulse rounded bg-gray-100" />
      </div>
    </div>
  );
}

export default function ChatListSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <ChatCardSkeleton key={i} />
      ))}
    </div>
  );
}
