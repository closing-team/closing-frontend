import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckboxEmptyIcon,
  CheckboxFilledIcon,
  InformationIcon,
} from "../../assets/icons";
import TopBar from "../../components/common/TopBar";
import { ROUTES } from "../../constants/routes";
import { useAgreeTermsMutation, useTermsQuery } from "../../hooks/useTerms";
import type { TermDto } from "../../types/termsApi";

interface TermsFormProps {
  terms: TermDto[];
}

function TermsForm({ terms }: TermsFormProps) {
  const navigate = useNavigate();
  const agreeTerms = useAgreeTermsMutation();
  const [agreements, setAgreements] = useState<boolean[]>(() => terms.map(() => false));

  const requiredIndexes = terms
    .map((term, index) => (term.required ? index : -1))
    .filter((index) => index !== -1);
  const isAllAgreed = requiredIndexes.every((index) => agreements[index]);

  const setAllAgreements = (checked: boolean) => {
    setAgreements(terms.map(() => checked));
  };

  const toggleAgreement = (index: number) => {
    setAgreements((current) => current.map((checked, itemIndex) => (
      itemIndex === index ? !checked : checked
    )));
  };

  const handleSubmit = () => {
    const termIds = terms
      .filter((_, index) => agreements[index])
      .map((term) => term.termId);

    agreeTerms.mutate(
      { termIds },
      { onSuccess: () => navigate(ROUTES.HOME, { replace: true }) },
    );
  };

  return (
    <main className="min-h-dvh bg-white pb-5">
      <TopBar title="서비스 약관 동의" onBack={() => navigate(ROUTES.LOGIN)} />

      <section className="px-5 pt-6">
        <h2 className="text-title-2 text-gray-900">
          안전한 서비스 이용을 위해<br />
          약관에 동의해 주세요.
        </h2>
        <p className="mt-3 text-body-3 leading-[1.6] text-gray-600">
          클로징 서비스 제공을 위해 최소한의 필수 동의 및<br />
          개인정보 수집 및 자격 확인이 필요합니다.
        </p>

        <button
          type="button"
          role="checkbox"
          aria-checked={isAllAgreed}
          aria-label="약관 및 안내에 전체 동의합니다."
          onClick={() => setAllAgreements(!isAllAgreed)}
          className="mt-7 flex h-[68px] w-full items-center gap-3 rounded-xl border border-gray-700 px-4 text-left"
        >
          {isAllAgreed ? (
            <CheckboxFilledIcon className="h-6 w-6 shrink-0" />
          ) : (
            <CheckboxEmptyIcon className="h-6 w-6 shrink-0" />
          )}
          <span className="text-body-2 font-semibold text-gray-900">
            약관 및 안내에 전체 동의합니다.
          </span>
        </button>

        <div className="mt-4 divide-y divide-gray-100">
          {terms.map((term, index) => (
            <div key={term.termId} className="flex h-[56px] items-center">
              <button
                type="button"
                role="checkbox"
                aria-checked={agreements[index]}
                aria-label={term.content}
                onClick={() => toggleAgreement(index)}
                className="flex h-full flex-1 items-center gap-3 text-left"
              >
                {agreements[index] ? (
                  <CheckboxFilledIcon className="h-5 w-5 shrink-0" />
                ) : (
                  <CheckboxEmptyIcon className="h-5 w-5 shrink-0" />
                )}
                <span className="text-[13px] text-gray-700">
                  {term.required ? "[필수] " : "[선택] "}
                  {term.content}
                </span>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-5 p-3">
          <div className="flex items-center gap-1.5">
            <InformationIcon className="h-4 w-4 text-gray-600" />
            <h3 className="text-caption-1 text-gray-700">이용 자격 제한 안내</h3>
          </div>
          <p className="mt-3 text-[11px] leading-[1.45] text-gray-600">
            클로징은 관련 법령 및 안전한 비즈니스 마켓플레이스<br />
            운영 정책에 따라 만 14세 미만의 아동은 가입이 제한됩니다.
          </p>
        </div>
      </section>

      <div className="mt-[104px] px-5">
        <button
          type="button"
          disabled={!isAllAgreed || agreeTerms.isPending}
          onClick={handleSubmit}
          className="h-[58px] w-full rounded-xl bg-gray-900 text-body-1 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          동의하고 가입하기
        </button>
      </div>
    </main>
  );
}

export default function TermsPage() {
  const navigate = useNavigate();
  const { data: terms, isLoading } = useTermsQuery();

  if (isLoading || !terms) {
    return (
      <main className="min-h-dvh bg-white pb-5">
        <TopBar title="서비스 약관 동의" onBack={() => navigate(ROUTES.LOGIN)} />
      </main>
    );
  }

  return <TermsForm terms={terms} />;
}
