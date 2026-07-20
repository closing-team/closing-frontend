import { ImageIcon } from "../../assets/icons";
import LikeButton from "./LikeButton";

interface ProductListCardProps {
  imageUrl?: string | null;
  title: string;
  caption?: string;
  price: number;
  liked?: boolean;
  onToggleLike?: () => void;
  onClick?: () => void;
}

export default function ProductListCard({
  imageUrl,
  title,
  caption,
  price,
  liked = false,
  onToggleLike,
  onClick,
}: ProductListCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full flex-col text-left active:opacity-80"
    >
      <div
        className="relative w-full overflow-hidden rounded-2xl bg-gray-100"
        style={{ aspectRatio: "1 / 1" }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-200">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}

        {onToggleLike && (
          <LikeButton
            liked={liked}
            onToggle={onToggleLike}
            className="absolute bottom-3 right-3"
          />
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-head-2 text-gray-900">{title}</p>

      {caption && (
        <p className="mt-1 truncate text-subtitle-1 text-gray-400">{caption}</p>
      )}

      <p className="mt-2 text-head-1 text-gray-900">
        {price.toLocaleString("ko-KR")}원
      </p>
    </button>
  );
}
