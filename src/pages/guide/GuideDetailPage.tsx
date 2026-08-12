import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import SectionCard from "../../components/guide/SectionCard";
import NoteBox from "../../components/guide/NoteBox";
import TipBox from "../../components/guide/TipBox";
import BulletList from "../../components/guide/BulletList";
import HighlightBox from "../../components/guide/HighlightBox";
import OptionBox from "../../components/guide/OptionBox";
import UtilityItemCard from "../../components/guide/UtilityItemCard";
import StepLayout from "../../components/guide/StepLayout";
import Checkbox from "../../components/common/Checkbox";
import { CheckIcon } from "../../assets/icons";
import cloyCircle from "../../assets/images/cloy-circle.png";
import { ROUTES, guideDetailPath } from "../../constants/routes";
import {
  STEP1_CONTENT,
  STEP2_HEADER,
  STEP2_SECTIONS,
  STEP3_HEADER,
  STEP3_CHECKLIST,
  STEP4_HEADER,
  STEP4_FIXTURES,
  STEP4_INVENTORY,
  STEP4_COMPARISON,
  STEP5_HEADER,
  STEP5_BEFORE_DEMOLITION,
  STEP5_DEMOLITION_TIPS,
  STEP5_UTILITIES,
  STEP6_HEADER,
  STEP6_WHERE_TO_FILE,
  STEP6_VISIT_IN_PERSON,
  STEP6_REQUIRED_DOCS,
  STEP6_BEFORE_FILING,
  STEP7_HEADER,
  STEP7_WHEN,
  STEP7_WITH_EMPLOYEES,
  STEP7_WITHOUT_EMPLOYEES,
  STEP7_WHERE,
  STEP7_HEALTH_INSURANCE,
  STEP8_HEADER,
  STEP8_DEADLINE,
  STEP8_REMAINING_ASSETS,
  STEP8_TEARDOWN_COST,
  STEP8_FILING_METHODS,
  STEP8_INCOME_TAX_ROWS,
  STEP8_INCOME_TAX_NOTE,
  STEP9_HEADER,
  STEP9_DEADLINE,
  STEP9_LOSS_FILING,
  STEP9_DOCUMENTS,
} from "../../constants/guideSteps";
import { useGuideStore } from "../../stores/guideStore";
import {
  buildStep3DeadlineRows,
  validateDueDate,
} from "../../utils/guideDueDate";

function Step2Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      paddingBottom="pb-36"
      title={STEP2_HEADER.title}
      subtitle={STEP2_HEADER.subtitle}
      description={STEP2_HEADER.description}
      descriptionClassName="mt-1 text-body-2 text-gray-500"
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP2_HEADER.checkboxLabel}
      footer={
        <div className="flex gap-2.5 px-4 pb-5 pt-2.5">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(guideDetailPath(1), isFromAI ? { state: { from: "ai" } } : undefined)}
          >
            이전으로
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate(guideDetailPath(3), isFromAI ? { state: { from: "ai" } } : undefined)}
          >
            다음으로
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        {STEP2_SECTIONS.map((section) => (
          <SectionCard key={section.title} title={section.title}>
            <div className="flex flex-col gap-4">
              <BulletList groups={section.groups} />
              {section.templateButton && (
                <Button
                  variant="outline"
                  size="sm"
                  fullWidth
                  className="h-11"
                  onClick={() => navigate(ROUTES.GUIDE_NOTICE_TEMPLATE)}
                >
                  문자/내용증명 복사용 작성 템플릿 보기
                </Button>
              )}
            </div>
          </SectionCard>
        ))}
      </div>
    </StepLayout>
  );
}

