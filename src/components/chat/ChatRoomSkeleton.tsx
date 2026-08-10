function BubbleSkeleton({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={`flex ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className="h-9 w-2/5 animate-pulse rounded-2xl bg-gray-100" />
    </div>
  );
}

export default function ChatRoomSkeleton() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 px-4 py-5">
      <BubbleSkeleton align="left" />
      <BubbleSkeleton align="right" />
      <BubbleSkeleton align="left" />
    </div>
  );
}
