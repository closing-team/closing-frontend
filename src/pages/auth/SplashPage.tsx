import characterImage from "../../assets/images/cloy-lg.png";

type SplashPageProps = {
  status?: "checking" | "error";
  onRetry?: () => void;
  isRetrying?: boolean;
};

export default function SplashPage({
  status = "checking",
  onRetry,
  isRetrying = false,
}: SplashPageProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-primary-500">
      <div className="mx-auto flex min-h-screen w-full max-w-app flex-col items-center justify-center px-6">
        <div className="flex items-center gap-[13px]" aria-label="클로징">
          <img src={characterImage} alt="" className="h-[58px] w-[58px]" />
          <span className="text-[40px] font-bold leading-none text-white">
            클로징
          </span>
        </div>

        {status === "error" && (
          <section className="mt-10 text-center text-white">
            <h1 className="text-title-3">
              로그인 상태를 확인하지 못했습니다.
            </h1>
            <p className="mt-2 text-body-3 text-primary-100">
              네트워크를 확인한 뒤 다시 시도해 주세요.
            </p>
            <button
              type="button"
              className="mt-5 h-11 rounded-xl bg-white px-6 text-body-2 font-semibold text-primary-600 disabled:opacity-60"
              onClick={onRetry}
              disabled={isRetrying}
            >
              {isRetrying ? "확인 중..." : "다시 시도"}
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