function Step3Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const dueDate = useGuideStore((s) => s.dueDate);

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP3_HEADER.title}
      subtitle={STEP3_HEADER.subtitle}
      description={STEP3_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP3_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col gap-3 px-4 pb-5 pt-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(guideDetailPath(2), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(guideDetailPath(4), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              다음으로
            </Button>
          </div>
          <p className="text-center text-caption-2 text-gray-400">
            {STEP3_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="bg-gray-30 px-4 py-6">
        <SectionCard title="직원 정리 필수 체크">
          <BulletList groups={STEP3_CHECKLIST} />
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4">
        <div className="px-0.5">
          <p className="text-title-3 text-gray-900">
            내 매장 해고 통보 마지노선 계산
          </p>
          <p className="text-body-2 text-gray-500">
            1단계에서 정한 영업 종료일을 기반으로 산정된 안전 기한입니다.
          </p>
        </div>
        <HighlightBox rows={buildStep3DeadlineRows(dueDate)} />
      </div>
    </StepLayout>
  );
}

function Step6Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState(() =>
    STEP6_REQUIRED_DOCS.map(() => false),
  );

  const toggleDoc = (index: number, checked: boolean) => {
    setCheckedDocs((prev) =>
      prev.map((value, i) => (i === index ? checked : value)),
    );
  };

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP6_HEADER.title}
      subtitle={STEP6_HEADER.subtitle}
      description={STEP6_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP6_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col gap-3 px-4 pb-5 pt-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(guideDetailPath(5), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(guideDetailPath(7), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              다음으로
            </Button>
          </div>
          <p className="text-center text-caption-2 text-gray-400">
            {STEP6_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="어디서 신고하나요?">
          <div className="flex flex-col gap-4">
            <BulletList groups={STEP6_WHERE_TO_FILE} />
            <Button
              variant="outline"
              size="sm"
              fullWidth
              className="h-11"
              onClick={() => navigate(ROUTES.GUIDE_REPORT_TEMPLATE)}
            >
              문자/내용증명 복사용 작성 템플릿 보기
            </Button>
            <BulletList groups={STEP6_VISIT_IN_PERSON} />
          </div>
        </SectionCard>

        <SectionCard title="폐업 신고 필수 준비물">
          <div className="flex flex-col gap-2">
            {STEP6_REQUIRED_DOCS.map((doc, i) => (
              <Checkbox
                key={doc.label}
                checked={checkedDocs[i]}
                onChange={(checked) => toggleDoc(i, checked)}
                label={
                  <span className="flex flex-col">
                    <span className="text-subtitle-2 text-gray-900">
                      {doc.label}
                    </span>
                    {doc.note && (
                      <span className="mt-0.5 text-body-3 text-gray-400">
                        {doc.note}
                      </span>
                    )}
                  </span>
                }
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard title="신고 전 반드시 확인하세요">
          <BulletList groups={STEP6_BEFORE_FILING} />
        </SectionCard>
      </div>
    </StepLayout>
  );
}

function Step7Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP7_HEADER.title}
      subtitle={STEP7_HEADER.subtitle}
      description={STEP7_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP7_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col gap-3 px-4 pb-5 pt-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(guideDetailPath(6), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(guideDetailPath(8), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              다음으로
            </Button>
          </div>
          <p className="whitespace-pre-line text-center text-caption-2 text-gray-400">
            {STEP7_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="언제 통보해야 하나요?">
          <BulletList groups={STEP7_WHEN} />
        </SectionCard>

        <SectionCard title="내 사업장 형태에 맞는 신고 절차">
          <div className="flex w-full flex-col gap-3">
            <OptionBox highlighted>
              <BulletList groups={STEP7_WITH_EMPLOYEES} />
            </OptionBox>
            <OptionBox>
              <BulletList groups={STEP7_WITHOUT_EMPLOYEES} />
            </OptionBox>
          </div>
        </SectionCard>

        <SectionCard title="어디서 한 번에 신청하나요?">
          <BulletList groups={STEP7_WHERE} />
        </SectionCard>

        <SectionCard title="모르면 당하는 지역 건강보험료 폭탄 방지" tone="highlighted">
          <BulletList groups={STEP7_HEALTH_INSURANCE} />
        </SectionCard>
      </div>
    </StepLayout>
  );
}

function Step8Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      paddingBottom="pb-36"
      title={STEP8_HEADER.title}
      subtitle={STEP8_HEADER.subtitle}
      description={STEP8_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP8_HEADER.checkboxLabel}
      footer={
        <div className="flex gap-2.5 px-4 pb-5 pt-2.5">
          <Button
            variant="outline"
            fullWidth
            onClick={() => navigate(guideDetailPath(7), isFromAI ? { state: { from: "ai" } } : undefined)}
          >
            이전으로
          </Button>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate(guideDetailPath(9), isFromAI ? { state: { from: "ai" } } : undefined)}
          >
            다음으로
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="부가세 확정 신고 기한">
          <BulletList groups={STEP8_DEADLINE} />
        </SectionCard>

        <div className="flex w-full flex-col gap-3">
          <SectionCard title="창업 시 환급받았다면? 잔존재화 과세 주의">
            <BulletList groups={STEP8_REMAINING_ASSETS} />
          </SectionCard>

          <TipBox>
            <ul className="flex flex-col gap-1">
              <li className="flex items-start gap-1">
                <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
                <span className="text-caption-2 text-gray-700">
                  폐업 시 자산을 스스로에게 판매한 것으로 간주하므로 기간 내
                  세무 소명을 하지 않으면 유관 가산세가 발생합니다.
                </span>
              </li>
            </ul>
          </TipBox>
        </div>

        <SectionCard title="마지막 절세 공제 및 신고 경로">
          <div className="flex w-full flex-col gap-3">
            <div className="border-b border-gray-100 pb-3">
              <BulletList groups={STEP8_TEARDOWN_COST} />
            </div>
            <BulletList groups={STEP8_FILING_METHODS} />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 bg-white p-4">
        <p className="text-title-3 text-gray-900">
          내년 5월, 종합소득세 최종 확정신고
        </p>
        <HighlightBox rows={STEP8_INCOME_TAX_ROWS} note={STEP8_INCOME_TAX_NOTE} />
      </div>
    </StepLayout>
  );
}

function Step4Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP4_HEADER.title}
      subtitle={STEP4_HEADER.subtitle}
      description={STEP4_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP4_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col gap-3 px-4 pb-5 pt-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(guideDetailPath(3), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(guideDetailPath(5), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              다음으로
            </Button>
          </div>
          <p className="whitespace-pre-line text-center text-caption-2 text-gray-400">
            {STEP4_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="매장 집기 및 시설 처분">
          <BulletList groups={STEP4_FIXTURES} />
        </SectionCard>

        <div className="flex w-full flex-col gap-3">
          <SectionCard title="원재료 및 상품 재고 털이">
            <BulletList groups={STEP4_INVENTORY} />
          </SectionCard>

          <TipBox>
            <ul className="flex flex-col gap-1">
              <li className="flex items-start gap-1">
                <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
                <span className="text-caption-2 text-gray-700">
                  집기 매각 관련 영수증과 거래 명세서는 꼭 챙겨두세요.
                </span>
              </li>
            </ul>
          </TipBox>
        </div>

        <div className="flex w-full flex-col gap-2">
          <p className="text-subtitle-2 text-gray-900">
            처분 방식 비교 가이드
          </p>
          <div className="flex w-full gap-2.5">
            {STEP4_COMPARISON.map((column) => (
              <div
                key={column.heading}
                className="flex-1 rounded-lg bg-white p-4"
              >
                <BulletList
                  groups={[
                    { heading: column.heading, items: column.items },
                  ]}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}

function Step5Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP5_HEADER.title}
      subtitle={STEP5_HEADER.subtitle}
      description={STEP5_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP5_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col gap-3 px-4 pb-5 pt-2.5">
          <div className="flex gap-2.5">
            <Button
              variant="outline"
              fullWidth
              onClick={() => navigate(guideDetailPath(4), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={() => navigate(guideDetailPath(6), isFromAI ? { state: { from: "ai" } } : undefined)}
            >
              다음으로
            </Button>
          </div>
          <p className="whitespace-pre-line text-center text-caption-2 text-gray-400">
            {STEP5_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="공사 시작 전 꼭 해야 할 일">
          <BulletList groups={STEP5_BEFORE_DEMOLITION} />
        </SectionCard>

        <div className="flex w-full flex-col gap-3">
          <SectionCard title="철거 업체 선정 및 진행 팁">
            <BulletList groups={STEP5_DEMOLITION_TIPS} />
          </SectionCard>

          <TipBox>
            <ul className="flex flex-col gap-1">
              <li className="flex items-start gap-1">
                <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
                <span className="text-caption-2 text-gray-700">
                  내력벽 등 구조물과 소방시설은 임의 철거할 수 없습니다.
                </span>
              </li>
            </ul>
          </TipBox>
        </div>

        <div className="flex w-full flex-col gap-4 rounded-xl bg-white p-4 shadow-[0_0_8px_0_rgba(159,159,162,0.02)]">
          <div>
            <p className="text-title-3 text-gray-900">
              마지막 날 공과금 일할 정산
            </p>
            <p className="mt-1 text-body-3 text-gray-500">
              임대인에게 키를 반납하는 날 아침에 정산 신청을 완료하세요.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2">
            {STEP5_UTILITIES.map((utility) => (
              <UtilityItemCard key={utility.title} title={utility.title}>
                {utility.description}
              </UtilityItemCard>
            ))}
          </div>
        </div>
      </div>
    </StepLayout>
  );
}

function Step9Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <StepLayout
      isFromAI={isFromAI}
      title={STEP9_HEADER.title}
      subtitle={STEP9_HEADER.subtitle}
      description={STEP9_HEADER.description}
      agreed={agreed}
      onAgreedChange={setAgreed}
      checkboxLabel={STEP9_HEADER.checkboxLabel}
      footer={
        <div className="flex flex-col items-center gap-3 px-4 pb-5 pt-2.5">
          {isFromAI ? (
            <Button variant="primary" fullWidth onClick={() => navigate(ROUTES.AI)}>
              폐업 맞춤 일정 생성하러 가기
            </Button>
          ) : (
            <Button variant="primary" fullWidth onClick={() => navigate(ROUTES.HOME)}>
              폐업 캘린더 보기
            </Button>
          )}
          <p className="text-center text-caption-2 text-gray-400">
            {STEP9_HEADER.footerNote}
          </p>
        </div>
      }
    >
      <div className="flex flex-col gap-4 bg-gray-30 px-4 py-6">
        <SectionCard title="종합소득세 확정 신고 기한">
          <BulletList groups={STEP9_DEADLINE} />
        </SectionCard>

        <div className="flex w-full flex-col gap-3">
          <SectionCard title="적자가 났어도 무조건 신고해야 하는 이유">
            <BulletList groups={STEP9_LOSS_FILING} />
          </SectionCard>

          <TipBox>
            <ul className="flex flex-col gap-1">
              <li className="flex items-start gap-1">
                <CheckIcon className="h-5 w-5 shrink-0 text-primary-500" />
                <span className="text-caption-2 text-gray-700">
                  '폐업했으니 세금도 끝'이라고 오해하여 신고를 빠뜨리면,
                  환급은커녕 가산세가 추가 고지되므로 절대 잊지 마세요!
                </span>
              </li>
            </ul>
          </TipBox>
        </div>

        <SectionCard title="미리 챙겨두면 좋은 세무 증빙 서류">
          <BulletList groups={STEP9_DOCUMENTS} />
        </SectionCard>
      </div>

      <div className="flex w-full flex-col items-center gap-3 bg-white px-4 py-6">
        <img src={cloyCircle} alt="" className="h-12 w-12 shrink-0" />
        <p className="text-title-2 text-primary-500">
          {STEP9_HEADER.celebrationTitle}
        </p>
        <div className="flex flex-col items-center gap-1 text-center text-body-2 text-gray-900">
          {STEP9_HEADER.celebrationLines.map((line, i) => (
            <p key={i} className="whitespace-pre-line">
              {line}
            </p>
          ))}
        </div>
      </div>
    </StepLayout>
  );
}

export default function GuideDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stepId = "" } = useParams();
  const dueDate = useGuideStore((s) => s.dueDate);
  const setDueDate = useGuideStore((s) => s.setDueDate);
  const isFromAI = (location.state as { from?: string } | null)?.from === "ai";

  if (stepId === "2") {
    return <Step2Page isFromAI={isFromAI} />;
  }

  if (stepId === "3") {
    return <Step3Page isFromAI={isFromAI} />;
  }

  if (stepId === "4") {
    return <Step4Page isFromAI={isFromAI} />;
  }

  if (stepId === "5") {
    return <Step5Page isFromAI={isFromAI} />;
  }

  if (stepId === "6") {
    return <Step6Page isFromAI={isFromAI} />;
  }

  if (stepId === "7") {
    return <Step7Page isFromAI={isFromAI} />;
  }

  if (stepId === "8") {
    return <Step8Page isFromAI={isFromAI} />;
  }

  if (stepId === "9") {
    return <Step9Page isFromAI={isFromAI} />;
  }

  if (stepId !== "1") {
    return (
      <div className="min-h-dvh bg-white">
        <TopBar title="가이드" onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)} />
        <p className="px-4 py-10 text-center text-body-2 text-gray-500">
          준비 중인 단계입니다.
        </p>
      </div>
    );
  }

  const content = STEP1_CONTENT;
  const dueDateError = validateDueDate(dueDate);

  return (
    <div className="min-h-dvh bg-white pb-28">
      <TopBar title={content.title} onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)} />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{content.subtitle}</p>
        <p className="mt-1 text-body-2 text-gray-700">{content.description}</p>
      </div>

      <div className="flex flex-col gap-3 bg-gray-30 px-4 py-6">
        {content.sections.map((section) => (
          <SectionCard key={section.title} title={section.title} size="compact">
            {section.body}
          </SectionCard>
        ))}
      </div>

      <div className="flex flex-col gap-2 bg-white px-4 py-5">
        <TextField
          label={content.inputLabel}
          placeholder={content.inputPlaceholder}
          value={dueDate}
          onChange={(e) =>
            setDueDate(e.target.value.replace(/\D/g, "").slice(0, 8))
          }
          error={dueDate.length > 0 ? (dueDateError ?? undefined) : undefined}
        />
        <NoteBox title={content.noteTitle} items={content.noteItems} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white px-4 pb-5 pt-2.5">
        <Button
          variant="primary"
          fullWidth
          disabled={dueDateError !== null}
          onClick={() => navigate(guideDetailPath(content.nextStepId), isFromAI ? { state: { from: "ai" } } : undefined)}
        >
          다음으로
        </Button>
      </div>
    </div>
  );
}
