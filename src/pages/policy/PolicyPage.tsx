import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../../components/common/TopBar";
import Tabs from "../../components/common/Tabs";
import Dropdown from "../../components/common/Dropdown";

type PolicyTab = "terms" | "privacy";

interface PolicyArticle {
  title: string;
  body: string;
}

const TABS: { key: PolicyTab; label: string }[] = [
  { key: "terms", label: "서비스 이용약관" },
  { key: "privacy", label: "개인정보 처리방침" },
];

// TODO: 시행일자 이력 API 연동 전까지 현재 버전 단일 옵션만 제공
const EFFECTIVE_DATE_OPTIONS = [
  { key: "current", label: "2026.06.20 (현재)" },
];

const TERMS_ARTICLES: PolicyArticle[] = [
  {
    title: "제 1 조 (목적)",
    body: "본 약관은 클로징(이하 '회사')이 제공하는 폐업 통합 관리 플랫폼 서비스(이하 '서비스')의 이용과 관련하여 회사와 이용자 간의 권리, 의무 및 책임사항을 규정합니다.",
  },
  {
    title: "제 2 조 (용어의 정의)",
    body: [
      `① "서비스"란 폐업 절차 안내, AI 기반 폐업 일정 생성, 사업자 인증 기반 중고거래 마켓플레이스 등을 의미합니다.`,
      `② "이용자"란 본 약관에 동의하고 서비스를 이용하는 자입니다.`,
      `③ "판매자"란 사업자 인증을 완료하고 상품을 등록하는 자입니다.`,
    ].join("\n"),
  },
  {
    title: "제 3 조 (약관의 효력 및 변경)",
    body: [
      "③ 약관 변경 시 변경 내용과 시행일을 명시하여 최소 7일 전 (불리한 변경은 최소 30일 전) 공지사항을 통해 공지합니다.",
      "④ 변경 시행일 이후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 간주합니다.",
    ].join("\n"),
  },
  {
    title: "제 4 조 (서비스 이용계약의 성립)",
    body: [
      "① 카카오 소셜 로그인을 통해 회원가입을 완료한 시점에 성립합니다.",
      "② 타인 명의 도용, 만 14세 미만, 과거 규정 위반 가입자의 경우 회사는 이용계약 신청을 거절할 수 있습니다.",
    ].join("\n"),
  },
  {
    title: "제 5 조 (서비스의 내용)",
    body: [
      "회사는 이용자에게 다음과 같은 핵심 서비스를 제공합니다.",
      "1. AI기반 개인화 폐업 일정 생성 서비스",
      "2. 단계별 폐업 절차 안내 및 가이드 서비스",
      "3. 사업자 인증 기반 중고거래 마켓플레이스",
    ].join("\n"),
  },
];

const PRIVACY_ARTICLES: PolicyArticle[] = [
  {
    title: "제 1 조 (개인정보의 수집 및 이용 목적)",
    body: [
      "'클로징'은 다음의 목적을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는 목적 외의 용도로는 이용되지 않으며, 변경 시 사전 동의를 구할 예정입니다.",
      "1. 회원 가입 의사 확인 및 맞춤형 폐업 스케줄링 제공",
      "2. 4대보험 탈퇴 및 세무 확정 신고 가이드 연계 안내",
    ].join("\n"),
  },
  {
    title: "제 2 조 (수집하는 개인정보 항목)",
    body: [
      "회사는 회원가입 및 서비스 신청 시 아래와 같은 개인정보를 수집하고 있습니다.",
      "- 필수항목: 성명, 사업자등록번호, 휴대폰 번호, 이메일",
      "- 선택항목: 폐업 예정일, 매장 업종 및 규모",
    ].join("\n"),
  },
  {
    title: "제 3 조 (개인정보의 보유 및 이용기간)",
    body: "원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 전자상거래법 등 최대 5년간 회원 정보를 안전하게 보관합니다.",
  },
];

const ARTICLES_BY_TAB: Record<PolicyTab, PolicyArticle[]> = {
  terms: TERMS_ARTICLES,
  privacy: PRIVACY_ARTICLES,
};

export default function PolicyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<PolicyTab>("terms");
  const [effectiveDate, setEffectiveDate] = useState(
    EFFECTIVE_DATE_OPTIONS[0].key,
  );

  return (
    <div className="min-h-screen bg-white">
      <TopBar title="약관 및 정책" onBack={() => navigate(-1)} />

      <Tabs
        tabs={TABS}
        value={activeTab}
        onChange={(key) => setActiveTab(key as PolicyTab)}
      />

      <div className="flex flex-col items-center px-4">
        <div className="flex w-full items-center gap-5 py-5">
          <p className="text-body-2 text-gray-900">시행 일자 선택</p>
          <Dropdown
            options={EFFECTIVE_DATE_OPTIONS}
            value={effectiveDate}
            onChange={setEffectiveDate}
            variant="muted"
            hideSelectedFromList={false}
          />
        </div>

        <div className="flex w-full flex-col gap-6 rounded-xl border border-gray-100 bg-gray-5 p-4 pb-6">
          {ARTICLES_BY_TAB[activeTab].map((article) => (
            <div key={article.title} className="flex flex-col gap-1">
              <p className="text-subtitle-2 text-gray-900">{article.title}</p>
              <p className="whitespace-pre-line text-body-3 text-gray-700">
                {article.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
