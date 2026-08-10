import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/common/NavigationBar";
import TopBar from "../../components/common/TopBar";
import Fab from "../../components/common/Fab";
import TodoList from "../../components/home/TodoList";
import Banner from "../../components/home/Banner";
import {
  BannerSkeleton,
  TodoListSkeleton,
} from "../../components/home/HomeContentSkeleton";
import SideMenu from "../../components/sidemenu/SideMenu";
import { useSideMenuCounts } from "../../hooks/useSideMenuCounts";
import { ROUTES } from "../../constants/routes";
import AddPlanModal from "../../components/home/AddPlanModal";
import EditPlanModal from "../../components/ai/EditPlanModal";
import DayScheduleModal from "../../components/home/DayScheduleModal";
import ScheduleDetailModal from "../../components/home/ScheduleDetailModal";
import DeleteConfirmModal from "../../components/home/DeleteConfirmModal";
import type { Plan } from "../../components/common/PlanCard";
import {
  MenuHamburgerIcon,
  PlusMdIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "../../assets/icons";
import cloyTransparent from "../../assets/images/cloy-transparent.png";
import {
  useCompleteTaskMutation,
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useHomeTasksQuery,
  useTaskDetailQuery,
  useUpdateTaskMutation,
} from "../../hooks/useSchedule";
import {
  groupPlansByDate,
  taskDetailToPlan,
  toTodayTodos,
  toTaskRequest,
} from "../../utils/scheduleAdapter";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
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
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPlans, setSelectedPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();
  const { bookmarkCount, interestCount, chatCount } = useSideMenuCounts();

  const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
  const { data: homeData, isLoading: isHomeLoading } = useHomeTasksQuery(yearMonth);

  const calendarItems = homeData?.calendar ?? [];
  const schedules = groupPlansByDate(calendarItems);
  const todos = toTodayTodos(calendarItems);
  const progress = {
    completed: homeData?.summary.completedCount ?? 0,
    total: homeData?.summary.totalCount ?? 1,
  };

  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const completeMutation = useCompleteTaskMutation();

  const { data: selectedTaskDetail } = useTaskDetailQuery(
    selectedPlan ? Number(selectedPlan.id) : undefined,
  );
  const selectedPlanWithMemo = selectedTaskDetail
    ? taskDetailToPlan(selectedTaskDetail)
    : selectedPlan;

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
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    completeMutation.mutate({ taskId: id, isCompleted: !todo.done });
  };

  return (
    <div className="min-h-screen bg-white pb-24">
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
        bookmarkCount={bookmarkCount}
        interestCount={interestCount}
        chatCount={chatCount}
      />

      {isHomeLoading ? <BannerSkeleton /> : <Banner {...progress} />}

      <Calendar
        year={year}
        month={month}
        onPrev={handlePrevMonth}
        onNext={handleNextMonth}
        schedules={schedules}
        onAddPlan={() => setIsAddingPlan(true)}
        onDayClick={(date, plans) => {
          setSelectedDate(date);
          setSelectedPlans(plans);
        }}
      />

      <div className="mt-4 flex flex-col gap-2">
        <div className="flex h-12 items-center pl-[18px] pr-4">
          <h2 className="text-title-3 text-gray-900">오늘의 일정</h2>
        </div>
        {isHomeLoading ? (
          <TodoListSkeleton />
        ) : (
          <TodoList todos={todos} onToggle={handleToggle} />
        )}
      </div>

      <Fab
        variant="ai"
        icon={
          <img
            src={cloyTransparent}
            alt=""
            className="h-6 w-[17px] shrink-0 object-contain"
          />
        }
        label="AI 맞춤 계획"
        onClick={() => navigate(ROUTES.AI)}
      />

      <NavigationBar />

      {selectedDate && !selectedPlan && !isAddingPlan && (
        <DayScheduleModal
          date={selectedDate}
          plans={selectedPlans}
          onClose={() => setSelectedDate(null)}
          onAdd={() => setIsAddingPlan(true)}
          onPlanClick={(plan) => setSelectedPlan(plan)}
        />
      )}

      {selectedDate && selectedPlan && !isEditing && !isDeleting && (
        <ScheduleDetailModal
          date={selectedDate}
          plan={selectedPlan}
          detail={selectedTaskDetail?.description}
          onBack={() => setSelectedPlan(null)}
          onClose={() => {
            setSelectedPlan(null);
            setSelectedDate(null);
          }}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleting(true)}
        />
      )}

      {isAddingPlan && (
        <AddPlanModal
          onCancel={() => setIsAddingPlan(false)}
          onConfirm={(plan, memo) => {
            createMutation.mutate(toTaskRequest(plan, memo));
            setIsAddingPlan(false);
          }}
        />
      )}

      {isEditing && selectedPlanWithMemo && (
        <EditPlanModal
          plan={selectedPlanWithMemo}
          onCancel={() => setIsEditing(false)}
          onConfirm={(updated, memo) => {
            updateMutation.mutate({
              taskId: Number(updated.id),
              request: toTaskRequest(updated, memo ?? ""),
            });
            setIsEditing(false);
            setSelectedPlan(null);
            setSelectedDate(null);
          }}
        />
      )}

      {isDeleting && selectedPlan && (
        <DeleteConfirmModal
          plan={selectedPlan}
          onCancel={() => setIsDeleting(false)}
          onConfirm={() => {
            deleteMutation.mutate(Number(selectedPlan.id));
            setIsDeleting(false);
            setSelectedPlan(null);
            setSelectedDate(null);
          }}
        />
      )}
    </div>
  );
}