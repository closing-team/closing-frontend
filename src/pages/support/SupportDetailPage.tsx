import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Chip from "../../components/common/Chip";
import Button from "../../components/common/Button";
import Toast from "../../components/common/Toast";
import BookmarkButton from "../../components/support/BookmarkButton";
import DetailSection from "../../components/support/DetailSection";
import SupportDetailSkeleton from "../../components/support/SupportDetailSkeleton";
import { ChevronRightIcon } from "../../assets/icons";
import { useSupportDetailQuery } from "../../hooks/useSupportQueries";
import {
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "../../hooks/useSupportMutations";
import {
  formatApplicationPeriod,
  getBookmarkErrorMessage,
} from "../../utils/supportAdapter";
import { ROUTES } from "../../constants/routes";

export default function SupportDetailPage() {
  const navigate = useNavigate();
  const { supportId = "" } = useParams();
  const numericSupportId = Number(supportId);

  const { data: detail, isLoading } = useSupportDetailQuery(numericSupportId);
  const addBookmark = useAddBookmarkMutation();
  const removeBookmark = useRemoveBookmarkMutation();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  if (isLoading) {
    return (
      <div className="min-h-dvh bg-gray-30">
        <TopBar title="지원정보" onBack={() => navigate(ROUTES.SUPPORT)} />
        <SupportDetailSkeleton />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="min-h-dvh bg-gray-30">
        <TopBar title="지원정보" onBack={() => navigate(ROUTES.SUPPORT)} />
        <p className="px-4 py-10 text-center text-body-2 text-gray-500">
          존재하지 않는 공고입니다.
        </p>
      </div>
    );
  }

  const post = detail;

  const todayStr = new Date().toISOString().slice(0, 10);
  const isExpired = post.applyEndDate !== null && post.applyEndDate < todayStr;

  const handleApply = () => {
    // TODO: 외부 링크 접속 실패 시 토스트 노출, URL 클립보드 복사 처리 필요
    window.open(post.externalUrl, "_blank", "noopener,noreferrer");
  };

  const handleToggleBookmark = () => {
    const mutation = post.isBookmarked ? removeBookmark : addBookmark;
    mutation.mutate(post.supportId, {
      onError: (error) => setToastMessage(getBookmarkErrorMessage(error)),
    });
  };

  return (
    <div className="min-h-dvh bg-gray-30 pb-6">
      <TopBar title="지원정보" onBack={() => navigate(ROUTES.SUPPORT)} />

      <div className="relative mx-4 mt-5 overflow-hidden rounded-xl bg-white">
        <BookmarkButton
          bookmarked={post.isBookmarked}
          onToggle={handleToggleBookmark}
          className="absolute right-3 top-3 z-10"
        />

        <div className="px-4">
          <div className="flex flex-col gap-2 py-6">
            {isExpired && <Chip label="마감된 공고입니다." variant="badge" />}
            <p className="text-caption-1 text-gray-700">
              {post.organizationName}
            </p>
            <p className="text-title-3 text-gray-900">{post.title}</p>
            <div className="flex items-center gap-1 text-caption-2 text-gray-700">
              <span>신청기간</span>
              <span>
                {formatApplicationPeriod(post.applyStartDate, post.applyEndDate)}
              </span>
            </div>
          </div>

          <div className="border-y border-gray-100 py-5">
            <DetailSection title="지원 내용">
              <p className="whitespace-pre-line">{post.content}</p>
            </DetailSection>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 px-4 pb-4 pt-5">
          {toastMessage && <Toast message={toastMessage} />}
          <Button
            variant="primary"
            fullWidth
            rightIcon={<ChevronRightIcon />}
            onClick={handleApply}
          >
            온라인 신청 바로가기
          </Button>
        </div>
      </div>
    </div>
  );
}
