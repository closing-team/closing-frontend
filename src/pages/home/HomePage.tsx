import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomTabBar from '../../components/layout/BottomTabBar';
import MenuIcon from '../../assets/icons/menu-01.svg?react';
import PlusIcon from '../../assets/icons/plus-02.svg?react';
import ChevronRightIcon from '../../assets/icons/chevron-right.svg?react';
import cubeIllust from '../../assets/images/progress-cube.png';
import aiCharacter from '../../assets/images/ai-character.png';
import closingLogo from '../../assets/images/closing-logo.png';
import characterImg from '../../assets/images/character.png';
import curtainImg from '../../assets/images/curtain.png';

const ACCENT = '#6558FF';

// Mock data — API 연동 전 임시 데이터
const MOCK_PROGRESS = { completed: 8, total: 12 };

const MOCK_SCHEDULES: Record<string, string[]> = {
  '2026-07-03': ['직원 정리'],
  '2026-07-07': ['점포 정리'],
  '2026-07-09': ['집기 중고 거래', '세금 신고'],
  '2026-07-15': ['각종 해지하기'],
};

type Todo = { id: number; text: string; done: boolean };

const INITIAL_TODOS: Todo[] = [
  { id: 1, text: '점포 정리', done: true },
  { id: 2, text: '집기 중고 거래', done: false },
  { id: 3, text: '세금 신고', done: false },
];

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ─── 진행률 카드 ─────────────────────────────────────────────
function ProgressCard({ completed, total }: { completed: number; total: number }) {
  const pct = Math.round((completed / total) * 100);

  return (
    <div
      className="mx-4 flex flex-col justify-between"
      style={{
        height: '148px',
        borderRadius: '12px',
        padding: '20px 16px 28px 16px',
        background: 'linear-gradient(165deg, #4A3BF2 0%, #6659FF 50%, #9389FF 70%, #BDB7FF 85%, #D7D4FF 100%)',
      }}
    >
      {/* 상단: 라벨 + 작업 수 */}
      <div className="flex items-center justify-between">
        <p className="text-base font-semibold leading-[150%] text-white">전체 진행률</p>
        <p className="text-xs font-medium leading-[150%] text-white">
          총 {total}개의 작업 중 {completed}개 완료
        </p>
      </div>

      {/* 중단: % + 일러스트 */}
      <div className="flex items-center justify-between">
        <p className="font-bold text-white" style={{ fontSize: '40px', lineHeight: '160%', letterSpacing: '-0.02em' }}>{pct}%</p>
        <img src={cubeIllust} alt="" style={{ width: '40px', height: '43px', objectFit: 'contain' }} />
      </div>

      {/* 하단: 진행 바 */}
      <div className="w-full rounded-full" style={{ height: '8px', backgroundColor: '#8479FF' }}>
        <div
          className="rounded-full bg-white transition-all duration-300"
          style={{ width: `${pct}%`, height: '8px' }}
        />
      </div>
    </div>
  );
}

// ─── 빈 상태 카드 ────────────────────────────────────────────
function EmptyCard() {
  return (
    <div
      className="mx-4 relative overflow-hidden flex items-center justify-between"
      style={{
        height: '148px',
        borderRadius: '12px',
        background: 'linear-gradient(190deg, #4B3BF3 0%, #7F74F9 70%, #9C94FC 90%, #C4BFFF 100%)',
      }}
    >
      {/* 커튼 - 상단 장식 (z-0, 가장 뒤) */}
      <img src={curtainImg} alt="" className="absolute top-0 left-0 w-full object-cover z-0" />

      {/* 텍스트 - 좌측 (z-10) */}
      <div className="relative z-10 pl-5 self-end pb-10">
        <p className="text-sm font-normal leading-[150%]" style={{ color: '#EFEFF4' }}>
          막막한 폐업 준비,
        </p>
        <p className="text-base font-semibold leading-[150%] text-white">
          클로징이 순서대로 도와드릴게요.
        </p>
      </div>

      {/* 캐릭터 - 우측 (z-20, 커튼 앞) */}
      <img
        src={characterImg}
        alt=""
        className="relative z-20"
        style={{ width: '93.25px', height: '108.47px', objectFit: 'contain', marginRight: '16px', marginTop:'20px' }}
      />
    </div>
  );
}

