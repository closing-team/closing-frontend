import { HeartEmptyIcon, HeartFilledIcon } from "../../assets/icons";

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  className?: string;
}

export default function LikeButton({
  liked,
  onToggle,
  className = "",
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
      className={`shrink-0 p-0.5 ${className}`}
    >
      {liked ? (
        <HeartFilledIcon width={24} height={24} className="text-[#FF4C7F]" />
      ) : (
        <HeartEmptyIcon width={24} height={24} className="text-gray-400" />
      )}
    </span>
  );
}

interface LikeCountProps {
  count: number;
  className?: string;
}

export function LikeCount({ count, className = "" }: LikeCountProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 text-gray-200 ${className}`}
    >
      <HeartFilledIcon width={20} height={20} />
      <span className="text-body-2 text-gray-400">{count}</span>
    </span>
  );
}
