import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SESSION_CHECK_TIMEOUT_MS,
  SPLASH_MIN_DURATION_MS,
  restoreSessionWithTimeout,
  type RestoreSession,
} from "../../auth/sessionBootstrap";
import { ROUTES } from "../../constants/routes";
import SplashPage from "../../pages/auth/SplashPage";

type BootstrapPhase = "checking" | "retryable-error" | "ready";

type AuthBootstrapProps = {
  restoreSession: RestoreSession;
  children: ReactNode;
};

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export default function AuthBootstrap({
  restoreSession,
  children,
}: AuthBootstrapProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const initialPath = useRef(location.pathname);
  const navigateRef = useRef(navigate);
  const latestAttempt = useRef(0);
  const retryLocked = useRef(true);
  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<BootstrapPhase>("checking");

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  useEffect(() => {
    const controller = new AbortController();
    const attemptId = latestAttempt.current + 1;
    latestAttempt.current = attemptId;
    let active = true;
    retryLocked.current = true;

    const run = async () => {
      try {
        const [result] = await Promise.all([
          restoreSessionWithTimeout(
            restoreSession,
            SESSION_CHECK_TIMEOUT_MS,
            controller.signal,
          ),
          wait(SPLASH_MIN_DURATION_MS),
        ]);

        if (!active || latestAttempt.current !== attemptId) return;

        if (result === "unauthenticated") {
          navigateRef.current(ROUTES.LOGIN, { replace: true });
        } else if (initialPath.current === ROUTES.LOGIN) {
          navigateRef.current(ROUTES.HOME, { replace: true });
        }

        setPhase("ready");
      } catch {
        if (!active || latestAttempt.current !== attemptId) return;
        retryLocked.current = false;
        setPhase("retryable-error");
      }
    };

    void run();

    return () => {
      active = false;
      controller.abort();
    };
  }, [attempt, restoreSession]);

  const retry = useCallback(() => {
    if (phase === "checking" || retryLocked.current) return;
    retryLocked.current = true;
    setPhase("checking");
    setAttempt((current) => current + 1);
  }, [phase]);

  if (phase === "ready") return children;

  return (
    <SplashPage
      status={phase === "retryable-error" ? "error" : "checking"}
      onRetry={retry}
      isRetrying={phase === "checking"}
    />
  );
}
