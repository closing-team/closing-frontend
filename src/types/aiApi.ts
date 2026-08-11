export type AiSessionStatus =
  | "NEW"
  | "IN_PROGRESS"
  | "CONFIRMED"
  | "ALREADY_CONFIRMED";

export interface AiGeneratedTaskDto {
  tempId: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  memo: string;
}

// POST /api/v1/ai/sessions — AI 세션 시작 요청과 응답
export interface StartAiSessionRequestJson {
  initialInput: string;
}

export interface StartAiSessionResponseData {
  sessionId: string;
  status: AiSessionStatus;
  // 일정이 생성되어 대화가 종료된 경우 null
  aiMessage: string | null;
  turnCount: number;
  // 대화가 아직 진행 중(isFinal: false)인 경우에만 값이 있고, 일정 생성이 완료된 경우 null
  remainingTurns: number | null;
  // 아직 생성되지 않았다면 null
  generatedTasks: AiGeneratedTaskDto[] | null;
}

// POST /api/v1/ai/sessions/{sessionId}/messages — AI 세션 메시지 전송 요청과 응답
export interface SendAiSessionMessageRequestJson {
  message: string;
}

export interface SendAiSessionMessageResponseData {
  // 일정이 생성되어 대화가 종료된 경우 null
  aiMessage: string | null;
  turnCount: number;
  // 대화가 아직 진행 중(isFinal: false)인 경우에만 값이 있고, 일정 생성이 완료된 경우 null
  remainingTurns: number | null;
  isFinal: boolean;
  // 아직 생성되지 않았다면 null
  generatedTasks: AiGeneratedTaskDto[] | null;
}

// POST /api/v1/ai/sessions/{sessionId}/confirm — AI 세션 확정 일정 캘린더 반영 응답
export interface AiConfirmedTaskDto {
  taskId: number;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  description: string;
  source: "AI_GENERATED";
}

export interface ConfirmAiSessionResponseData {
  sessionId: string;
  status: AiSessionStatus;
  confirmedTasks: AiConfirmedTaskDto[];
}

// PATCH /api/v1/ai/sessions/{sessionId}/tasks/{tempId} — AI 생성 임시 일정 수정 요청과 응답
export interface UpdateAiSessionTaskRequestJson {
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  memo: string;
}

export type UpdateAiSessionTaskResponseData = AiGeneratedTaskDto;

// GET /api/v1/ai/sessions/{sessionId} — AI 세션 조회 응답
export interface AiSessionMessage {
  role: string;
  content: string;
}

// 세션 상태에 따라 실제 응답 구현체가 달라짐
export interface AiSessionNewResponseData {
  sessionId: string;
  status: AiSessionStatus;
  turnCount: number;
  remainingTurns: number;
  messages: AiSessionMessage[];
}

export interface AiSessionGeneratedResponseData {
  sessionId: string;
  status: AiSessionStatus;
  generatedTasks: AiGeneratedTaskDto[];
}

export type GetAiSessionResponseData =
  | AiSessionNewResponseData
  | AiSessionGeneratedResponseData
  | ConfirmAiSessionResponseData;
