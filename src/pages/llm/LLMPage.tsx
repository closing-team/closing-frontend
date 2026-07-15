import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import CalloutBanner from "../../components/common/CalloutBanner";
import ChatInput from "../../components/llm/ChatInput";
import { CheckIcon } from "../../assets/icons";
import characterRight from "../../assets/images/cloy-lg.png";

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

export default function LLMPage() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <TopBar onBack={() => navigate(-1)} title="AI 맞춤 계획 만들기" />

      <div className="flex flex-col items-center px-4 py-8 gap-5">
        <div className="flex w-full flex-col items-start gap-3">
          <div
            className="flex shrink-0 items-center justify-center"
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "linear-gradient(180deg, #CFCBFF 0%, #F7F6FF 100%)",
            }}
          >
            <img
              src={characterRight}
              alt=""
              style={{
                width: "57.14px",
                height: "57.14px",
                objectFit: "contain",
              }}
            />
          </div>
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
          className="w-full"
        />

        <div className="flex w-full flex-col gap-4 rounded-xl border border-gray-100 bg-gray-5 p-4">
          <p className="text-subtitle-2 text-gray-900">
            다섯 가지만 확인해 주세요
          </p>
          <div className="flex flex-col gap-3">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-6 w-6 shrink-0 text-primary-500" />
                <div className="flex flex-col gap-1">
                  <p className="text-subtitle-2 text-gray-900">{item.title}</p>
                  <p className="text-body-3 text-gray-900">{item.desc}</p>
                  <p className="text-body-3 text-primary-500">{item.example}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 채팅 입력창 */}
        {/* TODO: (LLM001) 전송 시 대화 API 연동 */}
        <ChatInput
          value={input}
          onChange={setInput}
          onSend={() => setInput("")}
          className="w-full"
        />
      </div>
    </div>
  );
}
