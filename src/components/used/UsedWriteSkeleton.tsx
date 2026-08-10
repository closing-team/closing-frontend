function FieldSkeleton({ labelWidth = "w-20" }: { labelWidth?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`h-3 animate-pulse rounded bg-gray-100 ${labelWidth}`} />
      <div className="h-12 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}

export default function UsedWriteSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-5 px-4 py-5">
      <div className="flex gap-2">
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-gray-100" />
        <div className="h-20 w-20 shrink-0 animate-pulse rounded-lg bg-gray-100" />
      </div>
      <FieldSkeleton labelWidth="w-24" />
      <FieldSkeleton labelWidth="w-20" />
      <FieldSkeleton labelWidth="w-20" />
      <FieldSkeleton labelWidth="w-16" />
      <div className="h-32 w-full animate-pulse rounded-xl bg-gray-100" />
    </div>
  );
}
