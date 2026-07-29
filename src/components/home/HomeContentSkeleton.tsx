function BannerSkeleton() {
  return (
    <div
      className="mx-4 animate-pulse rounded-lg bg-gray-100"
      style={{ height: "148px" }}
    />
  );
}

function CalendarSkeleton() {
  return (
    <div className="pt-6">
      <div className="rounded-t-[24px] bg-white px-4 pt-4 pb-4">
        <div className="mx-auto h-6 w-24 animate-pulse rounded bg-gray-100" />
      </div>

      <div className="bg-white px-4 pb-2">
        <div className="mb-1 grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex justify-center py-1">
              <div className="h-3 w-4 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex min-h-[52px] items-start justify-center py-1">
              <div className="h-7 w-7 animate-pulse rounded-full bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="h-8 w-full animate-pulse rounded-b-[24px] bg-gray-100" />
    </div>
  );
}

function TodoListSkeleton() {
  return (
    <div className="flex flex-col gap-3 px-4 py-2">
      {["5rem", "8rem", "6rem"].map((width, i) => (
        <div
          key={i}
          className="h-5 animate-pulse rounded bg-gray-100"
          style={{ width }}
        />
      ))}
    </div>
  );
}

export default function HomeContentSkeleton() {
  return (
    <div aria-hidden="true">
      <BannerSkeleton />
      <CalendarSkeleton />
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex h-12 items-center pl-[18px]">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-100" />
        </div>
        <TodoListSkeleton />
      </div>
    </div>
  );
}
