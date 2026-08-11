import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Checkbox from "../../components/common/Checkbox";
import SectionCard from "../../components/guide/SectionCard";
import NoteBox from "../../components/guide/NoteBox";
import TipBox from "../../components/guide/TipBox";
import BulletList from "../../components/guide/BulletList";
import type { BulletGroup } from "../../components/guide/BulletList";
import HighlightBox from "../../components/guide/HighlightBox";
import OptionBox from "../../components/guide/OptionBox";
import UtilityItemCard from "../../components/guide/UtilityItemCard";
import { CheckIcon } from "../../assets/icons";
import cloyCircle from "../../assets/images/cloy-circle.png";
import { ROUTES, guideDetailPath } from "../../constants/routes";

interface StepContent {
  title: string;
  subtitle: string;
  description: string;
  sections: { title: string; body: string }[];
  inputLabel: string;
  inputPlaceholder: string;
  noteTitle: string;
  noteItems: string[];
  nextStepId: number;
}

function parseDueDate(value: string): Date | null {
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(4, 6));
  const day = Number(value.slice(6, 8));
  if (month < 1 || month > 12) return null;

  const date = new Date(year, month - 1, day);
  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }
  return date;
}

function validateDueDate(value: string): string | null {
  if (value.length !== 8) {
    return "희망 종료일 8자리를 입력해 주세요.";
  }

  const parsed = parseDueDate(value);
  if (!parsed) {
    return "올바른 희망 종료일을 입력해 주세요.";
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (parsed <= today) {
    return "희망 종료일은 오늘 이후 날짜만 입력할 수 있습니다.";
  }

  return null;
}

const STEP_CONTENT: Record<string, StepContent> = {
  "1": {
    title: "STEP 1. 영업 종료일(폐업일) 산정",
    subtitle: "언제를 영업 종료일로 할까요?",
    description:
      "폐업일(영업종료일) 설정에 따라 남은 고정비와 세금 신고 기한이 달라집니다. 아래 항목을 체크해보세요.",
    sections: [
      {
        title: "임대차 계약 해지 통보 및 철거 고려",
        body: "건물주 통보(1~3개월 전) 후, 원상복구 공사가 끝나는 날이 좋습니다.",
      },
      {
        title: "부가세 신고 기한 확보 (월초 추천)",
        body: "말일보다 월초(예: 1~2일)로 잡으면 세금 납부 기한을 한 달 더 법니다.",
      },
      {
        title: "정부 철거 지원금 신청 타이밍",
        body: "최대 250만원 철거비는 '철거 공사 시작 전'에 무조건 신청해야 합니다.",
      },
      {
        title: "직원 해고 예고 기한 (30일 전)",
        body: "오늘 정할 종료일보다 최소 30일 전에 직원 통보가 끝나야 합니다.",
      },
    ],
    inputLabel: "희망 종료일 입력",
    inputPlaceholder: "YYYYMMDD (예: 20200101)",
    noteTitle: "선택한 날짜 기준 예상 마감 일정",
    noteItems: [
      "4대보험 탈퇴 신고 마감: 종료일로부터 14일 이내 (7단계)",
      "부가가치세 최종 신고 마감: 선택달 다음 달 25일까지 (8단계)",
    ],
    nextStepId: 2,
  },
};

interface Step2Section {
  title: string;
  groups: BulletGroup[];
  templateButton?: boolean;
}

const STEP2_HEADER = {
  title: "STEP 2. 임대차 계약 해지 통보 및 조율",
  subtitle: "폐업의 시작은 건물주에게 알리는 것",
  description:
    "계약 종료를 미리 알리지 않으면 묵시적 갱신이 되어 예상치 못한 월세를 더 부담하거나 임대인과 분쟁이 생길 수 있습니다.",
  checkboxLabel: "임대인에게 해지 통보 및 원상복구 협의를 마쳤습니다.",
};

const STEP2_SECTIONS: Step2Section[] = [
  {
    title: "언제 통보해야 하나요?",
    groups: [
      {
        heading: "계약 종료 의사는 가능한 한 빨리 전달하세요",
        items: [
          "임차인은 계약 만료 전까지 계약을 연장하지 않겠다는 의사를 밝히면 묵시적 갱신을 막을 수 있습니다.",
          "원상복구와 보증금 반환 일정을 함께 조율하기 위해 실무적으로는 1~3개월 전에 미리 협의하는 것이 원활한 계약 종료에 도움이 됩니다.",
        ],
      },
    ],
  },
  {
    title: "어떻게 통보해야 안전할까요?",
    groups: [
      {
        heading: "구두 통보(전화)는 위험합니다",
        items: [`"그런 말 들은 적 없다"고 오리발을 내미는 분쟁이 정말 많습니다.`],
      },
      {
        heading: "효력이 있는 증거 남기기",
        items: [
          "문자 메시지 또는 카카오톡 (확인 답변까지 받아두기)",
          "가장 확실한 방법: 우체국 '내용증명' 발송",
        ],
      },
    ],
    templateButton: true,
  },
  {
    title: "계약 기간이 남아있다면? 중도해지 합의법",
    groups: [
      {
        heading: "임대인과의 원활한 합의를 위한 3가지 카드",
        items: [
          "다음 임차인 맞추기: 가장 현실적인 방법으로, 직접 권리금을 낮추거나 중개보수(복비)를 사장님이 부담하는 조건으로 새 임차인을 구합니다.",
          "합의금(위약금) 제안: 도저히 다음 사람을 구하기 힘들 땐, 관례적으로 2~3개월 분의 월세를 합의금으로 차감 제안하여 보증금을 돌려받습니다.",
          "중도해지 특약 확인: 계약서에 중도해지 관련 조항이 있는지 먼저 체크하세요.",
        ],
      },
    ],
  },
  {
    title: "건물주와 꼭 미리 확인해야 할 것",
    groups: [
      {
        heading: "원상 복구 범위 못 박기",
        items: [
          "철거 공사를 시작하기 전, 어느 선까지 부수고 철거해야 하는지 건물주와 명확히 선을 그어야 철거 비용을 아낍니다.",
          "내가 들어올 때 있던 시설물만 철거하는 것이 원칙이나, 전 임차인에게 승계받은 경우 분쟁 소지가 있으니 확답을 받으세요.",
        ],
      },
    ],
  },
];

function Step2Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30 pb-36">
      <TopBar
        title={STEP2_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP2_HEADER.subtitle}</p>
        <p className="mt-1 text-body-2 text-gray-500">
          {STEP2_HEADER.description}
        </p>
      </div>

      <div className="flex flex-col gap-4 px-4 py-6">
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

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP2_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP3_HEADER = {
  title: "STEP 3. 직원 퇴사 및 해고 예고 통보",
  subtitle: "노무 분쟁 없는 안전한 인사 정리",
  description:
    "근로기준법상 퇴사 처리 기준과 의무 고지 기한을 준수하여 폐업 시 발생할 수 있는 원치 않는 노무 리스크를 선제 해결합니다.",
  checkboxLabel: "직원 퇴사 통보 및 노무 준수 사항을 확인했습니다.",
  footerNote:
    "인사 정리가 가닥을 잡으면 4단계 '재고·집기 처분'으로 이동합니다.",
};

const STEP3_CHECKLIST: BulletGroup[] = [
  {
    heading: "최소 30일 전 '해고 예고'하기",
    items: [
      "폐업일 기준 최소 30일 전에 직원에게 서면 통보해야 합니다.",
      "30일보다 늦게 통보하면 미지급 일수에 상관없이 30일치 이상의 통상임금(해고예고수당)을 의무 지급해야 합니다.",
    ],
  },
  {
    heading: "퇴직금 및 미지급 입금 정산",
    items: [
      "주 15시간 이상, 1년 이상 근무한 근로자 대상",
      "폐업일(퇴직일)로부터 14일 이내에 지급 완료 필수",
      "기한 연장은 반드시 근로자와의 '서면 합의서'가 필요합니다.",
    ],
  },
];

// TODO: STEP1 희망 종료일(dueDate) 상태와 연동해 계산하도록 변경. 현재는 정적 텍스트로 하드코딩
const STEP3_DEADLINE_ROWS = [
  { label: "희망 영업 종료일 (1단계 연동)", value: "2026년 07월 15일" },
  {
    label: "직원 해고 통보 마지노선 (최소 30일 전)",
    value: "2026년 06월 15일 이전",
    valueColor: "primary-500" as const,
  },
];

function Step3Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30">
      <TopBar
        title={STEP3_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP3_HEADER.subtitle}</p>
        <p className="mt-1 text-body-2 text-gray-700">
          {STEP3_HEADER.description}
        </p>
      </div>

      <div className="bg-gray-30 px-4 py-6">
        <SectionCard title="직원 정리 필수 체크">
          <BulletList groups={STEP3_CHECKLIST} />
        </SectionCard>
      </div>

      <div className="flex flex-col gap-4 bg-white px-4 pt-4 pb-44">
        <div className="px-0.5">
          <p className="text-title-3 text-gray-900">
            내 매장 해고 통보 마지노선 계산
          </p>
          <p className="text-body-2 text-gray-500">
            1단계에서 정한 영업 종료일을 기반으로 산정된 안전 기한입니다.
          </p>
        </div>
        <HighlightBox rows={STEP3_DEADLINE_ROWS} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP3_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP6_HEADER = {
  title: "STEP 6. 사업자등록 및 인허가 폐업 신고",
  subtitle: "세무서와 구청 신고를 한 번에 해결하기",
  description:
    "사업자등록만 폐업하고 구청 허가를 남겨두면 매년 면허세가 부과됩니다. 반드시 원스톱으로 처리하세요.",
  checkboxLabel: "관공서 통합 폐업 신고 방법을 이해했습니다.",
  footerNote:
    "서류 신고가 접수되면 가장 까다로운 5단계 부가세 정산으로 이동합니다.",
};

const STEP6_WHERE_TO_FILE: BulletGroup[] = [
  {
    heading: "온라인으로 한 번에 (추천)",
    items: [
      "정부24 '폐업신고 원스톱 서비스'를 이용하면 편리합니다.",
      "단, 업종 및 지역(지자체)별로 제한이 있을 수 있습니다.",
      "내 업종·지역 가능 여부는 각 시·구청 홈페이지에서 확인 가능합니다.",
    ],
  },
];

const STEP6_VISIT_IN_PERSON: BulletGroup[] = [
  {
    heading: "직접 방문하여 신청할 때",
    items: [
      "통합 처리가 안 되는 업종/지역이라면 구청 민원실을 먼저 방문하세요.",
      "구청에서 인허가 폐업 시 '사업자등록 폐업서류'도 같이 접수해줍니다.",
    ],
  },
];

interface RequiredDoc {
  label: string;
  note?: string;
}

const STEP6_REQUIRED_DOCS: RequiredDoc[] = [
  { label: "신분증 (대표자 본인)" },
  { label: "사업자등록증 원본" },
  {
    label: "영업허가증 · 신고증 원본 (인허가 업종 필수)",
    note: "※ 통합 신고가 안 되는 업종은 구청/세무서 각각 원본이 필요",
  },
];

const STEP6_BEFORE_FILING: BulletGroup[] = [
  {
    heading: "1) 다음 달 세금 폭탄 스케줄 작동",
    items: [
      "오늘 폐업 신고가 완료되면, 바로 다음 달 25일까지 부가가치세 확정 신고를 끝내야 합니다. (기한 초과 시 가산세)",
    ],
  },
  {
    heading: "2) 면허 대여 및 양도 행위 금지",
    items: [
      "인허가증을 폐업하지 않고 타인에게 그대로 넘기면 추후 발생하는 위법 행위의 책임이 기존 사장님에게 옵니다.",
    ],
  },
  {
    heading: "3) 폐업 사실 증명원 발급해두기",
    items: [
      "정상 처리 후 홈택스에서 '폐업사실증명원'을 발급받아 두세요. 통신비 해지, 4대보험 조정 등 증빙 서류로 요긴하게 쓰입니다.",
    ],
  },
];

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
    <div className="min-h-dvh bg-gray-30 pb-44">
      <TopBar
        title={STEP6_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP6_HEADER.subtitle}</p>
        <p className="mt-1 text-body-2 text-gray-700">
          {STEP6_HEADER.description}
        </p>
      </div>

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

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP6_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP7_HEADER = {
  title: "STEP 7. 4대보험 탈퇴 및 상실 신고",
  subtitle: "매달 나가는 보험료 고지서 멈추기",
  description:
    "폐업 후 상실 신고를 하지 않으면 보험료가 계속 부과됩니다. 직원 상실 신고와 사업장 탈퇴 처리를 기한 내에 완료하세요.",
  checkboxLabel: "4대보험 상실 및 탈퇴 신고 절차를 확인했습니다.",
  footerNote:
    "인사/노무 관련 행정 처리가 완결되면,\n다음 8단계 '부가가치세 확정 신고' 단계로 이동합니다.",
};

const STEP7_WHEN: BulletGroup[] = [
  {
    heading: "사유 발생일(폐업일) 기준 '다음 달 15일'까지",
    headingEmphasis: true,
    items: [
      "고용·산재보험 등 기한 초과 시 지연신고 과태료가 발생합니다.",
      "공단 간 연계 처리를 위해 폐업 즉시 신청하는 것을 권장합니다.",
    ],
  },
];

const STEP7_WITH_EMPLOYEES: BulletGroup[] = [
  {
    heading: "1) 직원이 있었던 경우 (근로자 상실 + 사업장 탈퇴)",
    items: [
      "1단계: 퇴사한 직원들의 '4대보험 자격상실 신고서' 접수",
      "2단계: 직원 처리 완료 후 '사업장 탈퇴(소멸) 신고서' 제출",
      "주의: 직원 상실 처리가 먼저 끝나야 사업장 탈퇴가 가능합니다.",
      "고용보험 상실 사유는 반드시 '폐업으로 인한 이직'으로 처리",
    ],
  },
];

const STEP7_WITHOUT_EMPLOYEES: BulletGroup[] = [
  {
    heading: "2) 직원이 없었던 경우 (대표자 1인 사업장)",
    items: [
      "별도의 직원 상실 신고 없이 '사업장 탈퇴 신고'만 진행합니다.",
      "폐업 후 대표자 개인은 자동으로 '지역가입자'로 전환됩니다.",
    ],
  },
];

const STEP7_WHERE: BulletGroup[] = [
  {
    heading: "4대사회보험 정보연계센터 (원스톱 처리)",
    items: [
      "각 공단을 일일이 방문할 필요 없이, 해당 포털에서 [사업장 탈퇴신고]를 진행하면 국민연금·건강보험·고용·산재보험이 일괄 접수됩니다.",
      {
        text: "4대사회보험 정보연계센터 바로가기",
        underline: true,
        href: "https://www.4insure.or.kr",
      },
    ],
  },
];

const STEP7_HEALTH_INSURANCE: BulletGroup[] = [
  {
    heading: "[필수] 국민건강보험공단에 '조정 신청' 하기",
    headingEmphasis: true,
    items: [
      "직장가입자에서 지역가입자로 전환되면 전년도 매출 기준으로 보험료가 부과되어 예상보다 많이 나올 수 있습니다.",
      "국민건강보험공단에 6단계에서 발급받은 '폐업사실증명원'을 건강보험공단(1577-1000)에 전화해 서류를 팩스로 제출하거나, 지사 방문을 통해 제출하면, 폐업 이후 기간에 대해 기존 사업소득 부과분을 즉시 조정(감면)받을 수 있습니다.",
      {
        text: "※ 조정을 안 하면 수입이 없는데도 매달 수십만 원씩 청구됩니다!",
        emphasis: true,
      },
    ],
  },
];

function Step7Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30 pb-44">
      <TopBar
        title={STEP7_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP7_HEADER.subtitle}</p>
        <p className="mt-1 text-body-2 text-gray-700">
          {STEP7_HEADER.description}
        </p>
      </div>

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

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP7_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP8_HEADER = {
  title: "STEP 8. 부가가치세 및 잔존재화 신고",
  subtitle: "세무 마감하고 잔존재화 정산하기",
  description:
    "폐업 후 가장 중요한 첫 번째 세금 정산 단계입니다.\n최종 매출·매입 신고는 물론, 매장에 남은 자산까지 확인하세요.",
  checkboxLabel: "부가세 및 잔존재화 신고 안내를 확인했습니다.",
};

const STEP8_DEADLINE: BulletGroup[] = [
  {
    heading: "폐업일이 속한 달의 '다음 달 25일' 이내",
    headingEmphasis: true,
    items: [
      "기한을 넘기면 매입세액 공제 불가 + 무신고 가산세가 부과됩니다.",
      "실적이 전혀 없는 '무실적' 상태여도 무조건 신고해야 합니다.",
    ],
  },
];

const STEP8_REMAINING_ASSETS: BulletGroup[] = [
  {
    heading: "1) 판매용 상품 / 원재료 (재고자산)",
    items: ["폐업 당일 매장에 남은 재고 금액의 10%를 세금으로 부담"],
  },
  {
    heading: "2) 인테리어 / 시설장치 (2년 이내 폐업)",
    items: ["6개월당 25%씩 가치 감액 후, 남은 가치에 대해 부가세 부과"],
  },
  {
    heading: "3) 기계 / 비품 / 차량 (5년 이내 폐업)",
    items: ["과세기간당 5%씩 가치 감액 후, 남은 가치에 대해 부가세 부과"],
  },
];

const STEP8_TEARDOWN_COST: BulletGroup[] = [
  {
    heading: "5단계 철거비용 및 마지막 달 공과금 합산",
    items: [
      "철거업체 지불 대금의 세금계산서로 매입세액 공제 가능",
      "해지 직전까지의 매장 임차료, 한전/수도 세금계산서 반영",
    ],
  },
];

const STEP8_FILING_METHODS: BulletGroup[] = [
  {
    heading: "1) 국세청 홈택스 직접 신고 (셀프)",
    items: ["구조가 단순하고 매장에 남은 잔존재화가 없을 때 권장"],
  },
  {
    heading: "2) 세무대리인 대행 신고 (추천)",
    items: ["포괄양도양수 계약이거나 자산 감가상각이 얽혀있을 때"],
  },
];

const STEP8_INCOME_TAX_ROWS = [
  {
    label: "종합소득세 확정신고 기한",
    value: "2027년 05월 01일 ~ 05월 31일",
    valueSize: "title-2" as const,
    valueColor: "primary-500" as const,
  },
];

const STEP8_INCOME_TAX_NOTE =
  "올해 1월 1일부터 폐업일까지의 최종 사업 소득 실적을 내년 5월에 정산 완료하며 대장정이 마무리됩니다.";

function Step8Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30">
      <TopBar
        title={STEP8_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP8_HEADER.subtitle}</p>
        <p className="mt-1 whitespace-pre-line text-body-2 text-gray-700">
          {STEP8_HEADER.description}
        </p>
      </div>

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

      <div className="flex flex-col gap-4 bg-white px-4 pt-4 pb-36">
        <p className="text-title-3 text-gray-900">
          내년 5월, 종합소득세 최종 확정신고
        </p>
        <HighlightBox rows={STEP8_INCOME_TAX_ROWS} note={STEP8_INCOME_TAX_NOTE} />
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP8_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP4_HEADER = {
  title: "STEP 4. 재고·집기 처분 가이드",
  subtitle: "손실 없는 물품 처분과 자금 확보",
  description:
    "매장 집기는 제값 받고 팔아 철거비에 보태고,\n남은 재고는 미리 털어내어 불필요한 세금을 방지하세요.",
  checkboxLabel: "재고 및 매장 집기 처분 계획을 확인했습니다.",
  footerNote:
    "물건 정리가 끝나면 복잡한 세금 신고를 도와줄\n5단계 '세무대리인 선임 및 서류 준비'로 이동합니다.",
};

const STEP4_FIXTURES: BulletGroup[] = [
  {
    heading: "1) 주방 설비 · 가구 개별 견적 받기",
    items: [
      "철거업체에 일괄로 넘기기 전, 중고 주방/가구 전문 업체에 개별 처분하는 것이 매각 대금을 훨씬 더 높게 받는 방법입니다.",
    ],
  },
  {
    heading: "2) 렌탈 제품(정수기, POS, 제빙기) 해지",
    items: [
      "의무 약정 기간이 남았다면 위약금이 발생하므로 미리 본사에 확인하여 명의 변경(양도)이 가능한지 체크해보세요.",
    ],
  },
];

const STEP4_INVENTORY: BulletGroup[] = [
  {
    heading: "폐업 시 '잔존재화' 세금 폭탄 주의",
    items: [
      "폐업할 때 매장에 남아있는 원재료나 재고 상품은 사업자가 스스로에게 판매한 것으로 간주하여 부가가치세(10%)가 추가로 부과됩니다.",
      "마진을 보지 않더라도 폐업 전에 땡처리 세일이나 원가 이하로 모두 처분하여 장부상 재고를 최소화하는 것이 절대적으로 이득입니다.",
    ],
  },
];

const STEP4_COMPARISON: { heading: string; items: string[] }[] = [
  {
    heading: "중고 직거래/업체",
    items: ["번거로움: 높음", "자금 회수: 높음", "추천 대상: 시간 여유"],
  },
  {
    heading: "철거업체 일괄 통매각",
    items: ["번거로움: 없음", "자금 회수: 낮음", "추천 대상: 빠른 정리"],
  },
];

function Step4Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30 pb-44">
      <TopBar
        title={STEP4_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP4_HEADER.subtitle}</p>
        <p className="mt-1 whitespace-pre-line text-body-2 text-gray-700">
          {STEP4_HEADER.description}
        </p>
      </div>

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

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP4_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP5_HEADER = {
  title: "STEP 5. 매장 철거 및 원상복구 가이드",
  subtitle: "임대인과의 분쟁과 철거비 낭비 막기",
  description:
    "가장 분쟁이 많은 단계입니다. 철거 시작 전에\n원상복구 범위와 정부 지원금 자격을 먼저 확인하세요.",
  checkboxLabel: "위 항목을 모두 확인했으며 철거 준비를 마쳤습니다.",
  footerNote:
    "물리적인 매장 철거와 열쇠 반납이 마무리되면,\n6단계 '사업자등록 및 인허가 폐업 신고' 단계로 이동합니다.",
};

const STEP5_BEFORE_DEMOLITION: BulletGroup[] = [
  {
    heading: "정부 점포철거비 지원금 신청",
    items: [
      "희망리턴패키지 지원금은 반드시 '철거 전' 신청!",
      "공사가 이미 시작되면 수백만 원의 지원 자격이 박탈됩니다.",
      "신청 후 업체가 현장 사전 진단을 올 때까지 대기하세요.",
    ],
  },
  {
    heading: "임대차 계약서 '원상복구' 범위 확정",
    items: [
      "전 임차인 인테리어를 그대로 이어받아 창업한 경우, 내가 고친 부분만 부술지 전체를 부술지 임대인과 조율 필수.",
      "합의된 철거 범위를 사진이나 문자로 남겨두어야 추후 보증금 반환 시 분쟁을 예방할 수 있습니다.",
    ],
  },
];

const STEP5_DEMOLITION_TIPS: BulletGroup[] = [
  {
    heading: "1) 최소 2~3곳 비교 견적 받기",
    items: ["폐기물 처리비가 포함된 견적인지 반드시 확인하세요."],
  },
  {
    heading: "2) 폐기물 처리 증명서 요구하기",
    items: ["불법 투기 시 배출자인 사장님에게 과태료가 부과될 수 있습니다."],
  },
  {
    heading: "3) 철거 전·후 사진 촬영 (지원금 증빙용)",
    items: ["정부 지원금 정산을 위해 정면 간판, 내부 전경 사진이 꼭 필요합니다."],
  },
];

const STEP5_UTILITIES = [
  {
    title: "전기요금 (한국전력 ☎123)",
    description: "계량기 현재 지침(숫자) 확인 후 상담원 연결하여 정산 및 납부",
  },
  {
    title: "수도요금 (관할 수도사업소)",
    description: "수도 계량기 숫자를 확인하고 관할 구역 사업소에 전화해 정산",
  },
  {
    title: "도시가스 (지역 공급업체)",
    description: "정한 종료일 기준, 최소 30일 전 직원 통보가 필요합니다.",
  },
];

function Step5Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30 pb-44">
      <TopBar
        title={STEP5_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP5_HEADER.subtitle}</p>
        <p className="mt-1 whitespace-pre-line text-body-2 text-gray-700">
          {STEP5_HEADER.description}
        </p>
      </div>

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

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP5_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

const STEP9_HEADER = {
  title: "STEP 9. 종합소득세 확정 신고",
  subtitle: "최종 소득세 정산하기",
  description:
    "폐업을 했어도 당해 연도 1월 1일부터 폐업일까지 발생한\n최종 사업 소득에 대해 이듬해 5월 반드시 정산해야 합니다.",
  checkboxLabel: "모든 단계의 가이드를 마스터하고 확인했습니다.",
  celebrationTitle: "폐업 완료!",
  celebrationLines: [
    "매장 철거, 관공서 신고, 4대보험 행정 처리와 마지막 종합소득세 정산 로드맵까지 모두 확인하셨습니다.",
    "놓친 항목 없이 깔끔하게 매듭짓고,\n사장님의 더 찬란한 다음 시작을 응원합니다!",
  ],
  footerNote:
    "마친 가이드 단계를 바탕으로 스케줄링된 전체 일정을 조율할 수 있습니다.",
};

const STEP9_DEADLINE: BulletGroup[] = [
  {
    heading: "폐업일 다음 해 5월 1일 ~ 5월 31일",
    headingEmphasis: true,
    items: [
      "기한 내 미신고 시 무신고 가산세(최대 20%)가 부과됩니다.",
      "타 직장 근로소득 등 다른 소득이 있다면 반드시 합산해야 합니다.",
    ],
  },
];

const STEP9_LOSS_FILING: BulletGroup[] = [
  {
    heading: "1) 적자(결손금) 증명 및 소득세 환급",
    items: ["장부 작성을 통해 적자를 증명하면 낼 세금이 없고 환급이 가능합니다."],
  },
  {
    heading: "2) 향후 15년간 이월결손금 공제 혜택",
    items: [
      "올해 발생한 적자는 앞으로 새로운 사업 소득에서 공제받아 미래의 세금을 줄여주는 강력한 절세 자산이 됩니다.",
    ],
  },
];

const STEP9_DOCUMENTS: BulletGroup[] = [
  {
    heading: "1) 국세청 홈택스 제공 자료 확인",
    items: ["종합소득세 신고 안내문(유형 확인), 사업용신용카드 내역 조회"],
  },
  {
    heading: "2) 폐업 관련 최종 비용 영수증",
    items: ["세금계산서 미발행된 철거비 내역, 권리금 계약서, 중개수수료 등"],
  },
  {
    heading: "3) 기타 소득공제 및 세액공제 서류",
    items: ["노란우산공제 납입증명서, 기부금 영수증 등"],
  },
];

function Step9Page({ isFromAI }: { isFromAI: boolean }) {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-dvh bg-gray-30 pb-44">
      <TopBar
        title={STEP9_HEADER.title}
        onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)}
      />

      <div className="bg-white px-4 py-5">
        <p className="text-title-3 text-gray-900">{STEP9_HEADER.subtitle}</p>
        <p className="mt-1 whitespace-pre-line text-body-2 text-gray-700">
          {STEP9_HEADER.description}
        </p>
      </div>

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

        <div className="flex w-full flex-col items-center gap-3 py-2">
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
      </div>

      <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-app min-w-[var(--container-app-min)] -translate-x-1/2 border-t border-gray-100 bg-white">
        <div className="px-4 pb-3 pt-5">
          <Checkbox
            checked={agreed}
            onChange={setAgreed}
            label={
              <span className="text-body-2 text-gray-900">
                {STEP9_HEADER.checkboxLabel}
              </span>
            }
          />
        </div>
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
      </div>
    </div>
  );
}

export default function GuideDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { stepId = "" } = useParams();
  const [dueDate, setDueDate] = useState("");
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

  const content = STEP_CONTENT[stepId];
  const dueDateError = validateDueDate(dueDate);

  if (!content) {
    return (
      <div className="min-h-dvh bg-gray-30">
        <TopBar title="가이드" onBack={() => navigate(ROUTES.GUIDE, isFromAI ? { state: { from: "ai" } } : undefined)} />
        <p className="px-4 py-10 text-center text-body-2 text-gray-500">
          준비 중인 단계입니다.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-30">
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

      <div className="flex flex-col gap-2 bg-white px-4 pt-5 pb-28">
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
