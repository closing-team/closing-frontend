import { useRef, useState } from "react";
import kakao from "../../assets/images/kakao.png";
import cloyBlur from "../../assets/images/cloy-blur.png";
import logo from "../../assets/images/logo.png";
import wordmark from "../../assets/images/wordmark.svg";
import { startKakaoAuthorization } from "../../auth/kakaoOAuth";

type LoginPageProps = {
  onStartKakaoAuthorization?: () => void;
};

export default function LoginPage({
  onStartKakaoAuthorization = startKakaoAuthorization,
}: LoginPageProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const authorizationStarted = useRef(false);

  const handleKakaoLogin = () => {
    if (authorizationStarted.current) return;

    authorizationStarted.current = true;
    setIsRedirecting(true);
    onStartKakaoAuthorization();
  };

  return (
    <main className="relative min-h-dvh bg-primary-50">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={cloyBlur}
          alt=""
          className="absolute left-[74.5px] top-[82px] h-[702.457px] w-[488.133px]"
        />
      </div>

      <section className="relative z-10 flex min-h-dvh flex-col pt-[302px] pb-8">
        <div className="flex flex-col items-start justify-center gap-5 self-stretch px-5">
          <img src={logo} alt="" className="h-[70px] w-[70px]" />
          <img src={wordmark} alt="클로징" className="h-[22px] w-[60px]" />
          <p className="px-0.5 text-subtitle-1 text-gray-700">
            혼란 없이 정리하고, 더 빠르게 다시 시작하세요.
          </p>
        </div>

        <div className="mx-4 mt-[212px] flex flex-col gap-4">
          <button
            type="button"
            className="flex h-14 items-center justify-between rounded-xl border border-gray-200 bg-white p-4 text-title-3 text-[#232224] backdrop-blur-sm transition-colors enabled:hover:bg-gray-5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
            onClick={handleKakaoLogin}
            disabled={isRedirecting}
            aria-busy={isRedirecting}
          >
            <img src={kakao} alt="" className="h-6 w-6" />
            <span>{isRedirecting ? "카카오로 이동 중..." : "카카오로 시작하기"}</span>
            <span className="h-6 w-6" aria-hidden="true" />
          </button>

          <p className="text-center text-body-3 text-gray-400">
            로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
          </p>
        </div>
      </section>
    </main>
  );
}
