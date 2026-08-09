import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { completeKakaoLogin } from "../../auth/kakaoLogin";
import logo from "../../assets/images/logo.png";
import { ROUTES } from "../../constants/routes";
import type { KakaoCodeLoginHandler, LoginResult } from "../../types/auth";
import { getLoginErrorMessage } from "../../utils/authError";

const codeExchanges = new Map<string, Promise<LoginResult>>();

function exchangeCodeOnce(
  code: string,
  handler: KakaoCodeLoginHandler,
): Promise<LoginResult> {
  const existingExchange = codeExchanges.get(code);
  if (existingExchange) return existingExchange;

  const controller = new AbortController();
  const exchange = handler(code, controller.signal).catch((error: unknown) => {
    codeExchanges.delete(code);
    throw error;
  });
  codeExchanges.set(code, exchange);
  return exchange;
}

function getDestination(result: LoginResult): string {
  return result.status === "new" ? ROUTES.TERMS : ROUTES.HOME;
}

type KakaoCallbackPageProps = {
  onCompleteKakaoLogin?: KakaoCodeLoginHandler;
};

export default function KakaoCallbackPage({
  onCompleteKakaoLogin = completeKakaoLogin,
}: KakaoCallbackPageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );
  const code = searchParams.get("code");
  const kakaoError = searchParams.get("error");
  const [attempt, setAttempt] = useState(0);
  const [exchangeError, setExchangeError] = useState("");

  useEffect(() => {
    if (!code || kakaoError) return;

    let active = true;

    void exchangeCodeOnce(code, onCompleteKakaoLogin).then(
      (result) => {
        if (active) {
          navigate(getDestination(result), { replace: true });
        }
      },
      (error: unknown) => {
        if (active) {
          setExchangeError(getLoginErrorMessage(error));
        }
      },
    );

    return () => {
      active = false;
    };
  }, [attempt, code, kakaoError, navigate, onCompleteKakaoLogin]);

  const goToLogin = () => navigate(ROUTES.LOGIN, { replace: true });

  let message = "카카오 로그인을 완료하는 중...";
  let action: { label: string; run: () => void } | null = null;

  if (kakaoError) {
    message = "카카오 로그인이 취소되었습니다.";
    action = { label: "로그인으로 돌아가기", run: goToLogin };
  } else if (!code) {
    message = "카카오 인증 코드를 확인할 수 없습니다.";
    action = { label: "로그인으로 돌아가기", run: goToLogin };
  } else if (exchangeError) {
    message = exchangeError;
    action = {
      label: "다시 시도",
      run: () => {
        setExchangeError("");
        setAttempt((value) => value + 1);
      },
    };
  }

  const isError = action !== null;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-primary-50 px-5 text-center">
      <img src={logo} alt="" className="h-[70px] w-[70px]" />
      <p
        role={isError ? "alert" : undefined}
        className={`mt-6 text-body-2 ${isError ? "text-warning-600" : "text-gray-700"}`}
      >
        {message}
      </p>
      {action && (
        <button
          type="button"
          onClick={action.run}
          className="mt-6 h-12 rounded-xl bg-primary-500 px-6 text-body-2 font-semibold text-white"
        >
          {action.label}
        </button>
      )}
    </main>
  );
}
