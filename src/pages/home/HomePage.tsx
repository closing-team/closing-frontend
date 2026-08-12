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
import PlanFormModal from "../../components/common/PlanFormModal";
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
  taskDetailToPlan,
  toPlans,
  toTodayTodos,
  toTaskRequest,
} from "../../utils/scheduleAdapter";
import {
  assignPlanLanes,
  buildMonthCells,
  buildWeekSegments,
  isSameDay,
  plansOnDate,
  toWeeks,
} from "../../utils/calendarLayout";
import type { CalendarCell } from "../../utils/calendarLayout";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const MAX_LANES = 3;
const LANE_HEIGHT = { collapsed: 4, expanded: 14 };
const LANE_GAP = 2;

function WeekRow({
  week,
  plans,
  lanes,
  isExpanded,
  today,
  onDayClick,
}: {
  week: CalendarCell[];
  plans: Plan[];
  lanes: Map<Plan["id"], number>;
  isExpanded: boolean;
  today: Date;
  onDayClick: (date: Date, plans: Plan[]) => void;
}) {
  const segments = buildWeekSegments(week, plans, lanes).filter(
    (segment) => segment.lane < MAX_LANES,
  );
  const laneHeight = isExpanded
    ? LANE_HEIGHT.expanded
    : LANE_HEIGHT.collapsed;

  return (
    <div
      className={`relative ${isExpanded ? "min-h-[101.6px]" : "min-h-[52px]"}`}
    >
      <div className="absolute inset-0 grid grid-cols-7">
        {week.map((cell) => {
          const dayPlans = cell.currentMonth ? plansOnDate(plans, cell.date) : [];

          if (!isExpanded || !cell.currentMonth || dayPlans.length === 0) {
            return <div key={cell.date.toISOString()} />;
          }

          return (
            <button
              key={cell.date.toISOString()}
              type="button"
              aria-label={`${cell.date.getMonth() + 1}월 ${cell.day}일 일정 보기`}
              onClick={() => onDayClick(cell.date, dayPlans)}
            />
          );
        })}
      </div>

      <div className="pointer-events-none relative pt-1">
        <div className="grid grid-cols-7">
          {week.map((cell) => (
            <div key={cell.date.toISOString()} className="flex justify-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-caption-3 ${
                  cell.currentMonth && isSameDay(cell.date, today)
                    ? "bg-primary-500 text-white"
                    : cell.currentMonth
                      ? "text-gray-900"
                      : "text-gray-200"
                }`}
              >
                {cell.day}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-0.5 grid grid-cols-7"
          style={{
            gridTemplateRows: `repeat(${MAX_LANES}, ${laneHeight}px)`,
            rowGap: `${LANE_GAP}px`,
          }}
        >
          {segments.map((segment) => (
            <div
              key={`${segment.plan.id}-${segment.startCol}`}
              style={{
                gridColumn: `${segment.startCol + 1} / ${segment.endCol + 2}`,
                gridRow: segment.lane + 1,
              }}
              className={`min-w-0 ${segment.isStart ? "ml-0.5" : ""} ${segment.isEnd ? "mr-0.5" : ""}`}
            >
              {isExpanded ? (
                <div
                  className={`h-full truncate bg-primary-50 px-1 text-[9px] leading-[14px] text-primary-500 ${segment.isStart ? "rounded-l" : ""} ${segment.isEnd ? "rounded-r" : ""}`}
                >
                  {segment.plan.title}
                </div>
              ) : (
                <div
                  className={`h-full bg-primary-100 ${segment.isStart ? "rounded-l-full" : ""} ${segment.isEnd ? "rounded-r-full" : ""}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Calendar({
  year,
  month,
  onPrev,
  onNext,
  plans,
  onAddPlan,
  onDayClick,
}: {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
  plans: Plan[];
  onAddPlan: () => void;
  onDayClick: (date: Date, plans: Plan[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const today = new Date();

  const weeks = toWeeks(buildMonthCells(year, month));
  const lanes = assignPlanLanes(plans);

  const todayWeekIndex = weeks.findIndex((week) =>
    week.some((cell) => cell.currentMonth && isSameDay(cell.date, today)),
  );
  const visibleWeeks = isExpanded
    ? weeks
    : [weeks[todayWeekIndex === -1 ? 0 : todayWeekIndex]];

  return (
    <div className="pt-6">
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

        {visibleWeeks.map((week) => (
          <WeekRow
            key={week[0].date.toISOString()}
            week={week}
            plans={plans}
            lanes={lanes}
            isExpanded={isExpanded}
            today={today}
            onDayClick={onDayClick}
          />
        ))}
      </div>

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

export default function HomePage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const navigate = useNavigate();
  const { bookmarkCount, interestCount, chatCount } = useSideMenuCounts();

  const yearMonth = `${year}-${String(month + 1).padStart(2, "0")}`;
  const { data: homeData, isLoading: isHomeLoading } = useHomeTasksQuery(yearMonth);

  const calendarItems = homeData?.calendar ?? [];
  const plans = toPlans(calendarItems);
  const todos = toTodayTodos(calendarItems);
  const progress = {
    completed: homeData?.summary.completedCount ?? 0,
    total: homeData?.summary.totalCount ?? 0,
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
    <div className="min-h-dvh bg-white pb-24">
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
        plans={plans}
        onAddPlan={() => setIsAddingPlan(true)}
        onDayClick={(date) => {
          setSelectedDate(date);
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
          plans={plansOnDate(plans, selectedDate)}
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
        <PlanFormModal
          initialDate={selectedDate ?? undefined}
          isPending={createMutation.isPending}
          onCancel={() => setIsAddingPlan(false)}
          onConfirm={(plan, memo) => {
            createMutation.mutate(toTaskRequest(plan, memo));
            setIsAddingPlan(false);
          }}
        />
      )}

      {isEditing && selectedPlanWithMemo && (
        <PlanFormModal
          plan={selectedPlanWithMemo}
          isPending={updateMutation.isPending}
          onCancel={() => setIsEditing(false)}
          onConfirm={(updated, memo) => {
            updateMutation.mutate(
              {
                taskId: Number(updated.id),
                request: toTaskRequest(updated, memo),
              },
              {
                onSuccess: () => {
                  setIsEditing(false);
                  setSelectedPlan(null);
                  setSelectedDate(null);
                },
              },
            );
          }}
        />
      )}

      {isDeleting && selectedPlan && (
        <DeleteConfirmModal
          plan={selectedPlan}
          isPending={deleteMutation.isPending}
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