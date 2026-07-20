import { ImageIcon, MenuKebabIcon } from "../../assets/icons";
import { LikeCount } from "./LikeButton";
import type { SaleStatus } from "../../types/used";

export type { SaleStatus };

interface MyProductCardProps {
  status: SaleStatus;
  imageUrl?: string | null;
  title: string;
  meta?: string;
  price: number;
  likeCount: number;
  onClick?: () => void;
  onMenuClick?: () => void;
}

const STATUS_LABEL: Record<SaleStatus, string> = {
  selling: "판매중",
  completed: "거래완료",
};

export default function MyProductCard({
  status,
  imageUrl,
  title,
  meta,
  price,
  likeCount,
  onClick,
  onMenuClick,
}: MyProductCardProps) {
  const completed = status === "completed";

  return (
    <div className="rounded-2xl bg-white p-4">
      <div className="flex items-center justify-between">
        <span
          className={`text-title-3 ${completed ? "text-gray-400" : "text-gray-900"}`}
        >
          {STATUS_LABEL[status]}
        </span>
        <button
          type="button"
          aria-label="더보기"
          onClick={onMenuClick}
          className="shrink-0 text-gray-400 active:opacity-60"
        >
          <MenuKebabIcon width={24} height={24} />
        </button>
      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-3 flex w-full gap-3 text-left active:opacity-80"
      >
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-200">
              <ImageIcon className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-subtitle-1 text-gray-900">{title}</p>
          {meta && (
            <p className="mt-1 truncate text-body-2 text-gray-400">{meta}</p>
          )}
          <p className="mt-2 text-title-3 text-gray-900">
            {price.toLocaleString("ko-KR")}원
          </p>
        </div>
      </button>

      <div className="mt-2 flex justify-end">
        <LikeCount count={likeCount} />
      </div>
    </div>
  );
}
