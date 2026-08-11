function FieldSkeleton() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-3 w-16 animate-pulse rounded bg-gray-100" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}

export default function ProfileEditSkeleton() {
  return (
    <div aria-hidden="true">
      <div className="flex flex-col items-center py-8">
        <div className="h-[90px] w-[90px] animate-pulse rounded-full bg-gray-100" />
      </div>
      <div className="flex flex-col gap-5 px-4">
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
        <FieldSkeleton />
      </div>
    </div>
  );
}
