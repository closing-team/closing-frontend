import { http, HttpResponse } from "msw";
import {
  deleteTask as removeTask,
  findTask,
  insertTask,
  listTasks,
  updateTask as patchTask,
} from "./db";
import type {
  CompleteTaskRequestJson,
  CreateTaskRequestJson,
  HomeTaskCalendarItem,
  UpdateTaskRequestJson,
} from "../../types/scheduleApi";
import { OK } from "../common";

function notFound() {
  return HttpResponse.json(
    { success: false, code: "TASK_NOT_FOUND", message: "존재하지 않는 일정입니다." },
    { status: 404 },
  );
}

function toCalendarItem(task: ReturnType<typeof listTasks>[number]): HomeTaskCalendarItem {
  return {
    taskId: task.taskId,
    title: task.title,
    startDate: task.startDate,
    endDate: task.endDate,
    startTime: task.startTime,
    endTime: task.endTime,
    isCompleted: task.isCompleted,
    source: task.source,
  };
}

export const scheduleHandlers = [
  http.get("*/api/v1/tasks/home", ({ request }) => {
    const url = new URL(request.url);
    const yearMonth = url.searchParams.get("yearMonth") ?? "";

    const monthTasks = listTasks().filter((task) =>
      task.startDate.startsWith(yearMonth),
    );

    return HttpResponse.json({
      ...OK,
      data: {
        summary: {
          totalCount: monthTasks.length,
          completedCount: monthTasks.filter((t) => t.isCompleted).length,
          progressRate:
            monthTasks.length === 0
              ? 0
              : monthTasks.filter((t) => t.isCompleted).length / monthTasks.length,
        },
        calendar: monthTasks.map(toCalendarItem),
      },
    });
  }),

  http.post("*/api/v1/tasks", async ({ request }) => {
    const body = (await request.json()) as CreateTaskRequestJson;
    const created = insertTask(body);

    return HttpResponse.json({
      ...OK,
      data: {
        taskId: created.taskId,
        title: created.title,
        startDate: created.startDate,
        endDate: created.endDate,
        startTime: created.startTime,
        endTime: created.endTime,
        isCompleted: created.isCompleted,
        source: created.source,
        createdAt: created.createdAt,
      },
    });
  }),

  http.get("*/api/v1/tasks/:taskId", ({ params }) => {
    const taskId = Number(params.taskId);
    const task = findTask(taskId);
    if (!task) return notFound();

    return HttpResponse.json({ ...OK, data: task });
  }),

  http.patch("*/api/v1/tasks/:taskId", async ({ request, params }) => {
    const taskId = Number(params.taskId);
    const task = findTask(taskId);
    if (!task) return notFound();

    const body = (await request.json()) as UpdateTaskRequestJson;
    const updated = patchTask(taskId, body)!;

    return HttpResponse.json({
      ...OK,
      data: {
        taskId: updated.taskId,
        title: updated.title,
        startDate: updated.startDate,
        endDate: updated.endDate,
        startTime: updated.startTime,
        endTime: updated.endTime,
        isCompleted: updated.isCompleted,
        source: updated.source,
        updatedAt: updated.updatedAt,
      },
    });
  }),

  http.delete("*/api/v1/tasks/:taskId", ({ params }) => {
    const taskId = Number(params.taskId);
    if (!findTask(taskId)) return notFound();

    removeTask(taskId);
    return HttpResponse.json({ ...OK, data: {} });
  }),

  http.patch("*/api/v1/tasks/:taskId/complete", async ({ request, params }) => {
    const taskId = Number(params.taskId);
    const task = findTask(taskId);
    if (!task) return notFound();

    const body = (await request.json()) as CompleteTaskRequestJson;
    const updated = patchTask(taskId, { isCompleted: body.isCompleted })!;

    return HttpResponse.json({
      ...OK,
      data: {
        taskId: updated.taskId,
        isCompleted: updated.isCompleted,
        updatedAt: updated.updatedAt,
      },
    });
  }),
];
