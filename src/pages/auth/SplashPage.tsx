import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import characterImage from "../../assets/images/cloy-lg.png";
import { ROUTES } from "../../constants/routes";

const SPLASH_DELAY_MS = 1500;

export default function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      const isLoggedIn = Boolean(localStorage.getItem("accessToken"));
      navigate(isLoggedIn ? ROUTES.HOME : ROUTES.LOGIN, { replace: true });
    }, SPLASH_DELAY_MS);

    return () => window.clearTimeout(timerId);
  }, [navigate]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary-500">
      <div className="mx-auto min-h-screen w-full max-w-app">
        <div className="flex min-h-screen items-center justify-center">
          <div className="flex items-center gap-[13px]" aria-label="클로징">
            <img src={characterImage} alt="" className="h-[58px] w-[58px]" />
            <span className="text-[40px] font-bold leading-none text-white">
              클로징
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
