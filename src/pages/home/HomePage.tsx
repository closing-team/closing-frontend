import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import TodoList from "../../components/home/TodoList";
import SideMenu from "../../components/sidemenu/SideMenu";
import { useUsedStore } from "../../stores/usedStore";
import AddPlanModal from "../../components/common/AddPlanModal";
import DayScheduleModal from "../../components/home/DayScheduleModal";
import type { Plan } from "../../components/llm/PlanCard";
import {
  MenuHamburgerIcon,
  PlusMdIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../../assets/icons";
import cubeIllust from "../../assets/images/package-banner.png";
import aiCharacter from "../../assets/images/cloy-fab.png";
import characterImg from "../../assets/images/cloy-banner.png";
import curtainImg from "../../assets/images/curtain-banner.png";
import {
  MOCK_PROGRESS,
  MOCK_SCHEDULES,
  INITIAL_TODOS,
} from "../../mocks/home/mockHome";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function ProgressCard({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const pct = Math.round((completed / total) * 100);

  return (
    <div
      className="mx-4 flex flex-col justify-between"
      style={{
        height: "148px",
        borderRadius: "12px",
        padding: "20px 16px 28px 16px",
        background:
          "linear-gradient(165deg, #4A3BF2 0%, #6659FF 50%, #9389FF 70%, #BDB7FF 85%, #D7D4FF 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <p className="text-title-3 text-white">전체 진행률</p>
        <p className="text-caption-2 text-white">
          총 {total}개의 작업 중 {completed}개 완료
        </p>
      </div>

      {/* 중단: % + 일러스트 */}
      <div className="flex items-center justify-between">
        <p
          className="font-bold text-white"
          style={{
            fontSize: "40px",
            lineHeight: "160%",
            letterSpacing: "-0.02em",
          }}
        >
          {pct}%
        </p>
        <img
          src={cubeIllust}
          alt=""
          style={{ width: "40px", height: "43px", objectFit: "contain" }}
        />
      </div>

      {/* 하단: 진행 바 */}
      <div className="h-2 w-full rounded-full bg-primary-400">
        <div
          className="h-2 rounded-full bg-white transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EmptyCard() {
  return (
    <div
      className="mx-4 relative overflow-hidden flex items-center justify-between"
      style={{
        height: "148px",
        borderRadius: "12px",
        background:
          "linear-gradient(190deg, #4B3BF3 0%, #7F74F9 70%, #9C94FC 90%, #C4BFFF 100%)",
      }}
    >
      <img
        src={curtainImg}
        alt=""
        className="absolute top-0 left-0 w-full object-cover z-0"
      />

      <div className="relative z-10 pl-5 self-end pb-10">
        <p className="text-body-2 text-gray-100">막막한 폐업 준비,</p>
        <p className="text-title-3 text-white">
          클로징이 순서대로 도와드릴게요.
        </p>
      </div>

      {/* 캐릭터 - 우측 (z-20, 커튼 앞) */}
      <img
        src={characterImg}
        alt=""
        className="relative z-20"
        style={{
          width: "93.25px",
          height: "108.47px",
          objectFit: "contain",
          marginRight: "16px",
          marginTop: "20px",
        }}
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
  onAddPlan,
  onDayClick,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  schedules: Record<string, Plan[]>;
  onAddPlan: () => void;
  onDayClick: (date: Date, plans: Plan[]) => void;
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

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();
  const todayCellIndex = isCurrentMonth ? firstDay + today.getDate() - 1 : 0;
  const collapsedRowStart = Math.floor(todayCellIndex / 7) * 7;
  const visibleCells = isExpanded
    ? cells
    : cells.slice(collapsedRowStart, collapsedRowStart + 7);

  return (
    <div className="pt-6">
      {/* 섹션 1: 헤더 - 상단 radius 24px, 그림자 없음 */}
      <div className="rounded-t-[24px] bg-white px-4 pt-4 pb-4">
        <div className="relative flex items-center justify-center">
          <div className="flex items-center gap-5">
            <button type="button" onClick={onPrev} className="text-gray-900">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <span className="text-title-3 text-gray-900">
              {year}년 {month + 1}월
            </span>
            <button type="button" onClick={onNext} className="text-gray-900">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
          </div>
          <button type="button" onClick={onAddPlan} className="absolute right-0 text-gray-900">
            <PlusMdIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* 섹션 2: 날짜 그리드 - 그림자 없음 */}
      <div className="bg-white px-4 pb-2">
        <div className="mb-1 grid grid-cols-7">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="py-1 text-center text-caption-2 text-gray-500"
            >
              {label}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {visibleCells.map((cell, i) => {
            const dateKey = cell.currentMonth
              ? toDateKey(year, month, cell.day)
              : "";
            const events = dateKey ? (schedules[dateKey] ?? []) : [];
            const today_ = cell.currentMonth && isToday(cell.day);

            const handleCellClick = () => {
              if (isExpanded && cell.currentMonth && events.length > 0) {
                onDayClick(new Date(year, month, cell.day), events);
              }
            };

            return (
              <div
                key={i}
                onClick={handleCellClick}
                className={`flex flex-col items-center py-1 ${
                  isExpanded && cell.currentMonth && events.length > 0
                    ? "cursor-pointer"
                    : ""
                } ${isExpanded ? "min-h-[101.6px]" : "min-h-[52px]"}`}
              >
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-caption-3 ${
                    today_
                      ? "bg-primary-500 text-white"
                      : cell.currentMonth
                        ? "text-gray-900"
                        : "text-gray-200"
                  }`}
                >
                  {cell.day}
                </div>
                <div className="mt-0.5 w-full px-0.5">
                  {events.length > 0 &&
                    (isExpanded ? (
                      <div className="space-y-0.5">
                        {events.slice(0, 2).map((ev, j) => (
                          <div
                            key={j}
                            className="truncate rounded bg-primary-50 px-0.5 text-[9px] leading-[14px] text-primary-500"
                          >
                            {ev.title}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-1 w-full rounded-full bg-primary-100" />
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 섹션 3: 토글 - 독립 블럭, 높이 32px, 하단 radius 24px, 아래 방향 드롭섀도우만 */}
      <button
        type="button"
        aria-label={isExpanded ? "캘린더 접기" : "캘린더 펼치기"}
        onClick={() => setIsExpanded((v) => !v)}
        className="flex h-8 w-full items-center justify-center rounded-b-[24px] bg-white text-gray-500 shadow-[0_4px_8px_0_rgba(0,0,0,0.08)]"
      >
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5" />
        ) : (
          <ChevronDownIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}

// ─── 홈 페이지 ────────────────────────────────────────────────
export default function HomePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [todos, setTodos] = useState(INITIAL_TODOS);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const navigate = useNavigate();
  const authenticated = useUsedStore((s) => s.authenticated);
  const products = useUsedStore((s) => s.products);
  const messagesByProduct = useUsedStore((s) => s.messagesByProduct);
  const interestCount = products.filter((p) => p.liked).length;
  const chatCount = Object.keys(messagesByProduct).length;

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
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* 헤더 */}
      <TopBar
        logo
        bordered={false}
        right={
          <button
            type="button"
            aria-label="전체 메뉴"
            className="p-1 text-gray-900"
            onClick={() => setIsSideMenuOpen(true)}
          >
            <MenuHamburgerIcon />
          </button>
        }
      />

      <SideMenu
        open={isSideMenuOpen}
        onClose={() => setIsSideMenuOpen(false)}
        verified={authenticated}
        interestCount={interestCount}
        chatCount={chatCount}
      />

      {todos.length === 0 ? <EmptyCard /> : <ProgressCard {...MOCK_PROGRESS} />}

      <Calendar
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        schedules={MOCK_SCHEDULES}
        onAddPlan={() => setIsAddingPlan(true)}
        onDayClick={(date, plans) => {
          setSelectedDate(date);
          setSelectedPlans(plans);
        }}
      />

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex h-12 items-center justify-between pl-[18px] pr-4">
          <h2 className="text-title-3 text-gray-900">오늘의 일정</h2>
          {/* 할일 추가 버튼 — HOME004 모달 연동 예정 */}
          <button
            type="button"
            aria-label="할 일 추가"
            className="text-gray-700"
          >
            <PlusMdIcon className="h-5 w-5" />
          </button>
        </div>
        <TodoList todos={todos} onToggle={handleToggle} />
      </div>

      {/* AI 맞춤 계획 버튼 — LLM001 연동 예정 */}
      <Fab
        variant="llm"
        icon={
          <img src={aiCharacter} alt="" className="h-6 w-6 object-contain" />
        }
        label="AI 맞춤 계획"
        onClick={() => navigate("/ai")}
      />

      <NavigationBar />

      {isAddingPlan && (
        <AddPlanModal
          onCancel={() => setIsAddingPlan(false)}
          onConfirm={() => setIsAddingPlan(false)}
        />
      )}

      {selectedDate && (
        <DayScheduleModal
          date={selectedDate}
          plans={selectedPlans}
          onClose={() => setSelectedDate(null)}
          onAdd={() => {
            setSelectedDate(null);
            setIsAddingPlan(true);
          }}
        />
      )}
    </div>
  );
}
