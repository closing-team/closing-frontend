import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Button from "../../components/common/Button";
import TipBox from "../../components/guide/TipBox";
import CopyBox from "../../components/guide/CopyBox";
import { CheckIcon } from "../../assets/icons";
import { guideDetailPath } from "../../constants/routes";

const TEXT_MESSAGE_TEMPLATE = `안녕하세요, 김건물 사장님.
저는 대박카페 1호점 임차인 홍길동입니다.
계약기간이 2026년 09월 30일에 만료되어 계약을 연장하지 않고 종료하고자 합니다.
계약 종료에 따른 원상복구 범위와 일정, 보증금 반환 일정에 대해 협의 부탁드립니다. 감사합니다.`;

const NOTICE_FORM_TEMPLATE = `수신인 : 김건물
발신인 : 홍길동 (대박카페 1호점)

본인은 귀하와 체결한 상가 임대차계약에 대하여 계약기간 만료에 따라 계약을 갱신하지 않을 예정임을 알려드립니다. 계약 종료일은 2026년 09월 30일이며, 계약 종료일까지 목적물을 인도할 예정입니다.
원상복구 범위 및 보증금 반환 일정에 대하여 협의를 요청드립니다.

2026년 07월 02일`;

function CopyButton({
  text,
  children,
}: {
  text: string;
  children: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button variant="primary" size="sm" fullWidth className="h-11" onClick={handleClick}>
      {copied ? "복사됨" : children}
    </Button>
  );
}

export default function GuideNoticeTemplatePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white pb-24">
      <TopBar
        title="문자/내용증명 복사용 작성 템플릿"
        onBack={() => navigate(guideDetailPath(2))}
      />

      <div className="flex flex-col gap-6 px-4 py-5">
        <div className="flex flex-col gap-3">
          <p className="text-title-3 text-gray-900">
            1. 문자 / 카카오톡 발송용
          </p>
          <CopyBox>
            <p className="whitespace-pre-line text-body-2 text-gray-900">
              {TEXT_MESSAGE_TEMPLATE}
            </p>
          </CopyBox>
          <CopyButton text={TEXT_MESSAGE_TEMPLATE}>
            문자 내용 복사하기
          </CopyButton>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-title-3 text-gray-900">
            2. 우체국 내용증명 양식
          </p>
          <CopyBox>
            <div className="flex w-full flex-col gap-1">
              <p className="text-body-3 text-gray-500">수신인 : 김건물</p>
              <p className="-mt-1 text-body-3 text-gray-500">
                발신인 : 홍길동 (대박카페 1호점)
              </p>
              <p className="whitespace-pre-line text-body-2 text-gray-900">
                본인은 귀하와 체결한 상가 임대차계약에 대하여 계약기간 만료에
                따라 계약을 갱신하지 않을 예정임을 알려드립니다. 계약
                종료일은 2026년 09월 30일이며, 계약 종료일까지 목적물을
                인도할 예정입니다.{"\n"}원상복구 범위 및 보증금 반환 일정에
                대하여 협의를 요청드립니다.
              </p>
              <p className="text-body-3 text-gray-500">2026년 07월 02일</p>
            </div>
          </CopyBox>
          <CopyButton text={NOTICE_FORM_TEMPLATE}>
            내용증명 서식 복사하기
          </CopyButton>
        </div>

        <TipBox>
          <ul className="flex flex-col gap-1">
            <li className="flex items-start gap-1">
              <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
              <span className="text-caption-2 text-gray-700">
                문자나 카카오톡으로 보내더라도 상대방의 확인 답변을 받아 두는
                것이 법적 증거 확보에 매우 유리합니다.
              </span>
            </li>
            <li className="flex items-start gap-1">
              <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
              <span className="text-caption-2 text-gray-700">
                상대방이 답변을 회피하거나 분쟁이 예상된다면 우체국
                내용증명을 우편으로 발송하는 것이 가장 확실하고 안전합니다.
              </span>
            </li>
          </ul>
        </TipBox>
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 px-4 pb-5 pt-2.5">
        <Button variant="primary" fullWidth onClick={() => navigate(guideDetailPath(2))}>
          다음으로
        </Button>
      </div>
    </div>
  );
}
