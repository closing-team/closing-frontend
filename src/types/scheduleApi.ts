// GET /api/v1/tasks/home — 홈 화면 전체 조회 (캘린더, 할일, 진행률 등) 응답
export interface HomeTasksSummary {
  totalCount: number;
  completedCount: number;
  progressRate: number;
}

export interface HomeTaskCalendarItem {
  taskId: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  source: string; // "manual" 외 다른 값 존재 여부는 다른 일정 API 스키마 확인 필요
}

export interface HomeTasksResponseData {
  summary: HomeTasksSummary;
  calendar: HomeTaskCalendarItem[];
}

// GET /api/v1/tasks/{taskId} — 일정 상세 조회 응답
export interface TaskDetailDto {
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

// POST /api/v1/tasks — 일정 추가 요청과 응답
export interface CreateTaskRequestJson {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface CreateTaskResponseData {
  taskId: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  source: string;
  createdAt: string;
}

// PATCH /api/v1/tasks/{taskId} — 일정 수정 요청과 응답
export interface UpdateTaskRequestJson {
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description: string;
}

export interface UpdateTaskResponseData {
  taskId: number;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
  source: string;
  updatedAt: string;
}

// PATCH /api/v1/tasks/{taskId}/complete — 완료 처리 요청과 응답
export interface CompleteTaskRequestJson {
  isCompleted: boolean;
}

export interface CompleteTaskResponseData {
  taskId: number;
  isCompleted: boolean;
  updatedAt: string;
}
