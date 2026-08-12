import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import ChatBubble from "../../components/common/ChatBubble";
import ChatInput from "../../components/ai/ChatInput";
import GeneratedPlanCard from "../../components/ai/GeneratedPlanCard";
import AIPlanSkeleton from "../../components/ai/AIPlanSkeleton";
import Button from "../../components/common/Button";
import DeletePlanModal from "../../components/ai/DeletePlanModal";
import PlanFormModal from "../../components/common/PlanFormModal";
import Toast from "../../components/common/Toast";
import { AlertIcon, CheckIcon } from "../../assets/icons";
import type { Plan } from "../../components/common/PlanCard";
import {
  getAiConfirmErrorMessage,
  toConfirmedPlans,
  toPlan,
  toPlans,
  toUpdateAiTaskRequest,
} from "../../utils/aiAdapter";
import {
  useAiSessionQuery,
  useConfirmAiSessionMutation,
  useDeleteAiSessionTaskMutation,
  useSendAiSessionMessageMutation,
  useUpdateAiSessionTaskMutation,
} from "../../hooks/useAi";
import { ROUTES } from "../../constants/routes";
import cloyCircle from "../../assets/images/cloy-circle.png";
import type { AiGeneratedTaskDto } from "../../types/aiApi";
import { formatTime, toTimeValue } from "../../utils/dateFormat";

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

function formatNowTime(): string {
  return formatTime(toTimeValue(new Date()));
}

interface AiPlanLocationState {
  initialMessage?: string;
  aiMessage?: string | null;
  generatedTasks?: AiGeneratedTaskDto[] | null;
  turnCount?: number;
  remainingTurns?: number | null;
}

interface InitialChatState {
  messages: Message[];
  turnCount: number;
  remainingTurns: number;
  isFinal: boolean;
}

function buildInitialStateFromSeed(state: AiPlanLocationState): InitialChatState {
  const now = formatNowTime();
  const messages: Message[] = [];
  if (state.initialMessage) {
    messages.push({ id: messages.length + 1, me: true, text: state.initialMessage, time: now });
  }
  if (state.aiMessage || state.generatedTasks?.length) {
    messages.push({
      id: messages.length + 1,
      me: false,
      text: state.aiMessage ?? "일정을 생성했어요.",
      plans: toPlans(state.generatedTasks),
      time: now,
    });
  }
  return {
    messages,
    turnCount: state.turnCount ?? 0,
    remainingTurns: state.remainingTurns ?? 0,
    isFinal: false,
  };
}

// GET 세션 조회 응답 중 NEW와 Generated 모양만 처리, Confirmed 모양은 상위에서 별도 화면으로 분기
function buildInitialStateFromSession(
  data: { messages: { role: string; content: string }[]; turnCount: number; remainingTurns: number } | { generatedTasks: AiGeneratedTaskDto[] },
): InitialChatState {
  if ("messages" in data) {
    return {
      messages: data.messages.map((m, i) => ({
        id: i + 1,
        me: m.role === "user",
        text: m.content,
        time: "",
      })),
      turnCount: data.turnCount,
      remainingTurns: data.remainingTurns,
      isFinal: data.remainingTurns <= 0,
    };
  }
  return {
    messages: [
      {
        id: 1,
        me: false,
        text: "지금까지 생성된 일정이에요",
        plans: toPlans(data.generatedTasks),
        time: "",
      },
    ],
    turnCount: 0,
    remainingTurns: 0,
    isFinal: false,
  };
}

interface AIPlanChatProps {
  sessionId: string;
  initial: InitialChatState;
}

