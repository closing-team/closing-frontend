import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatBubble from "../../components/common/ChatBubble";
import ChatInput from "../../components/ai/ChatInput";
import GeneratedPlanCard from "../../components/ai/GeneratedPlanCard";
import Button from "../../components/common/Button";
import DeletePlanModal from "../../components/ai/DeletePlanModal";
import EditPlanModal from "../../components/ai/EditPlanModal";
import Toast from "../../components/common/Toast";
import { AlertIcon } from "../../assets/icons";
import type { Plan } from "../../components/common/PlanCard";
import { toPlan, toUpdateAiTaskRequest } from "../../utils/aiAdapter";
import {
  useConfirmAiSessionMutation,
  useDeleteAiSessionTaskMutation,
  useSendAiSessionMessageMutation,
  useUpdateAiSessionTaskMutation,
} from "../../hooks/useAi";
import { ROUTES } from "../../constants/routes";
import cloyCircle from "../../assets/images/cloy-circle.png";
import type { AiGeneratedTaskDto } from "../../types/aiApi";

type TextMessage = {
  id: number;
  me: boolean;
  text: string;
  time: string;
};

type PlanResultMessage = {
  id: number;
  me: false;
  text: string;
  plans: Plan[];
  time: string;
};

type Message = TextMessage | PlanResultMessage;

function isPlanResult(msg: Message): msg is PlanResultMessage {
  return !msg.me && "plans" in msg;
}

function formatTime(date: Date) {
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h < 12 ? "오전" : "오후";
  const h12 = h % 12 || 12;
  return `${ampm} ${h12}:${String(m).padStart(2, "0")}`;
}

interface AiPlanLocationState {
  sessionId?: string;
  initialMessage?: string;
  aiMessage?: string;
  generatedTasks?: AiGeneratedTaskDto[];
  turnCount?: number;
  remainingTurns?: number;
}

