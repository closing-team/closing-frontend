import type { Plan } from "../components/common/PlanCard";

const MS_PER_DAY = 86_400_000;

export const DAYS_PER_WEEK = 7;

export interface CalendarCell {
  date: Date;
  day: number;
  currentMonth: boolean;
}

export interface CalendarBarSegment {
  plan: Plan;
  lane: number;
  startCol: number;
  endCol: number;
  isStart: boolean;
  isEnd: boolean;
}

export function toDayIndex(date: Date): number {
  return Math.floor(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY,
  );
}

export function isSameDay(a: Date, b: Date): boolean {
  return toDayIndex(a) === toDayIndex(b);
}

function planRange(plan: Plan): [number, number] {
  const start = toDayIndex(plan.startDate);
  return [start, Math.max(start, toDayIndex(plan.endDate))];
}

export function buildMonthCells(year: number, month: number): CalendarCell[] {
  const leadingDays = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalCells =
    Math.ceil((leadingDays + daysInMonth) / DAYS_PER_WEEK) * DAYS_PER_WEEK;

  return Array.from({ length: totalCells }, (_, index) => {
    const date = new Date(year, month, index - leadingDays + 1);
    return {
      date,
      day: date.getDate(),
      currentMonth: date.getMonth() === month,
    };
  });
}

export function toWeeks(cells: CalendarCell[]): CalendarCell[][] {
  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += DAYS_PER_WEEK) {
    weeks.push(cells.slice(i, i + DAYS_PER_WEEK));
  }
  return weeks;
}

export function plansOnDate(plans: Plan[], date: Date): Plan[] {
  const target = toDayIndex(date);
  return plans.filter((plan) => {
    const [start, end] = planRange(plan);
    return start <= target && target <= end;
  });
}

export function assignPlanLanes(plans: Plan[]): Map<Plan["id"], number> {
  const ordered = [...plans].sort((a, b) => {
    const [aStart, aEnd] = planRange(a);
    const [bStart, bEnd] = planRange(b);
    if (aStart !== bStart) return aStart - bStart;
    if (aEnd - aStart !== bEnd - bStart) return bEnd - bStart - (aEnd - aStart);
    return String(a.id).localeCompare(String(b.id));
  });

  const lanes = new Map<Plan["id"], number>();
  const occupiedDaysByLane: Set<number>[] = [];

  for (const plan of ordered) {
    const [start, end] = planRange(plan);
    let lane = 0;
    while (true) {
      occupiedDaysByLane[lane] ??= new Set();
      const occupied = occupiedDaysByLane[lane];
      let isFree = true;
      for (let day = start; day <= end; day++) {
        if (occupied.has(day)) {
          isFree = false;
          break;
        }
      }
      if (isFree) break;
      lane++;
    }
    for (let day = start; day <= end; day++) {
      occupiedDaysByLane[lane].add(day);
    }
    lanes.set(plan.id, lane);
  }

  return lanes;
}

export function buildWeekSegments(
  week: CalendarCell[],
  plans: Plan[],
  lanes: Map<Plan["id"], number>,
): CalendarBarSegment[] {
  const weekStart = toDayIndex(week[0].date);
  const weekEnd = toDayIndex(week[week.length - 1].date);

  return plans
    .filter((plan) => {
      const [start, end] = planRange(plan);
      return start <= weekEnd && end >= weekStart;
    })
    .map((plan) => {
      const [start, end] = planRange(plan);
      return {
        plan,
        lane: lanes.get(plan.id) ?? 0,
        startCol: Math.max(start, weekStart) - weekStart,
        endCol: Math.min(end, weekEnd) - weekStart,
        isStart: start >= weekStart,
        isEnd: end <= weekEnd,
      };
    })
    .sort((a, b) => a.lane - b.lane);
}
