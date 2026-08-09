import type {
  AiConfirmedTaskDto,
  AiGeneratedTaskDto,
  AiSessionMessage,
  AiSessionStatus,
  UpdateAiSessionTaskRequestJson,
} from "../../types/aiApi";

// TODO: 총 대화 턴 수는 명세에 없어 START 응답 예시(turnCount:1, remainingTurns:9)로 역산한 값.
// 명세 확정 시 실제 값으로 교체 필요
const MAX_TURNS = 10;
// 실제로 10턴을 다 채우지 않아도 목업으로 바로 확인할 수 있도록, 이 턴부터는 isFinal을 true로 준다
const FINAL_TURN = 3;

const SCRIPTED_QUESTIONS = [
  "언제 폐업할 예정인가요?",
  "몇 명의 직원이 있나요?",
  "정리해야 할 집기나 재고가 있으신가요? 확인이 끝나면 아래 일정으로 정리해 드릴게요. 확인 후 확정해 주세요.",
];

function seedGeneratedTasks(): AiGeneratedTaskDto[] {
  return [
    {
      tempId: "task-1",
      title: "폐업 신고서 제출",
      startDate: "2026-08-20",
      startTime: "10:00:00",
      endDate: "2026-08-20",
      endTime: "22:00:00",
      memo: "관할 세무서 방문 필요",
    },
  ];
}

export interface AiSessionRecord {
  sessionId: string;
  userId: number;
  status: AiSessionStatus;
  turnCount: number;
  remainingTurns: number;
  messages: AiSessionMessage[];
  generatedTasks: AiGeneratedTaskDto[];
  confirmedTasks: AiConfirmedTaskDto[];
}

let sessions: AiSessionRecord[] = [];
let nextSessionId = 1;
let nextTaskId = 1;

export function findSession(sessionId: string): AiSessionRecord | undefined {
  return sessions.find((s) => s.sessionId === sessionId);
}

function findConfirmedSessionForUser(
  userId: number,
): AiSessionRecord | undefined {
  return sessions.find(
    (s) => s.userId === userId && s.status === "ALREADY_CONFIRMED",
  );
}

export function startSession(
  userId: number,
  initialInput: string,
): AiSessionRecord {
  const existingConfirmed = findConfirmedSessionForUser(userId);
  if (existingConfirmed) return existingConfirmed;

  const record: AiSessionRecord = {
    sessionId: `session-${nextSessionId++}`,
    userId,
    status: "NEW",
    turnCount: 1,
    remainingTurns: MAX_TURNS - 1,
    messages: [
      { role: "user", content: initialInput },
      { role: "assistant", content: SCRIPTED_QUESTIONS[0] },
    ],
    generatedTasks: seedGeneratedTasks(),
    confirmedTasks: [],
  };
  sessions = [record, ...sessions];
  return record;
}

export function addUserMessage(
  session: AiSessionRecord,
  message: string,
): AiSessionRecord {
  const nextTurnCount = session.turnCount + 1;
  const questionIndex = Math.min(
    session.turnCount,
    SCRIPTED_QUESTIONS.length - 1,
  );

  session.turnCount = nextTurnCount;
  session.remainingTurns = Math.max(0, MAX_TURNS - nextTurnCount);
  session.status = "GENERATED";
  session.messages = [
    ...session.messages,
    { role: "user", content: message },
    { role: "assistant", content: SCRIPTED_QUESTIONS[questionIndex] },
  ];

  return session;
}

export function isFinalTurn(session: AiSessionRecord): boolean {
  return session.turnCount >= FINAL_TURN || session.remainingTurns <= 0;
}

export function confirmSession(session: AiSessionRecord): {
  confirmedTasks: AiConfirmedTaskDto[];
} {
  const confirmedTasks: AiConfirmedTaskDto[] = session.generatedTasks.map(
    (task) => ({
      taskId: nextTaskId++,
      title: task.title,
      startDate: task.startDate,
      startTime: task.startTime,
      endDate: task.endDate,
      endTime: task.endTime,
      description: task.memo,
      source: "AI_GENERATED",
    }),
  );
  session.status = "ALREADY_CONFIRMED";
  session.confirmedTasks = confirmedTasks;
  return { confirmedTasks };
}

export function deleteGeneratedTask(
  session: AiSessionRecord,
  tempId: string,
): boolean {
  const before = session.generatedTasks.length;
  session.generatedTasks = session.generatedTasks.filter(
    (task) => task.tempId !== tempId,
  );
  return session.generatedTasks.length < before;
}

export function updateGeneratedTask(
  session: AiSessionRecord,
  tempId: string,
  patch: UpdateAiSessionTaskRequestJson,
): AiGeneratedTaskDto | undefined {
  const target = session.generatedTasks.find((task) => task.tempId === tempId);
  if (!target) return undefined;
  Object.assign(target, patch);
  return target;
}
