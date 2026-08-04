import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import TopBar from "../../components/common/TopBar";
import CalloutBanner from "../../components/common/CalloutBanner";
import ChatInput from "../../components/ai/ChatInput";
import { CheckIcon } from "../../assets/icons";
import cloyCircle from "../../assets/images/cloy-circle.png";
import { useStartAiSessionMutation } from "../../hooks/useAi";

const CHECKLIST = [
  {
    title: "폐업 진행 상태",
    desc: "폐업 결정 여부 / 신고 여부 / 예정일",
    example: '예: "결정했고, 신고는 아직 안 했어요."',
  },
  {
    title: "임대차(가게 계약) 상태",
    desc: "계약 잔여 기간 / 해지 진행 여부",
    example: '예: "3개월 남았고 아직 해지 전이에요."',
  },
  {
    title: "재고 및 집기 상태",
    desc: "남은 재고 양 / 집기 처분 여부",
    example: '예: "재고가 많이 남았고 정리 안 했어요."',
  },
  {
    title: "직원 여부",
    desc: "직원 유무 / 퇴직 처리 여부",
    example: '예: "직원 2명 있고 정산 전이에요."',
  },
  {
    title: "기타 상황 (선택)",
    desc: "채무, 세금, 기타 고민 등",
    example: '예: "세금 신고가 걱정돼요."',
  },
];

export default function AIPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const startSession = useStartAiSessionMutation();

  return (
    <div className="min-h-screen bg-white">
      <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />

      <div className="flex flex-col items-center px-4 pt-8 pb-32">
        <div className="flex w-full flex-col items-start gap-3">
          <img
            src={cloyCircle}
            alt=""
            style={{ width: "72px", height: "72px", objectFit: "contain" }}
          />
          <p className="text-title-1 text-gray-900">
            사장님의 상황을 알려주시면
            <br />
            맞춤 일정을 생성해 드릴게요
          </p>
        </div>

        <CalloutBanner
          title="막막한 폐업 준비가 처음이시라면?"
          description="전체적인 절차 가이드를 먼저 읽어보세요."
          actionLabel="읽기"
          onAction={() => navigate(ROUTES.GUIDE, { state: { from: "ai" } })}
          className="mt-5 w-full"
        />

        <div className="mt-3 flex w-full flex-col gap-4 rounded-xl border border-gray-100 bg-gray-5 p-4">
          <p className="text-subtitle-2 text-gray-900">
            다섯 가지만 확인해 주세요
          </p>
          <div className="flex flex-col gap-3">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-1">
                <CheckIcon className="h-6 w-6 shrink-0 text-primary-500" />
                <div className="flex flex-col">
                  <p className="text-subtitle-2 text-gray-900">{item.title}</p>
                  <p className="mt-1 text-body-3 text-gray-900">{item.desc}</p>
                  <p className="mt-0.5 text-body-3 text-primary-500">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-1/2 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 bg-gradient-to-t from-white via-white to-white/0 px-4 pb-4 pt-6">
        <ChatInput
          value={input}
          onChange={setInput}
          disabled={startSession.isPending}
          onSend={() => {
            const initialInput = input.trim();
            if (!initialInput || startSession.isPending) return;

            startSession.mutate(
              { initialInput },
              {
                onSuccess: (data) => {
                  navigate(ROUTES.AI_PLAN, {
                    state: {
                      sessionId: data.sessionId,
                      initialMessage: initialInput,
                      aiMessage: data.aiMessage,
                      generatedTasks: data.generatedTasks,
                      turnCount: data.turnCount,
                      remainingTurns: data.remainingTurns,
                    },
                  });
                },
              },
            );
          }}
          className="w-full"
        />
      </div>
    </div>
  );
}
