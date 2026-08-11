import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import StepCard from "../../components/guide/StepCard";
import type { GuideStep } from "../../components/guide/StepCard";
import { AlertIcon } from "../../assets/icons";

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    title: "영업 종료일(폐업일) 산정 가이드",
    description:
      "매장 안의 물건 정리부터 세금 확정까지, 사장님이 발로 뛰는 순서 그대로 정렬했습니다.",
  },
  {
    id: 2,
    title: "임대차 계약 해지 통보 및 조율",
    description:
      "보증금 반환 분쟁과 월세 이중 지출을 막기 위해 최소 1~3개월 전 건물주에게 해지 의사를 전달합니다.",
  },
  {
    id: 3,
    title: "직원 퇴사 및 해고 예고 통보",
    description:
      "인사 분쟁을 방지하기 위해 30일 전 통보 필수! 근로자 사직서 확보 등 노무 리스크를 선제 해결합니다.",
  },
  {
    id: 4,
    title: "재고·집기 처분 가이드",
    description:
      "주방 설비 중고 매각으로 손실을 최소화하고 정수기, POS 등 대여 상품 중도해지를 협의합니다.",
  },
  {
    id: 5,
    title: "매장 철거 및 원상복구 가이드",
    description:
      "인테리어 철거 범위를 조율하고, 공사 시작 전 정부 철거 지원금(최대 250만원)을 꼭 미리 신청합니다.",
  },
  {
    id: 6,
    title: "사업자등록 및 인허가 폐업 신고",
    description:
      "세무서 사업자 폐업과 구청 영업허가 폐업을 정부24 원스톱 서비스를 통해 한 번에 처리합니다.",
  },
  {
    id: 7,
    title: "4대보험 탈퇴 및 상실 신고",
    description:
      "폐업 후 14일 이내 공단 접수 마감 기한 엄수! 건보공단에 소득 정지 조정을 신청해 보험료 폭탄을 막습니다.",
  },
  {
    id: 8,
    title: "부가가치세 및 잔존재화 신고",
    description:
      "폐업달 다음 달 25일 내 최종 세무 신고를 마칩니다. 매장에 남은 비품 세금(잔존재화) 면제 조치를 확인하세요.",
  },
  {
    id: 9,
    title: "종합소득세 신고 가이드",
    description:
      "폐업을 완료한 사장님도 다음 해 5월 정기 신고 기간을 잊지 말고 소득 정산을 마무리해야 페널티가 없습니다.",
  },
];

export default function GuideListPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const isFromAI =
    (location.state as { from?: string } | null)?.from === "ai";

  return (
    <div className={`min-h-dvh bg-gray-30 ${isFromAI ? "pb-8" : "pb-24"}`}>
      <TopBar
        title="사장님 폐업 가이드"
        bordered={false}
        onBack={isFromAI ? () => navigate(-1) : undefined}
      />
      <div className="bg-white px-4 pb-5">
        <p className="text-title-2 text-gray-900">
          안전하고 현명한 사업 마무리
        </p>
        <p className="mt-1 text-body-2 text-gray-500">
          매장 안의 물건 정리부터 세금 확정까지,
          <br />
          사장님이 발로 뛰는 순서 그대로 정렬했습니다.
        </p>
      </div>

      <div className="px-4 pt-5">
        <p className="mb-3 text-title-3 text-gray-900">단계별 가이드 목록</p>
        <div className="flex flex-col gap-3">
          {GUIDE_STEPS.map((step) => (
            <StepCard key={step.id} step={step} isFromAI={isFromAI} />
          ))}
        </div>

        <div className="mb-2 mt-4 flex items-center gap-3 rounded-2xl border border-warning-100 bg-warning-50 px-4 py-3">
          <AlertIcon className="h-6 w-6 shrink-0 text-warning-500" />
          <p className="text-subtitle-2 font-semibold text-warning-600">
            매장 안의 물건(집기)을 먼저 처분해야 인테리어 철거가 가능합니다!
          </p>
        </div>
      </div>

      {!isFromAI && <NavigationBar />}
    </div>
  );
}
