import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Chip from "../../components/common/Chip";
import Button from "../../components/common/Button";
import BookmarkButton from "../../components/support/BookmarkButton";
import DetailSection from "../../components/support/DetailSection";
import { ChevronRightIcon } from "../../assets/icons";
import { getSupportPostById } from "../../mocks/mockSupport";
import { ROUTES } from "../../constants/routes";

export default function SupportDetailPage() {
  const navigate = useNavigate();
  const { supportId = "" } = useParams();
  // TODO: API 연동
  const post = getSupportPostById(Number(supportId));
  const [bookmarked, setBookmarked] = useState(post?.bookmarked ?? false);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-30">
        <TopBar title="지원정보" onBack={() => navigate(ROUTES.SUPPORT)} />
        <p className="px-4 py-10 text-center text-body-2 text-gray-500">
          존재하지 않는 공고입니다.
        </p>
      </div>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const isExpired = post.endDate !== null && post.endDate < todayStr;

  const handleApply = () => {
    // TODO: 외부 링크 접속 실패 시 토스트 노출 + URL 클립보드 복사 처리 필요
    // TODO: 토스트 컴포넌트 도입 후 구현
    window.open(post.applyUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-30 pb-6">
      <TopBar title="지원정보" onBack={() => navigate(ROUTES.SUPPORT)} />

      <div className="relative mx-4 mt-5 overflow-hidden rounded-xl bg-white">
        <BookmarkButton
          bookmarked={bookmarked}
          onToggle={() => setBookmarked((v) => !v)}
          className="absolute right-3 top-3 z-10"
        />

        <div className="px-4">
          <div className="flex flex-col gap-2 py-6">
            {isExpired && <Chip label="마감된 공고입니다." variant="badge" />}
            <p className="text-caption-1 text-gray-700">
              {post.organization}
            </p>
            <p className="text-title-3 text-gray-900">{post.title}</p>
            <div className="flex items-center gap-1 text-caption-2 text-gray-700">
              <span>신청기간</span>
              <span>{post.period}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5 border-y border-gray-100 py-5">
            <DetailSection title="사업 개요">
              <div className="flex flex-col gap-2">
                <p>{post.overview}</p>
                <div className="flex items-center gap-1 text-caption-2">
                  <span className="text-gray-700">지원대상</span>
                  <span className="text-gray-900">{post.target}</span>
                </div>
              </div>
            </DetailSection>

            <DetailSection title={post.applicationHeading}>
              <ul className="flex flex-col gap-1">
                {post.applicationMethods.map((line, i) => (
                  <li key={i}>- {line}</li>
                ))}
              </ul>
            </DetailSection>
          </div>

          <div className="border-b border-gray-100 py-5">
            <DetailSection title={post.contactHeading}>
              <div className="flex flex-col gap-1">
                {post.contactLines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </DetailSection>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 px-4 pb-4 pt-5">
          <Button
            variant="primary"
            fullWidth
            rightIcon={<ChevronRightIcon />}
            onClick={handleApply}
          >
            온라인 신청 바로가기
          </Button>
          <p className="text-caption-3 text-gray-400">{post.applyUrlLabel}</p>
        </div>
      </div>
    </div>
  );
}
