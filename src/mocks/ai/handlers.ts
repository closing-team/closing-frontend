import { http, HttpResponse } from "msw";
import {
  addUserMessage,
  confirmSession,
  deleteGeneratedTask,
  findSession,
  isFinalTurn,
  startSession,
  updateGeneratedTask,
} from "./db";
import type {
  SendAiSessionMessageRequestJson,
  StartAiSessionRequestJson,
  UpdateAiSessionTaskRequestJson,
} from "../../types/aiApi";
import { CURRENT_USER_ID, OK } from "../common";

function sessionNotFound() {
  return HttpResponse.json(
    { success: false, code: "AI_SESSION_NOT_FOUND", message: "존재하지 않는 세션입니다." },
    { status: 404 },
  );
}

function sessionForbidden() {
  return HttpResponse.json(
    {
      success: false,
      code: "AI_SESSION_ACCESS_FORBIDDEN",
      message: "본인의 세션만 접근할 수 있습니다.",
    },
    { status: 403 },
  );
}

function sessionAlreadyConfirmed() {
  return HttpResponse.json(
    {
      success: false,
      code: "AI_SESSION_ALREADY_CONFIRMED",
      message: "이미 확정되어 더 이상 진행할 수 없는 세션입니다.",
    },
    { status: 409 },
  );
}

function messageEmpty() {
  return HttpResponse.json(
    { success: false, code: "AI_MESSAGE_EMPTY", message: "대화 메시지 내용이 없습니다." },
    { status: 400 },
  );
}

function taskTitleEmpty() {
  return HttpResponse.json(
    { success: false, code: "AI_TASK_TITLE_EMPTY", message: "일정 제목이 비어있습니다." },
    { status: 400 },
  );
}

export const aiHandlers = [
  http.post("*/api/v1/ai/sessions", async ({ request }) => {
    const body = (await request.json()) as StartAiSessionRequestJson;
    const session = startSession(CURRENT_USER_ID, body.initialInput);

    return HttpResponse.json({
      ...OK,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        aiMessage: session.messages.at(-1)!.content,
        turnCount: session.turnCount,
        remainingTurns: session.remainingTurns,
        generatedTasks: session.generatedTasks,
      },
    });
  }),

  http.post(
    "*/api/v1/ai/sessions/:sessionId/messages",
    async ({ request, params }) => {
      const session = findSession(String(params.sessionId));
      if (!session) return sessionNotFound();
      if (session.userId !== CURRENT_USER_ID) return sessionForbidden();
      if (session.status === "CONFIRMED") return sessionAlreadyConfirmed();

      const body = (await request.json()) as SendAiSessionMessageRequestJson;
      if (!body.message || body.message.trim().length === 0) {
        return messageEmpty();
      }

      const updated = addUserMessage(session, body.message.trim());

      return HttpResponse.json({
        ...OK,
        data: {
          aiMessage: updated.messages.at(-1)!.content,
          turnCount: updated.turnCount,
          remainingTurns: updated.remainingTurns,
          isFinal: isFinalTurn(updated),
          generatedTasks: updated.generatedTasks,
        },
      });
    },
  ),

  http.post("*/api/v1/ai/sessions/:sessionId/confirm", ({ params }) => {
    const session = findSession(String(params.sessionId));
    if (!session) return sessionNotFound();
    if (session.userId !== CURRENT_USER_ID) return sessionForbidden();
    if (session.status === "CONFIRMED") return sessionAlreadyConfirmed();

    const { confirmedTasks } = confirmSession(session);

    return HttpResponse.json({
      ...OK,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        confirmedTasks,
      },
    });
  }),

  http.delete("*/api/v1/ai/sessions/:sessionId/tasks/:tempId", ({ params }) => {
    const session = findSession(String(params.sessionId));
    if (!session) return sessionNotFound();
    if (session.userId !== CURRENT_USER_ID) return sessionForbidden();
    if (session.status === "CONFIRMED") return sessionAlreadyConfirmed();

    const removed = deleteGeneratedTask(session, String(params.tempId));
    if (!removed) return sessionNotFound();

    return HttpResponse.json({ ...OK, data: {} });
  }),

  http.patch(
    "*/api/v1/ai/sessions/:sessionId/tasks/:tempId",
    async ({ request, params }) => {
      const session = findSession(String(params.sessionId));
      if (!session) return sessionNotFound();
      if (session.userId !== CURRENT_USER_ID) return sessionForbidden();
      if (session.status === "CONFIRMED") return sessionAlreadyConfirmed();

      const body = (await request.json()) as UpdateAiSessionTaskRequestJson;
      if (!body.title || body.title.trim().length === 0) {
        return taskTitleEmpty();
      }

      const updated = updateGeneratedTask(
        session,
        String(params.tempId),
        body,
      );
      if (!updated) return sessionNotFound();

      return HttpResponse.json({ ...OK, data: updated });
    },
  ),

  http.get("*/api/v1/ai/sessions/:sessionId", ({ params }) => {
    const session = findSession(String(params.sessionId));
    if (!session) return sessionNotFound();
    if (session.userId !== CURRENT_USER_ID) return sessionForbidden();

    return HttpResponse.json({
      ...OK,
      data: {
        sessionId: session.sessionId,
        status: session.status,
        turnCount: session.turnCount,
        remainingTurns: session.remainingTurns,
        messages: session.messages,
      },
    });
  }),
];
