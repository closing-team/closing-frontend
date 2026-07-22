import { MenuKebabIcon } from "../../assets/icons";
import { LikeCount } from "./LikeButton";
import ProductThumbnail from "./ProductThumbnail";
import { formatPrice } from "../../utils/formatPrice";
import type { SaleStatus } from "../../types/used";

export type { SaleStatus };

interface MyProductCardProps {
  status: SaleStatus;
  imageUrl?: string | null;
  title: string;
  meta?: string;
  price: number;
  likeCount: number;
  liked?: boolean;
  onClick?: () => void;
  onMenuClick?: () => void;
}

const STATUS_LABEL: Record<SaleStatus, string> = {
  selling: "판매중",
  reserved: "예약중",
  completed: "거래완료",
};

export default function MyProductCard({
  status,
  imageUrl,
  title,
  meta,
  price,
  likeCount,
  liked = false,
  onClick,
  onMenuClick,
}: MyProductCardProps) {
  const completed = status === "completed";
  const statusColorClass = completed
    ? "text-gray-400"
    : status === "reserved"
      ? "text-gray-500"
      : "text-primary-500";

  return (
    <div className="flex flex-col items-start self-stretch rounded-xl bg-white pb-3 shadow-[0_0_8px_0_rgba(159,159,162,0.02)]">
      <div className="flex h-[42px] items-center justify-between self-stretch pl-3 pr-1.5">
        <span className={`text-caption-1 ${statusColorClass}`}>
          {STATUS_LABEL[status]}
        </span>
        <button
          type="button"
          aria-label="더보기"
          onClick={onMenuClick}
          className="shrink-0 text-gray-500 active:opacity-60"
        >
          <MenuKebabIcon width={24} height={24} />
        </button>
      </div>

      <button
        type="button"
        aria-label={`${title}, ${formatPrice(price)}원`}
        onClick={onClick}
        className="flex w-full gap-3 px-3 text-left active:opacity-80"
      >
        <div
          className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-30"
          style={{ aspectRatio: "1 / 1" }}
        >
          <ProductThumbnail
            imageUrl={imageUrl}
            alt={title}
            iconClassName="h-8 w-8"
          />
        </div>

        <div className="flex h-20 min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-0.5">
            <p className="truncate text-subtitle-2 text-gray-700">{title}</p>
            {meta && (
              <p className="truncate text-caption-3 text-gray-500">{meta}</p>
            )}
            <p className="text-subtitle-2 text-gray-900">
              {formatPrice(price)}원
            </p>
          </div>

          <div className="flex justify-end">
            <LikeCount count={likeCount} liked={liked} />
          </div>
        </div>
      </button>
    </div>
  );
}
