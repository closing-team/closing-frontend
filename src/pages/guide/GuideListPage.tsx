import { Link } from 'react-router-dom';
import BottomTabBar from '../../components/layout/BottomTabBar';
import checkIcon from '../../assets/icons/check-02.svg';
import chevronRightIcon from '../../assets/icons/chevron-right.svg';

interface GuideStep {
  id: number;
  title: string;
  description: string;
}

const GUIDE_STEPS: GuideStep[] = [
  {
    id: 1,
    title: '영업 종료일(폐업일) 산정 가이드',
    description:
      '매장 안의 물건 정리부터 세금 확정까지, 사장님이 발로 뛰는 순서 그대로 정렬했습니다.',
  },
  {
    id: 2,
    title: '임대차 계약 해지 통보 및 조율',
    description:
      '보증금 반환 분쟁과 월세 이중 지출을 막기 위해 최소 1~3개월 전 건물주에게 해지 의사를 전달합니다.',
  },
  {
    id: 3,
    title: '직원 퇴사 및 해고 예고 통보',
    description:
      '인사 분쟁을 방지하기 위해 30일 전 통보 필수! 근로자 사직서 확보 등 노무 리스크를 선제 해결합니다.',
  },
  {
    id: 4,
    title: '재고·집기 처분 가이드',
    description:
      '주방 설비 중고 매각으로 손실을 최소화하고 정수기, POS 등 대여 상품 중도해지를 협의합니다.',
  },
  {
    id: 5,
    title: '매장 철거 및 원상복구 가이드',
    description:
      '인테리어 철거 범위를 조율하고, 공사 시작 전 정부 철거 지원금(최대 250만원)을 꼭 미리 신청합니다.',
  },
  {
    id: 6,
    title: '사업자등록 및 인허가 폐업 신고',
    description:
      '세무서 사업자 폐업과 구청 영업허가 폐업을 정부24 원스톱 서비스를 통해 한 번에 처리합니다.',
  },
  {
    id: 7,
    title: '4대보험 탈퇴 및 상실 신고',
    description:
      '폐업 후 14일 이내 공단 접수 마감 기한 엄수! 건보공단에 소득 정지 조정을 신청해 보험료 폭탄을 막습니다.',
  },
  {
    id: 8,
    title: '부가가치세 및 잔존재화 신고',
    description:
      '폐업달 다음 달 25일 내 최종 세무 신고를 마칩니다. 매장에 남은 비품 세금(잔존재화) 면제 조치를 확인하세요.',
  },
  {
    id: 9,
    title: '종합소득세 신고 가이드',
    description:
      '폐업을 완료한 사장님도 다음 해 5월 정기 신고 기간을 잊지 말고 소득 정산을 마무리해야 페널티가 없습니다.',
  },
];

function GuideCard({ step }: { step: GuideStep }) {
  return (
    // TODO: (GUIDE002) 상세 페이지 구현 후 실제 컴포넌트로 교체
    <Link
      to={`/guide/${step.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-sm active:opacity-75"
    >
      <img src={checkIcon} alt="" className="h-6 w-6 shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-900">
          {step.id}. {step.title}
        </p>
        <p className="mt-1 text-xs leading-relaxed text-gray-500">{step.description}</p>
      </div>
      <img src={chevronRightIcon} alt="" className="h-6 w-6 shrink-0" />
    </Link>
  );
}

export default function GuideListPage() {
  // TODO: (GUIDE001) API 연동 시 여기서 가이드 데이터를 fetch
  //   - 로드 실패 시 토스트 메시지 표시 + 재시도 버튼 제공

  return (
    <div className="min-h-screen bg-[#F8F8F9] pb-20">
      {/* 헤더 */}
      <div className="bg-white px-5 pb-5 pt-6">
        <h1 className="text-xl font-bold text-gray-900">사장님 폐업 가이드</h1>
        <div className="mt-4">
          <p className="text-lg font-bold text-gray-900">안전하고 현명한 사업 마무리</p>
          <p className="mt-1 text-sm leading-relaxed text-gray-500">
            매장 안의 물건 정리부터 세금 확정까지,
            <br />
            사장님이 발로 뛰는 순서 그대로 정렬했습니다.
          </p>
        </div>
      </div>

      {/* 가이드 목록 */}
      <div className="px-4 pt-5">
        <p className="mb-3 text-sm font-bold text-gray-800">단계별 가이드 목록</p>
        <div className="flex flex-col gap-3">
          {GUIDE_STEPS.map((step) => (
            <GuideCard key={step.id} step={step} />
          ))}
        </div>

        {/* 경고 배너 */}
        <div className="mb-2 mt-4 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-400">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M7 2.5V7.5M7 9.5V10.5"
                stroke="white"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p className="text-sm font-bold leading-snug text-red-600">
            매장 안의 물건(집기)을 먼저 처분해야 인테리어 철거가 가능합니다!
          </p>
        </div>
      </div>

      <BottomTabBar />
    </div>
  );
}
