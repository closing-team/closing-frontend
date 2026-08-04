export interface TaskRecord {
  taskId: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
  isCompleted: boolean;
  source: string;
  createdAt: string;
  updatedAt: string;
}

function toDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateString(date);
}

function seed(): TaskRecord[] {
  const now = new Date().toISOString();
  return [
    {
      taskId: 1,
      title: "임대인 통보 및 폐업 신고하기",
      startDate: addDays(0),
      endDate: addDays(0),
      startTime: "10:00:00",
      endTime: "12:00:00",
      description: "관할 세무서 방문 필요",
      isCompleted: false,
      source: "MANUAL",
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 2,
      title: "직원 퇴직금 계산 및 서류 준비하기",
      startDate: addDays(3),
      endDate: addDays(5),
      startTime: "10:00:00",
      endTime: "18:00:00",
      description: "",
      isCompleted: false,
      source: "MANUAL",
      createdAt: now,
      updatedAt: now,
    },
    {
      taskId: 3,
      title: "집기 중고 거래",
      startDate: addDays(6),
      endDate: addDays(6),
      startTime: "12:00:00",
      endTime: "14:00:00",
      description: "",
      isCompleted: true,
      source: "MANUAL",
      createdAt: now,
      updatedAt: now,
    },
  ];
}

let tasks: TaskRecord[] = seed();
let nextId = Math.max(...tasks.map((t) => t.taskId)) + 1;

export function listTasks(): TaskRecord[] {
  return tasks;
}

export function findTask(taskId: number): TaskRecord | undefined {
  return tasks.find((t) => t.taskId === taskId);
}

export function insertTask(input: {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
}): TaskRecord {
  const now = new Date().toISOString();
  const record: TaskRecord = {
    ...input,
    taskId: nextId++,
    isCompleted: false,
    source: "MANUAL",
    createdAt: now,
    updatedAt: now,
  };
  tasks = [record, ...tasks];
  return record;
}

export function updateTask(
  taskId: number,
  patch: Partial<Omit<TaskRecord, "taskId" | "createdAt">>,
): TaskRecord | undefined {
  const target = findTask(taskId);
  if (!target) return undefined;
  Object.assign(target, patch, { updatedAt: new Date().toISOString() });
  return target;
}

export function deleteTask(taskId: number): boolean {
  const before = tasks.length;
  tasks = tasks.filter((t) => t.taskId !== taskId);
  return tasks.length < before;
}