export default function AIPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as AiPlanLocationState | null) ?? {};
  const sessionId = state.sessionId ?? null;

  const [input, setInput] = useState("");
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [turnCount, setTurnCount] = useState(state.turnCount ?? 0);
  const [remainingTurns, setRemainingTurns] = useState(
    state.remainingTurns ?? 0,
  );
  const [isFinal, setIsFinal] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const [messages, setMessages] = useState<Message[]>(() => {
    const now = formatTime(new Date());
    const msgs: Message[] = [];
    if (state.initialMessage) {
      msgs.push({ id: msgs.length + 1, me: true, text: state.initialMessage, time: now });
    }
    if (state.aiMessage) {
      msgs.push({
        id: msgs.length + 1,
        me: false,
        text: state.aiMessage,
        plans: (state.generatedTasks ?? []).map(toPlan),
        time: now,
      });
    }
    return msgs;
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useSendAiSessionMessageMutation();
  const confirmSession = useConfirmAiSessionMutation();
  const deleteTask = useDeleteAiSessionTaskMutation();
  const updateTask = useUpdateAiSessionTaskMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConfirmDelete = () => {
    if (!deletingPlan || !sessionId) return;
    const target = deletingPlan;

    deleteTask.mutate(
      { sessionId, tempId: String(target.id) },
      {
        onSuccess: () => {
          setMessages((prev) =>
            prev.map((msg) =>
              isPlanResult(msg)
                ? { ...msg, plans: msg.plans.filter((p) => p.id !== target.id) }
                : msg,
            ),
          );
          setDeletingPlan(null);
        },
      },
    );
  };

  const handleConfirmEdit = (updated: Plan, memo?: string) => {
    if (!sessionId) return;

    updateTask.mutate(
      {
        sessionId,
        tempId: String(updated.id),
        request: toUpdateAiTaskRequest(updated, memo ?? ""),
      },
      {
        onSuccess: (data) => {
          const updatedPlan = toPlan(data);
          setMessages((prev) =>
            prev.map((msg) =>
              isPlanResult(msg)
                ? {
                    ...msg,
                    plans: msg.plans.map((p) =>
                      p.id === updatedPlan.id ? updatedPlan : p,
                    ),
                  }
                : msg,
            ),
          );
          setEditingPlan(null);
        },
      },
    );
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || isFinal || !sessionId || sendMessage.isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, me: true, text, time: formatTime(new Date()) },
    ]);
    setInput("");

    sendMessage.mutate(
      { sessionId, message: text },
      {
        onSuccess: (data) => {
          setTurnCount(data.turnCount);
          setRemainingTurns(data.remainingTurns);
          setIsFinal(data.isFinal);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              me: false,
              text: data.aiMessage,
              plans: data.generatedTasks.map(toPlan),
              time: formatTime(new Date()),
            },
          ]);
        },
      },
    );
  };

  const handleConfirmSession = () => {
    if (!sessionId || isConfirmed) return;

    confirmSession.mutate(sessionId, {
      onSuccess: () => {
        setIsConfirmed(true);
        navigate(ROUTES.HOME, { replace: true });
      },
    });
  };

  if (!sessionId) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
          <p className="text-body-2 text-gray-500">
            세션 정보를 찾을 수 없어요. 처음부터 다시 시작해 주세요.
          </p>
          <Button onClick={() => navigate(ROUTES.AI)}>다시 시작하기</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />

      <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-4 pt-5 pb-40">
        {messages.map((msg) => {
          if (isPlanResult(msg)) {
            return (
              <div key={msg.id} className="flex flex-col items-start">
                <img
                  src={cloyCircle}
                  alt=""
                  className="h-8 w-8 rounded-full object-contain"
                />
                <div className="mt-3 flex w-full flex-col rounded-2xl border border-gray-100 bg-gray-5 p-4">
                  <p className="text-body-2 text-gray-900">{msg.text}</p>
                  <div className="mt-6 flex flex-col gap-2">
                    {msg.plans.map((plan) => (
                      <GeneratedPlanCard
                        key={plan.id}
                        plan={plan}
                        onEdit={(id) => {
                          const found = msg.plans.find((p) => p.id === id);
                          if (found) setEditingPlan(found);
                        }}
                        onDelete={(id) => {
                          const found = msg.plans.find((p) => p.id === id);
                          if (found) setDeletingPlan(found);
                        }}
                      />
                    ))}
                  </div>
                  {msg.plans.length > 0 && (
                    <Button
                      variant="primary"
                      size="lg"
                      fullWidth
                      className="mt-4"
                      disabled={isConfirmed || confirmSession.isPending}
                      onClick={handleConfirmSession}
                    >
                      {isConfirmed ? "캘린더에 추가됨" : "캘린더에 모두 추가"}
                    </Button>
                  )}
                </div>
                <span className="mt-[5px] text-caption-3 text-gray-400">
                  {msg.time}
                </span>
              </div>
            );
          }
          return (
            <ChatBubble key={msg.id} me={msg.me} time={msg.time}>
              {msg.text}
            </ChatBubble>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-gradient-to-t from-white via-white to-white/0 px-4 pb-4 pt-6">
        {turnCount > 0 &&
          (isFinal ? (
            <Toast
              variant="danger"
              icon={<AlertIcon className="h-5 w-5 shrink-0 text-warning-500" />}
              message="더 이상 진행할 수 없는 대화예요."
              className="mb-3"
            />
          ) : (
            <Toast
              icon={<AlertIcon className="h-5 w-5 shrink-0 text-white" />}
              message={`남은 질문 횟수: ${remainingTurns}`}
              className="mb-3"
            />
          ))}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isFinal || isConfirmed || sendMessage.isPending}
          className="w-full"
        />
      </div>

      {deletingPlan && (
        <DeletePlanModal
          plan={deletingPlan}
          onCancel={() => setDeletingPlan(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {editingPlan && (
        <EditPlanModal
          plan={editingPlan}
          onCancel={() => setEditingPlan(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </div>
  );
}
