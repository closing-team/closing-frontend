export type AiSessionStatus = "NEW" | "GENERATED" | "ALREADY_CONFIRMED";

export interface AiGeneratedTaskDto {
  tempId: string;
  title: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  memo: string;
}

// POST /api/v1/ai/sessions — AI 세션 시작 요청/응답
export interface StartAiSessionRequestJson {
  initialInput: string;
}

export interface StartAiSessionResponseData {
  sessionId: string;
  status: AiSessionStatus;
  aiMessage: string;
  turnCount: number;
  remainingTurns: number;
  generatedTasks: AiGeneratedTaskDto[];
}

// POST /api/v1/ai/sessions/{sessionId}/messages — AI 세션 메시지 전송 요청/응답
export interface SendAiSessionMessageRequestJson {
  message: string;
}

export interface SendAiSessionMessageResponseData {
  aiMessage: string;
  turnCount: number;
  remainingTurns: number;
  isFinal: boolean;
  generatedTasks: AiGeneratedTaskDto[];
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

// PATCH /api/v1/ai/sessions/{sessionId}/tasks/{tempId} — AI 생성 임시 일정 수정 요청/응답
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

// 세션 상태에 따라 실제 응답 구현체가 달라짐 (백엔드 확인: NEW→messages, GENERATED→generatedTasks, ALREADY_CONFIRMED→confirmedTasks)
export interface AiSessionNewResponseData {
  sessionId: string;
  status: "NEW";
  turnCount: number;
  remainingTurns: number;
  messages: AiSessionMessage[];
}

export interface AiSessionGeneratedResponseData {
  sessionId: string;
  status: "GENERATED";
  generatedTasks: AiGeneratedTaskDto[];
}

export type GetAiSessionResponseData =
  | AiSessionNewResponseData
  | AiSessionGeneratedResponseData
  | ConfirmAiSessionResponseData;
