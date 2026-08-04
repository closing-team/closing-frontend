import cloyTransparent from "../../assets/images/cloy-transparent.png";

const SYLLABLES = [
  {
    char: "클",
    d: "M87.7045 4.45087V17.1581C87.5932 23.3893 86.7475 36.7197 85.7906 45.3544H101.636V58.44H0V45.3544H69.0998L69.7007 35.7628L12.1064 36.4972V24.9917L70.0568 24.2573C70.168 22.0986 70.168 20.4073 70.168 19.339V17.4252H14.3541L9.90319 0L87.7045 4.45087ZM89.2623 65.1608V93.6019H29.9989V100.567H91.0649V117.192L51.5856 112.763H12.4847V83.2758H71.8816V76.9111H12.1286V65.1608H89.2623Z",
  },
  {
    char: "로",
    d: "M154.29 87.4819V73.0834H126.093V33.8489H183.309V22.3434H129.342L124.892 3.38269L200.601 7.83356V47.1793H143.496V58.6848H173.362L204.607 58.5068L204.651 77.4675L172.872 73.0834V87.4819H214.376V106.687L163.57 102.237H112.763V87.4819H154.267H154.29Z",
  },
  {
    char: "징",
    d: "M287.259 7.52197V22.0763H267.23V24.235C267.23 27.5954 265.984 35.0061 264.961 37.6989L291.733 42.3946L287.66 61.9562C276.377 58.6848 266.496 52.9209 259.553 46.5561C257.639 49.3157 255.347 51.7191 253.188 53.7443C246 61.066 240.837 65.4946 235.919 67.2972L224.858 52.4313C229.42 50.6287 235.051 47.8691 239.368 44.5087C246.934 38.6336 249.805 32.5136 249.805 25.0807V22.0763H231.69L227.239 3.47167L287.259 7.52197ZM318.571 91.4432C318.571 106.91 304.952 115.567 280.116 115.567C255.28 115.567 241.794 106.687 241.794 91.4432C241.794 76.1989 254.568 67.0969 280.116 67.0969C305.664 67.0969 318.571 75.6203 318.571 91.4432ZM259.53 91.4432C259.53 98.7649 267.475 101.992 280.138 101.992C292.801 101.992 300.857 98.7426 300.857 91.4432C300.857 84.1438 292.912 80.6498 280.138 80.6498C267.364 80.6498 259.53 84.0102 259.53 91.4432ZM318.104 5.54133V64.5599L300.701 60.109V1.09045L318.104 5.54133Z",
  },
];

function BouncingWordmark() {
  return (
    <svg
      width="86"
      height="31.63"
      viewBox="0 0 319 118"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="클로징"
      className="overflow-visible"
    >
      {SYLLABLES.map((syllable, i) => (
        <path
          key={syllable.char}
          d={syllable.d}
          fill="#FCFCFE"
          className="animate-wordmark-bounce"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </svg>
  );
}

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
    <main className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] overflow-hidden bg-primary-500 shadow-sm">
      <div className="flex min-h-dvh w-full flex-col items-center justify-center px-6">
        <div className="inline-flex items-center gap-4" aria-label="클로징">
          <img src={cloyTransparent} alt="" className="h-[55.887px] w-10" />
          <div className="flex w-[86px] flex-col items-start gap-2.5 pt-3">
            <BouncingWordmark />
          </div>
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
