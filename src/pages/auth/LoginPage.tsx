import { useState } from "react";
import { useNavigate } from "react-router-dom";
import kakaoIcon from "../../assets/images/auth/kakao-icon.svg";
import buttonSpacer from "../../assets/images/auth/login-button-spacer.svg";
import heroBody from "../../assets/images/auth/login-hero-body.png";
import heroEyeLeft from "../../assets/images/auth/login-hero-eye-left.svg";
import heroEyeRight from "../../assets/images/auth/login-hero-eye-right.svg";
import heroHair from "../../assets/images/auth/login-hero-hair.png";
import heroHat from "../../assets/images/auth/login-hero-hat.png";
import heroMouth from "../../assets/images/auth/login-hero-mouth.svg";
import heroTop from "../../assets/images/auth/login-hero-top.png";
import loginLogo from "../../assets/images/auth/login-logo.png";
import loginWordmark from "../../assets/images/auth/login-wordmark.svg";
import { ROUTES } from "../../constants/routes";
import type { KakaoLoginHandler } from "../../types/auth";

const defaultKakaoLogin: KakaoLoginHandler = async () => ({ status: "existing" });

type LoginPageProps = {
  onKakaoLogin?: KakaoLoginHandler;
};

export default function LoginPage({ onKakaoLogin = defaultKakaoLogin }: LoginPageProps) {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleKakaoLogin = async () => {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const result = await onKakaoLogin();
      navigate(result.status === "new" ? ROUTES.TERMS : ROUTES.HOME, { replace: true });
    } catch {
      setErrorMessage("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <main className="relative min-h-dvh overflow-hidden bg-primary-50">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[75px] top-[82px] h-[702px] w-[488px] -scale-x-100 overflow-hidden"
      >
        {[heroBody, heroHat, heroHair, heroTop, heroEyeLeft, heroEyeRight, heroMouth].map((src) => (
          <img key={src} src={src} alt="" className="absolute inset-0 h-full w-full opacity-30" />
        ))}
      </div>

      <section className="absolute inset-x-0 top-[302px]">
        <div className="px-5">
          <img src={loginLogo} alt="" className="h-[70px] w-[70px]" />
          <img src={loginWordmark} alt="클로징" className="mt-5 h-[22px] w-[60px]" />
          <p className="mt-5 px-0.5 text-subtitle-1 text-[#48464A]">
            혼란 없이 정리하고, 더 빠르게 다시 시작하세요.
          </p>
        </div>

        <button
          type="button"
          className="mx-4 mt-[212px] flex h-14 w-[calc(100%-32px)] items-center justify-between rounded-xl border border-gray-200 bg-white px-4 text-title-3 text-[#232224] transition-colors enabled:hover:bg-gray-5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          onClick={handleKakaoLogin}
          disabled={isLoggingIn}
          aria-busy={isLoggingIn}
        >
          <img src={kakaoIcon} alt="" className="h-6 w-6" />
          <span>{isLoggingIn ? "카카오 로그인 중..." : "카카오로 시작하기"}</span>
          <img src={buttonSpacer} alt="" className="h-6 w-6" />
        </button>

        {errorMessage && (
          <p role="alert" className="mx-5 mt-3 text-body-3 text-warning-600">
            {errorMessage}
          </p>
        )}

        <p className="mt-4 px-2.5 text-center text-body-3 text-gray-400">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </section>
    </main>
  );
}
