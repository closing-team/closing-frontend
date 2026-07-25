import { ImageIcon } from "../../assets/icons";
import { formatPriceLabel } from "../../utils/formatPrice";

interface ProductBannerProps {
  imageUrl?: string | null;
  title: string;
  price: number;
  onClick?: () => void;
}

export default function ProductBanner({
  imageUrl,
  title,
  price,
  onClick,
}: ProductBannerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${title}, ${formatPriceLabel(price)}`}
      className="flex w-full items-center gap-3 self-stretch bg-gray-30 p-4 text-left"
    >
      <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-gray-200">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-400">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-body-3 text-gray-900">{title}</p>
        <p className="mt-1 text-caption-1 text-gray-900">
          {formatPriceLabel(price)}
        </p>
      </div>
    </button>
  );
}
