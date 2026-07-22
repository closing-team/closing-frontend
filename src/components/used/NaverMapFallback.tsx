import { MarkerIcon } from "../../assets/icons";

interface NaverMapFallbackProps {
  className?: string;
}

// 지도 스크립트 로드 실패나 클라이언트 ID 미설정 시 지도 자리에 노출하는 대체 UI.
export default function NaverMapFallback({
  className = "",
}: NaverMapFallbackProps) {
  return (
    <div
      className={`flex items-center justify-center bg-gray-100 text-primary-500 ${className}`}
    >
      <MarkerIcon className="h-8 w-8" />
    </div>
  );
}
