export function BannerSkeleton() {
  return (
    <div
      className="mx-4 animate-pulse rounded-lg bg-gray-100"
      style={{ height: "148px" }}
    />
  );
}

export function TodoListSkeleton() {
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
