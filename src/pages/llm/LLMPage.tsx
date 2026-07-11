import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg?react';
import AlertCircleIcon from '../../assets/icons/alert-circle.svg?react';
import characterRight from '../../assets/images/character-right.png';

const PRIMARY = '#6558FF';
const PRIMARY_LIGHT = '#EEEEFF';

const CHECKLIST = [
  {
    title: '폐업 진행 상태',
    desc: '폐업 결정 여부 / 신고 여부 / 예정일',
    example: '예: "결정했고, 신고는 아직 안 했어요."',
  },
  {
    title: '임대차(가게 계약) 상태',
    desc: '계약 잔여 기간 / 해지 진행 여부',
    example: '예: "3개월 남았고 아직 해지 전이에요."',
  },
  {
    title: '재고 및 집기 상태',
    desc: '남은 재고 양 / 집기 처분 여부',
    example: '예: "재고가 많이 남았고 정리 안 했어요."',
  },
  {
    title: '직원 여부',
    desc: '직원 유무 / 퇴직 처리 여부',
    example: '예: "직원 2명 있고 정산 전이에요."',
  },
  {
    title: '기타 상황 (선택)',
    desc: '채무, 세금, 기타 고민 등',
    example: '예: "세금 신고가 걱정돼요."',
  },
];

export default function LLMPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <header
        className="flex items-center bg-white"
        style={{ height: '56px', padding: '10px 6px', borderBottom: '1px solid #EFEFF4' }}
      >
        <button onClick={() => navigate(-1)}>
          <ChevronRightIcon
            width={32}
            height={32}
            style={{ transform: 'rotate(180deg)', color: '#1C1C1C' }}
          />
        </button>
        <span
          className="flex-1 text-center text-base font-semibold leading-[150%]"
          style={{ color: '#1C1C1C' }}
        >
          AI 맞춤 계획 만들기
        </span>
        {/* 제목 중앙 정렬용 스페이서 */}
        <div style={{ width: '32px' }} />
      </header>

      {/* 스크롤 가능한 콘텐츠 */}
      <div className="flex flex-col items-center px-4 py-8 gap-5">

        {/* 캐릭터 + 타이틀 — 세로 배치, 왼쪽 정렬 */}
        <div className="flex w-full flex-col items-start gap-3">
          <div
            className="flex shrink-0 items-center justify-center"
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'linear-gradient(180deg, #CFCBFF 0%, #F7F6FF 100%)',
            }}
          >
            <img
              src={characterRight}
              alt=""
              style={{ width: '57.14px', height: '57.14px', objectFit: 'contain' }}
            />
          </div>
          <p
            className="text-xl font-semibold leading-[150%]"
            style={{ color: '#1C1C1C' }}
          >
            사장님의 상황을 알려주시면<br />맞춤 일정을 생성해 드릴게요
          </p>
        </div>

        {/* Callout 카드 */}
        <div
          className="flex w-full items-center gap-3"
          style={{
            borderRadius: '12px',
            border: '1px solid #DBDBE2',
            padding: '16px',
            backgroundColor: '#FFFFFF',
            boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.03)',
          }}
        >
          {/* 아이콘 배경 */}
          <div
            className="flex shrink-0 items-center justify-center"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '7px',
              backgroundColor: PRIMARY_LIGHT,
            }}
          >
            <AlertCircleIcon width={20} height={20} style={{ color: PRIMARY }} />
          </div>
          {/* 텍스트 */}
          <div className="flex flex-1 flex-col" style={{ gap: '2px' }}>
            <p className="text-xs font-semibold leading-[150%]" style={{ color: '#1C1C1C' }}>
              막막한 폐업 준비가 처음이시라면?
            </p>
            <p className="text-xs font-medium leading-[150%]" style={{ color: '#838286' }}>
              전체적인 절차 가이드를 먼저 읽어보세요.
            </p>
          </div>
          {/* 읽기 버튼 */}
          <button
            className="shrink-0 rounded-lg text-xs font-semibold text-white"
            style={{ backgroundColor: PRIMARY, padding: '6px 12px' }}
          >
            읽기
          </button>
        </div>

        {/* 체크리스트 박스 */}
        <div
          className="flex w-full flex-col"
          style={{
            borderRadius: '12px',
            border: '1px solid #EFEFF4',
            padding: '16px',
            gap: '16px',
            backgroundColor: '#FCFCFE',
          }}
        >
          <p className="text-sm font-medium leading-[150%]" style={{ color: '#1C1C1C' }}>
            다섯 가지만 확인해 주세요
          </p>
          <div className="flex flex-col gap-3">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* 체크 아이콘 */}
                <div className="mt-0.5 shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M5 12L10 17L19 7"
                      stroke={PRIMARY}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {/* 텍스트 3줄 */}
                <div className="flex flex-col" style={{ gap: '4px' }}>
                  <p className="text-sm font-medium leading-[150%]" style={{ color: '#1C1C1C' }}>
                    {item.title}
                  </p>
                  <p className="text-xs font-normal leading-[150%]" style={{ color: '#1C1C1C' }}>
                    {item.desc}
                  </p>
                  <p className="text-xs font-normal leading-[150%]" style={{ color: PRIMARY }}>
                    {item.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 입력창 */}
        <div
          className="flex w-full flex-col"
          style={{
            borderRadius: '12px',
            border: '1px solid #DBDBE2',
            padding: '16px',
            gap: '20px',
            backgroundColor: '#FFFFFF',
          }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="현재 폐업 상황을 알려주세요..."
            rows={2}
            className="w-full resize-none bg-transparent text-sm font-normal leading-[150%] outline-none placeholder:text-[#999999]"
            style={{ color: '#1C1C1C' }}
          />
          <div className="flex items-center justify-between">
            {/* 캐릭터 + 라벨 */}
            <div className="flex items-center gap-2">
              <div
                className="flex shrink-0 items-center justify-center"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'linear-gradient(180deg, #CFCBFF 0%, #F7F6FF 100%)',
                }}
              >
                <img
                  src={characterRight}
                  alt=""
                  style={{ width: '18px', height: '18px', objectFit: 'contain' }}
                />
              </div>
              <span
                className="text-xs font-semibold leading-[150%]"
                style={{ color: '#838286' }}
              >
                클로이와 맞춤 일정 생성하기
              </span>
            </div>
            {/* 전송 버튼 */}
            <button
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: input.length > 0 ? PRIMARY : '#DBDBE2',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 12V4M8 4L4 8M8 4L12 8"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
