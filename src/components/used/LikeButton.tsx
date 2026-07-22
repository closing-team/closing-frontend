import { HeartEmptyIcon, HeartFilledIcon } from "../../assets/icons";

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  className?: string;
  unlikedClassName?: string;
}

export default function LikeButton({
  liked,
  onToggle,
  className = "",
  unlikedClassName = "text-white",
}: LikeButtonProps) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={liked ? "찜 해제" : "찜하기"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation();
          onToggle();
        }
      }}
      className={`inline-flex shrink-0 items-center justify-center p-0.5 ${className}`}
    >
      {liked ? (
        <HeartFilledIcon width={24} height={24} className="text-[#FF4C7F]" />
      ) : (
        <HeartEmptyIcon width={24} height={24} className={unlikedClassName} />
      )}
    </span>
  );
}

interface LikeCountProps {
  count: number;
  liked?: boolean;
  className?: string;
}

export function LikeCount({
  count,
  liked = false,
  className = "",
}: LikeCountProps) {
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 ${className}`}>
      <HeartFilledIcon
        width={12}
        height={12}
        className={liked ? "text-[#FF4C7F]" : "text-gray-200"}
      />
      <span className="text-caption-3 text-gray-500">{count}</span>
    </span>
  );
}
