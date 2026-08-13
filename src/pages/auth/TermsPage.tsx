import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  clearPendingSignup,
  readPendingSignup,
  saveAuthSession,
} from "../../auth/authSession";
import {
  CheckboxEmptyIcon,
  CheckboxFilledIcon,
  InformationIcon,
} from "../../assets/icons";
import TextField from "../../components/common/TextField";
import TopBar from "../../components/common/TopBar";
import TermsListSkeleton from "../../components/auth/TermsListSkeleton";
import { ROUTES } from "../../constants/routes";
import { queryClient } from "../../queryClient";
import { useSignupMutation, useTermsQuery } from "../../hooks/useAuth";

const TERM_LABELS: Record<string, string> = {
  SERVICE: "서비스 이용약관",
  PRIVACY: "개인정보 처리방침",
  AGE: "만 14세 이상입니다",
};

const PHONE_PATTERN = /^01[016789]-?\d{3,4}-?\d{4}$/;

function getTermLabel(type: string): string {
  return TERM_LABELS[type] ?? "서비스 이용약관";
}

export default function TermsPage() {
  const navigate = useNavigate();
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [pendingSignup] = useState(readPendingSignup);
  const [agreedTermIds, setAgreedTermIds] = useState<Set<number>>(
    () => new Set(),
  );
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [signupError, setSignupError] = useState<string | null>(null);
  const submitStarted = useRef(false);
  const mounted = useRef(true);
  const signupAttempt = useRef(0);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      signupAttempt.current += 1;
    };
  }, []);

  const termsQuery = useTermsQuery(pendingSignup !== null);
  const signupMutation = useSignupMutation({
    mountedRef: mounted,
    signupAttemptRef: signupAttempt,
    submitStartedRef: submitStarted,
    setSignupError,
    onSuccess: (session) => {
      saveAuthSession(session);
      clearPendingSignup();
      queryClient.clear();
      navigate(ROUTES.HOME, { replace: true });
    },
  });

  if (pendingSignup === null) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const terms = termsQuery.data ?? [];
  const isAllAgreed =
    terms.length > 0 && terms.every((term) => agreedTermIds.has(term.termId));
  const hasRequiredAgreements = terms
    .filter((term) => term.required)
    .every((term) => agreedTermIds.has(term.termId));
  const hasValidProfile =
    name.trim().length > 0 &&
    nickname.trim().length > 0 &&
    PHONE_PATTERN.test(phone.trim()) &&
    (email.trim().length === 0 || email.trim().includes("@"));
  const canSignup =
    termsQuery.isSuccess && hasRequiredAgreements && hasValidProfile;

  const setAllAgreements = (checked: boolean) => {
    setAgreedTermIds(
      checked ? new Set(terms.map((term) => term.termId)) : new Set(),
    );
  };

  const toggleTerm = (termId: number) => {
    setAgreedTermIds((current) => {
      const next = new Set(current);
      if (next.has(termId)) next.delete(termId);
      else next.add(termId);
      return next;
    });
  };

  const submitSignup = () => {
    if (!canSignup || signupMutation.isPending || submitStarted.current) return;

    submitStarted.current = true;
    signupMutation.mutate({
      profile: {
        name: name.trim(),
        nickname: nickname.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        image: profileImage ?? undefined,
      },
      termIds: terms
        .filter((term) => agreedTermIds.has(term.termId))
        .map((term) => term.termId),
    });
  };

  return (
    <main className="min-h-dvh bg-white pb-5">
      <TopBar title="서비스 약관 동의" onBack={() => navigate(ROUTES.LOGIN)} />

      <section className="px-5 pt-6">
        <h2 className="text-title-2 text-gray-900">
          안전한 서비스 이용을 위해<br />
          가입 정보와 약관을 확인해 주세요.
        </h2>
        <p className="mt-3 text-body-3 leading-[1.6] text-gray-600">
          클로징 서비스 이용에 필요한 기본 정보를 입력하고<br />
          필수 약관에 동의해 주세요.
        </p>

        <div className="mt-8 flex flex-col gap-4">
          <TextField
            label="이름"
            aria-label="이름"
            placeholder="실명을 입력해 주세요"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onClear={() => setName("")}
          />
          <TextField
            label="닉네임"
            aria-label="닉네임"
            placeholder="닉네임을 입력해 주세요"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onClear={() => setNickname("")}
          />
          <TextField
            label="전화번호"
            aria-label="전화번호"
            inputMode="tel"
            placeholder="010-1234-5678 ('-' 없이 입력 가능)"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            onClear={() => setPhone("")}
          />
          <TextField
            label="이메일 (선택)"
            aria-label="이메일 (선택)"
            type="email"
            placeholder="이메일을 입력해 주세요"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onClear={() => setEmail("")}
          />
          <div className="mb-1">
            <p className="mb-2 ml-0.5 text-title-3 text-gray-900">
              프로필 이미지 (선택)
            </p>
            <div className="flex h-[52px] items-center gap-3 rounded-lg border border-gray-200 px-4">
              <button
                type="button"
                onClick={() => profileImageInputRef.current?.click()}
                className="shrink-0 rounded-md border border-gray-300 px-3 py-1.5 text-caption-1 font-semibold text-gray-700"
              >
                이미지 선택
              </button>
              <span className="min-w-0 flex-1 truncate text-body-3 text-gray-500">
                {profileImage?.name ?? "선택된 이미지가 없습니다."}
              </span>
              {profileImage && (
                <button
                  type="button"
                  aria-label="선택한 프로필 이미지 삭제"
                  onClick={() => setProfileImage(null)}
                  className="shrink-0 text-caption-1 font-semibold text-gray-500"
                >
                  삭제
                </button>
              )}
            </div>
            <input
              ref={profileImageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                setProfileImage(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
          </div>
        </div>

        {termsQuery.isPending && <TermsListSkeleton />}

        {termsQuery.isError && (
          <div className="mt-12 text-center">
            <p role="alert" className="text-body-3 text-red-500">
              약관을 불러오지 못했습니다.
            </p>
            <button
              type="button"
              onClick={() => void termsQuery.refetch()}
              className="mt-4 rounded-lg border border-gray-300 px-4 py-2 text-body-3 font-semibold text-gray-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {termsQuery.isSuccess && (
          <>
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
              {terms.map((term) => {
                const label = `[${term.required ? "필수" : "선택"}] ${getTermLabel(term.type)}`;
                const isAgreed = agreedTermIds.has(term.termId);

                return (
                  <div key={term.termId} className="flex h-[56px] items-center">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isAgreed}
                      aria-label={label}
                      onClick={() => toggleTerm(term.termId)}
                      className="flex h-full flex-1 items-center gap-3 text-left"
                    >
                      {isAgreed ? (
                        <CheckboxFilledIcon className="h-5 w-5 shrink-0" />
                      ) : (
                        <CheckboxEmptyIcon className="h-5 w-5 shrink-0" />
                      )}
                      <span className="text-[13px] text-gray-700">{label}</span>
                    </button>
                    <span className="text-caption-2 font-semibold text-gray-400">
                      전문 보기
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

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

      <div className="mt-12 px-5">
        {signupError && (
          <p role="alert" className="mb-3 text-center text-body-3 text-red-500">
            {signupError}
          </p>
        )}
        <button
          type="button"
          disabled={!canSignup || signupMutation.isPending}
          onClick={submitSignup}
          className="h-[58px] w-full rounded-xl bg-gray-900 text-body-1 font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
        >
          동의하고 가입하기
        </button>
      </div>
    </main>
  );
}