// ─── 캘린더 ──────────────────────────────────────────────────
function Calendar({
  year,
  month,
  onPrev,
  onNext,
  schedules,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  schedules: Record<string, string[]>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells: { day: number; currentMonth: boolean }[] = [];

  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, currentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, currentMonth: true });
  }
  for (let d = 1; cells.length < totalCells; d++) {
    cells.push({ day: d, currentMonth: false });
  }

  const isToday = (d: number) =>
    year === today.getFullYear() &&
    month === today.getMonth() &&
    d === today.getDate();

  // 접힌 상태: 오늘이 속한 주(현재 월) 또는 첫 번째 주(다른 월)만 표시
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const todayCellIndex = isCurrentMonth ? firstDay + today.getDate() - 1 : 0;
  const collapsedRowStart = Math.floor(todayCellIndex / 7) * 7;
  const visibleCells = isExpanded ? cells : cells.slice(collapsedRowStart, collapsedRowStart + 7);

  return (
    <div className="px-4 pt-6">
      <div className="rounded-2xl bg-white px-4 pb-2 pt-4 shadow-[0_2px_12px_0_rgba(0,0,0,0.08)]">
        {/* 월 네비게이션 */}
        <div className="mb-4 flex items-center">
          {/* < 2026년 N월 > — 중앙 정렬 */}
          <div className="flex flex-1 items-center justify-center gap-1">
            <button onClick={onPrev} className="p-1">
              <ChevronRightIcon
                width={24}
                height={24}
                style={{ transform: 'rotate(180deg)', color: '#1C1C1C' }}
              />
            </button>
            <span className="text-base font-semibold leading-[150%]" style={{ color: '#1C1C1C' }}>
              {year}년 {month + 1}월
            </span>
            <button onClick={onNext} className="p-1">
              <ChevronRightIcon width={24} height={24} style={{ color: '#1C1C1C' }} />
            </button>
          </div>
          {/* 일정 추가 버튼 — HOME003 모달 연동 예정 */}
          <button className="p-1">
            <PlusIcon width={32} height={32} style={{ color: '#1C1C1C' }} />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="mb-1 grid grid-cols-7">
          {DAY_LABELS.map((label) => (
            <div key={label} className="py-1 text-center text-xs font-medium leading-[150%]" style={{ color: '#838286' }}>
              {label}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {visibleCells.map((cell, i) => {
            const dateKey = cell.currentMonth ? toDateKey(year, month, cell.day) : '';
            const events = dateKey ? (schedules[dateKey] ?? []) : [];
            const today_ = cell.currentMonth && isToday(cell.day);

            return (
              // 날짜 클릭 시 HOME005 일정 리스트 팝업 — 추후 연동
              <div
                key={i}
                className="flex min-h-[52px] cursor-pointer flex-col items-center py-1"
              >
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full font-medium leading-[140%]"
                  style={
                    today_
                      ? { fontSize: '10px', backgroundColor: ACCENT, color: '#FFFFFF' }
                      : { fontSize: '10px', color: cell.currentMonth ? '#1C1C1C' : '#DBDBE2' }
                  }
                >
                  {cell.day}
                </div>
                <div className="mt-0.5 w-full px-0.5">
                  {events.length > 0 && (
                    isExpanded ? (
                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((ev, j) => (
                          <div
                            key={j}
                            className="truncate rounded px-0.5 text-[9px] leading-[14px]"
                            style={{ color: ACCENT, backgroundColor: '#EEEEFF' }}
                          >
                            {ev}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-1 w-full rounded-full" style={{ backgroundColor: '#CFCBFF' }} />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 접기/펼치기 버튼 */}
        <button
          onClick={() => setIsExpanded((v) => !v)}
          className="mt-1 flex w-full items-center justify-center py-2"
        >
          <ChevronRightIcon
            width={20}
            height={20}
            style={{
              transform: isExpanded ? 'rotate(-90deg)' : 'rotate(90deg)',
              color: '#838286',
              transition: 'transform 0.2s',
            }}
          />
        </button>
      </div>
    </div>
  );
}

// ─── 오늘의 일정 ──────────────────────────────────────────────
function TodoList({
  todos,
  onToggle,
}: {
  todos: Todo[];
  onToggle: (id: number) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <div
        className="flex items-center justify-between"
        style={{ height: '48px', padding: '10px 16px 10px 18px' }}
      >
        <h2 className="text-base font-semibold leading-[150%]" style={{ color: '#1C1C1C' }}>오늘의 일정</h2>
        {/* 할일 추가 버튼 — HOME004 모달 연동 예정 */}
        <button>
          <PlusIcon width={20} height={20} style={{ color: '#3F3F3F' }} />
        </button>
      </div>
      <div className="space-y-4 px-[18px]">
        {todos.map((todo) => (
          <button
            key={todo.id}
            onClick={() => onToggle(todo.id)}
            className="flex w-full items-center gap-3 text-left"
          >
            <div
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2"
              style={
                todo.done
                  ? { backgroundColor: ACCENT, borderColor: ACCENT }
                  : { borderColor: '#DBDBE2' }
              }
            >
              {todo.done && (
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <span
              className="text-sm"
              style={{
                color: todo.done ? '#999999' : '#1C1C1C',
                textDecoration: todo.done ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 홈 페이지 ────────────────────────────────────────────────
export default function HomePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const navigate = useNavigate();

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else {
      setMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else {
      setMonth((m) => m + 1);
    }
  };

  const handleToggle = (id: number) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-4">
        <img src={closingLogo} alt="클로징" style={{ width: '49px', height: '18px', objectFit: 'contain' }} />
        {/* 햄버거 — HOME002 사이드 메뉴 연동 예정 */}
        <button>
          <MenuIcon width={24} height={24} style={{ color: '#1C1C1C' }} />
        </button>
      </header>

      {/* 진행률 카드 — 일정 없으면 빈 상태 카드 표시 */}
      {todos.length === 0 ? <EmptyCard /> : <ProgressCard {...MOCK_PROGRESS} />}

      {/* 캘린더 */}
      <Calendar
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        schedules={MOCK_SCHEDULES}
      />

      {/* 오늘의 일정 */}
      {todos.length === 0 ? (
        <div className="mt-4 flex flex-col gap-2">
          {/* 오늘의 일정 헤더 */}
          <div
            className="flex items-center justify-between"
            style={{ height: '48px', padding: '10px 16px 10px 18px' }}
          >
            <h2 className="text-base font-semibold leading-[150%]" style={{ color: '#1C1C1C' }}>오늘의 일정</h2>
            {/* 할일 추가 버튼 — HOME004 모달 연동 예정 */}
            <button>
              <PlusIcon width={20} height={20} style={{ color: '#3F3F3F' }} />
            </button>
          </div>
          {/* 빈 상태 메시지 */}
          <div className="flex flex-col px-[18px]">
            <p className="text-base font-medium leading-[150%]" style={{ color: '#838286' }}>새 일정을 추가해 보세요!</p>
          </div>
        </div>
      ) : (
        <TodoList todos={todos} onToggle={handleToggle} />
      )}

      {/* AI 맞춤 계획 버튼 — LLM001 연동 예정 */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          onClick={() => navigate('/ai')}
          className="flex items-center text-sm font-semibold text-white shadow-lg"
          style={{
            backgroundColor: ACCENT,
            width: '140px',
            height: '48px',
            borderRadius: '50px',
            paddingTop: '12px',
            paddingBottom: '12px',
            paddingLeft: '16px',
            paddingRight: '18px',
            gap: '4px',
          }}
        >
          <img src={aiCharacter} alt="" className="h-6 w-6 object-contain" />
          AI 맞춤 계획
        </button>
      </div>

      <BottomTabBar />
    </div>
  );
}