function AIPlanChat({ sessionId, initial }: AIPlanChatProps) {
  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [turnCount, setTurnCount] = useState(initial.turnCount);
  const [remainingTurns, setRemainingTurns] = useState(initial.remainingTurns);
  const [isFinal, setIsFinal] = useState(initial.isFinal);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initial.messages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = useSendAiSessionMessageMutation();
  const confirmSession = useConfirmAiSessionMutation();
  const deleteTask = useDeleteAiSessionTaskMutation();
  const updateTask = useUpdateAiSessionTaskMutation();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
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

  const handleConfirmEdit = (updated: Plan, memo: string) => {
    updateTask.mutate(
      {
        sessionId,
        tempId: String(updated.id),
        request: toUpdateAiTaskRequest(updated, memo),
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
    if (!text || isFinal || sendMessage.isPending) return;

    setMessages((prev) => [
      ...prev,
      { id: prev.length + 1, me: true, text, time: formatNowTime() },
    ]);
    setInput("");

    sendMessage.mutate(
      { sessionId, message: text },
      {
        onSuccess: (data) => {
          setTurnCount(data.turnCount);
          setRemainingTurns(data.remainingTurns ?? 0);
          setIsFinal(data.isFinal);
          setMessages((prev) => [
            ...prev,
            {
              id: prev.length + 1,
              me: false,
              text: data.aiMessage ?? "일정을 생성했어요.",
              plans: toPlans(data.generatedTasks),
              time: formatNowTime(),
            },
          ]);
        },
      },
    );
  };

  const handleConfirmSession = () => {
    if (isConfirmed) return;

    confirmSession.mutate(sessionId, {
      onSuccess: () => {
        setIsConfirmed(true);
        navigate(ROUTES.HOME, { replace: true });
      },
      onError: (error) => {
        console.error("AI 일정 확정 실패:", getAiConfirmErrorMessage(error), error);
      },
    });
  };

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />

      <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto px-4 pt-5 pb-52">
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
          isPending={deleteTask.isPending}
          onCancel={() => setDeletingPlan(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {editingPlan && (
        <PlanFormModal
          plan={editingPlan}
          isPending={updateTask.isPending}
          onCancel={() => setEditingPlan(null)}
          onConfirm={handleConfirmEdit}
        />
      )}
    </div>
  );
}

function AIPlanFallback({ message }: { message: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-body-2 text-gray-500">{message}</p>
        <Button onClick={() => navigate(ROUTES.AI)}>다시 시작하기</Button>
      </div>
    </div>
  );
}

export default function AIPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const state = (location.state as AiPlanLocationState | null) ?? {};
  const hasSeedData = Boolean(state.aiMessage) || Boolean(state.generatedTasks?.length);

  const sessionQuery = useAiSessionQuery(
    !hasSeedData && sessionId ? sessionId : undefined,
  );

  if (!sessionId) {
    return (
      <AIPlanFallback message="세션 정보를 찾을 수 없어요. 처음부터 다시 시작해 주세요." />
    );
  }

  if (hasSeedData) {
    return (
      <AIPlanChat
        key={sessionId}
        sessionId={sessionId}
        initial={buildInitialStateFromSeed(state)}
      />
    );
  }

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />
        <AIPlanSkeleton />
      </div>
    );
  }

  if (sessionQuery.isError || !sessionQuery.data) {
    return (
      <AIPlanFallback message="세션 정보를 불러오지 못했어요. 처음부터 다시 시작해 주세요." />
    );
  }

  const data = sessionQuery.data;

  if ("confirmedTasks" in data) {
    const confirmedPlans = toConfirmedPlans(data.confirmedTasks);
    return (
      <div className="flex min-h-dvh flex-col bg-white">
        <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />
        <div className="flex flex-1 flex-col gap-4 px-4 pt-5 pb-8">
          <Toast
            icon={<CheckIcon className="h-5 w-5 shrink-0 text-white" />}
            message="이미 확정된 일정이에요"
          />
          <div className="flex flex-col gap-2">
            {confirmedPlans.map((plan) => (
              <GeneratedPlanCard key={plan.id} plan={plan} readOnly />
            ))}
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="mt-2"
            onClick={() => navigate(ROUTES.HOME, { replace: true })}
          >
            홈으로 가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AIPlanChat
      key={sessionId}
      sessionId={sessionId}
      initial={buildInitialStateFromSession(data)}
    />
  );
}
