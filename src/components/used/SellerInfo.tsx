interface SellerInfoProps {
  name: string;
  neighborhood?: string;
}

export default function SellerInfo({ name, neighborhood }: SellerInfoProps) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-500 text-subtitle-2 text-white">
        {name.slice(0, 1)}
      </div>
      <div className="min-w-0">
        <p className="truncate text-caption-2 text-gray-900">{name}</p>
        {neighborhood && (
          <p className="text-caption-3 text-gray-500">{neighborhood}</p>
        )}
      </div>
    </div>
  );
}
