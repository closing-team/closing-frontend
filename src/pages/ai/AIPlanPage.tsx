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
import { MOCK_PLANS } from "../../mocks/ai/mockAIPlans";
import cloyCircle from "../../assets/images/cloy-circle.png";

// TODO: AI 세션 API 연동 후 세션 조회/메세지 전송 응답의 remainingTurns 필드로 교체
const MAX_FREE_TURNS = 2;

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

export default function AIPlanPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [input, setInput] = useState("");
  const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [turnCount, setTurnCount] = useState(0);
  const remainingTurns = Math.max(MAX_FREE_TURNS - turnCount, 0);
  const isExhausted = turnCount >= MAX_FREE_TURNS;
  const [messages, setMessages] = useState<Message[]>(() => {
    const initial = (location.state as { initialMessage?: string } | null)
      ?.initialMessage;
    const now = formatTime(new Date());
    const msgs: Message[] = [];
    if (initial) {
      msgs.push({ id: 1, me: true, text: initial, time: now });
    }
    // MOCK: AI 일정 생성 결과 — API 연동 후 제거
    msgs.push({
      id: 2,
      me: false,
      text: "우선순위별 일정을 생성했어요. 확인해 보세요!",
      plans: MOCK_PLANS,
      time: now,
    });
    return msgs;
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleConfirmDelete = () => {
    if (!deletingPlan) return;
    setMessages((prev) =>
      prev.map((msg) =>
        isPlanResult(msg)
          ? { ...msg, plans: msg.plans.filter((p) => p.id !== deletingPlan.id) }
          : msg,
      ),
    );
    setDeletingPlan(null);
  };

  const handleConfirmEdit = (updated: Plan) => {
    setMessages((prev) =>
      prev.map((msg) =>
        isPlanResult(msg)
          ? {
              ...msg,
              plans: msg.plans.map((p) => (p.id === updated.id ? updated : p)),
            }
          : msg,
      ),
    );
    setEditingPlan(null);
  };

  const handleSend = () => {
    if (!input.trim() || isExhausted) return;
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        me: true,
        text: input.trim(),
        time: formatTime(new Date()),
      },
    ]);
    setInput("");
    setTurnCount((c) => c + 1);
  };

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
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="mt-4"
                  >
                    캘린더에 모두 추가
                  </Button>
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

      <div className="fixed bottom-0 left-1/2 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 p-4">
        {turnCount > 0 &&
          (isExhausted ? (
            <Toast
              variant="danger"
              icon={<AlertIcon className="h-5 w-5 shrink-0 text-warning-500" />}
              message={`무료 질문 횟수(${MAX_FREE_TURNS}회)를 모두 사용하셨어요.`}
              className="mb-3"
            />
          ) : (
            <Toast
              icon={<AlertIcon className="h-5 w-5 shrink-0 text-white" />}
              message={`남은 질문 횟수: ${remainingTurns}/${MAX_FREE_TURNS}`}
              className="mb-3"
            />
          ))}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isExhausted}
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
