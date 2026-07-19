import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../../assets/images/logo.png";
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
    <main className="flex min-h-dvh w-full items-center justify-center bg-white px-6">
      <section className="flex w-full flex-col items-center text-center">
        <div className="flex flex-col items-center">
          <img src={logoImage} alt="" className="h-[70px] w-[70px] rounded-[14px]" />
          <h1 className="mt-[21px] text-body-2 font-semibold text-gray-900">클로징</h1>
          <p className="mt-[7px] text-body-2 text-gray-500">
            혼란 없이 정리하고, 더 빠르게 다시 시작하세요
          </p>
        </div>

        <button
          type="button"
          className="mt-14 h-[49px] w-full rounded-xl bg-[#FEE500] text-body-2 font-medium text-[#191919] transition-colors enabled:hover:bg-[#F6DD00] disabled:cursor-not-allowed disabled:bg-[#E8E8E8] disabled:text-gray-500"
          onClick={handleKakaoLogin}
          disabled={isLoggingIn}
          aria-busy={isLoggingIn}
        >
          {isLoggingIn ? "카카오 로그인 중..." : "카카오톡으로 시작하기"}
        </button>

        {errorMessage && (
          <p role="alert" className="mt-3 text-body-3 text-warning-600">
            {errorMessage}
          </p>
        )}

        <p className="mt-14 text-caption-3 text-gray-500">
          로그인 시 서비스 이용약관 및 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </section>
    </main>
  );
}
