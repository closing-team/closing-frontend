import { useEffect, useState } from "react";
import awning from "../../assets/images/awning.png";
import cloyBanner from "../../assets/images/cloy-banner.png";
import packageBanner from "../../assets/images/package-banner.png";

const ROTATE_INTERVAL_MS = 5000;

interface BannerProps {
  completed: number;
  total: number;
}

function PromoBanner() {
  return (
    <div
      className="relative h-full w-full overflow-hidden"
      style={{
        borderRadius: "8px",
        background:
          "linear-gradient(196deg, #4B3BF3 23.3%, #7F74F9 77.07%, #9C94FC 93.74%, #C4BFFF 104.16%)",
      }}
    >
      <img src={awning} alt="" className="absolute left-0 top-0 z-0 h-auto w-full" />

      <div
        className="absolute inset-0 z-10 flex items-center justify-between"
        style={{ padding: "0 12px 0 16px" }}
      >
        <div className="flex flex-col" style={{ gap: "1px" }}>
          <p className="text-body-2 text-gray-100">막막한 폐업 준비,</p>
          <p className="text-title-3 text-white">
            클로징이 순서대로 도와드릴게요.
          </p>
        </div>

        <img
          src={cloyBanner}
          alt=""
          style={{
            width: "93.253px",
            height: "108.468px",
            flexShrink: 0,
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
}

function ProgressBanner({ completed, total }: BannerProps) {
  const pct = Math.round((completed / total) * 100);

  return (
    <div
      className="flex h-full w-full flex-col items-start"
      style={{
        borderRadius: "8px",
        padding: "20px 16px 28px 16px",
        gap: "4px",
        background:
          "linear-gradient(165deg, #4A3BF2 0%, #6659FF 50%, #9389FF 70%, #BDB7FF 85%, #D7D4FF 100%)",
      }}
    >
      <div className="flex items-center justify-between self-stretch">
        <p className="text-title-3 text-white">전체 진행률</p>
        <p className="text-caption-2 text-gray-100">
          총 {total}개의 작업 중 {completed}개 완료
        </p>
      </div>

      <div className="flex items-center justify-between self-stretch">
        <p
          className="font-bold text-white"
          style={{
            fontSize: "40px",
            lineHeight: "160%",
            letterSpacing: "-0.8px",
          }}
        >
          {pct}%
        </p>
        <div
          className="flex items-center justify-center"
          style={{
            width: "52px",
            height: "52px",
            padding: "4.5px 5.5px 4.412px 6.5px",
            aspectRatio: "1/1",
          }}
        >
          <img
            src={packageBanner}
            alt=""
            style={{ width: "40.148px", height: "43.25px", objectFit: "contain" }}
          />
        </div>
      </div>

      <div
        className="flex items-center self-stretch rounded-full bg-primary-400"
        style={{ height: "8px" }}
      >
        <div
          className="h-2 rounded-full bg-white transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function Banner({ completed, total }: BannerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasSchedule = total > 0;

  useEffect(() => {
    if (!hasSchedule) return;

    const id = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [hasSchedule]);

  if (!hasSchedule) {
    return (
      <div className="mx-4" style={{ height: "148px" }}>
        <PromoBanner />
      </div>
    );
  }

  return (
    <div className="relative mx-4" style={{ height: "148px" }}>
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: activeIndex === 0 ? 1 : 0 }}
        aria-hidden={activeIndex !== 0}
      >
        <PromoBanner />
      </div>
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: activeIndex === 1 ? 1 : 0 }}
        aria-hidden={activeIndex !== 1}
      >
        <ProgressBanner completed={completed} total={total} />
      </div>
    </div>
  );
}
