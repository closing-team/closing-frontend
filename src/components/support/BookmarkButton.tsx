import { BookmarkEmptyIcon, BookmarkFilledIcon } from "../../assets/icons";

interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
  className?: string;
}

export default function BookmarkButton({
  bookmarked,
  onToggle,
  className = "",
}: BookmarkButtonProps) {
  return (
    <button
      type="button"
      aria-label={bookmarked ? "북마크 해제" : "북마크 추가"}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`flex h-8 w-8 shrink-0 items-center justify-center p-1 ${className}`}
    >
      {bookmarked ? (
        <BookmarkFilledIcon className="h-6 w-6 text-primary-500" />
      ) : (
        <BookmarkEmptyIcon className="h-6 w-6 text-gray-200" />
      )}
    </button>
  );
}
