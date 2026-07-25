import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import { ROUTES } from "../../constants/routes";
import InquiryHistoryItem from "../../components/inquiry/InquiryHistoryItem";
import { MOCK_INQUIRIES } from "../../mocks/inquiry/mockInquiry";

export default function InquiryHistoryPage() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const totalCount = MOCK_INQUIRIES.length;
  const answeredCount = MOCK_INQUIRIES.filter(
    (inquiry) => inquiry.status === "answered",
  ).length;

  return (
    <div className="min-h-screen bg-white pb-28">
      <TopBar title="나의 문의내역" onBack={() => navigate(-1)} />
      <div className="flex flex-col gap-5 pt-5">
        <div className="mx-4 flex items-center rounded-md bg-gray-30 px-1 py-2.5">
          <div className="flex items-center gap-0.5 border-r border-gray-100 px-2">
            <span className="text-body-2 text-gray-500">등록된 문의</span>
            <span className="text-subtitle-2 text-gray-900">
              {totalCount}건
            </span>
          </div>
          <div className="flex items-center gap-0.5 px-2">
            <span className="text-body-2 text-gray-500">답변 완료</span>
            <span className="text-subtitle-2 text-gray-900">
              {answeredCount}건
            </span>
          </div>
        </div>
        {/* TODO: 실제 문의 조회 API 연동 */}
        <div className="flex flex-col gap-6">
          {MOCK_INQUIRIES.map((inquiry) => (
            <InquiryHistoryItem
              key={inquiry.id}
              inquiry={inquiry}
              expanded={expandedId === inquiry.id}
              onToggle={() =>
                setExpandedId((current) =>
                  current === inquiry.id ? null : inquiry.id,
                )
              }
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 z-40 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-white px-4 pb-5 pt-2.5">
        <Button fullWidth onClick={() => navigate(ROUTES.INQUIRY)}>
          새로운 1:1 문의하기
        </Button>
      </div>
    </div>
  );
}