import { useNavigate } from "react-router-dom";
import BookmarkButton from "./BookmarkButton";
import { supportDetailPath } from "../../constants/routes";
import { formatApplicationPeriod } from "../../utils/supportAdapter";
import type { SupportListItem } from "../../types/supportApi";

interface SupportCardProps {
  post: SupportListItem;
  onToggleBookmark: (supportId: number) => void;
}

export default function SupportCard({
  post,
  onToggleBookmark,
}: SupportCardProps) {
  const navigate = useNavigate();

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(supportDetailPath(post.supportId))}
      onKeyDown={(e) => {
        if (e.key === "Enter") navigate(supportDetailPath(post.supportId));
      }}
      className="relative flex flex-col gap-2 rounded-lg bg-white pb-4 pl-4 pr-3 pt-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)] active:opacity-75"
    >
      <BookmarkButton
        bookmarked={post.isBookmarked}
        onToggle={() => onToggleBookmark(post.supportId)}
        className="absolute right-2 top-2"
      />
      <p className="text-caption-1 text-gray-700">{post.organizationName}</p>
      <p className="text-subtitle-2 font-semibold text-gray-900">
        {post.title}
      </p>
      <div className="flex items-center gap-1 text-caption-2 text-gray-700">
        <span>신청기간</span>
        <span>{formatApplicationPeriod(post.applyStartDate, post.applyEndDate)}</span>
      </div>
    </div>
  );
}
