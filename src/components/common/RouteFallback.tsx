// 라우트 청크 로딩 중 자리 표시자. 어떤 화면이 올지 알 수 없어 상단바와 본문
// 첫 줄 정도만 표시, 다른 화면 스켈레톤과 톤 맞춤
export default function RouteFallback() {
  return (
    <div
      className="min-h-dvh bg-white"
      aria-busy="true"
      aria-label="페이지를 불러오는 중"
    >
      <div className="h-14 border-b border-gray-100" />
      <div className="flex flex-col gap-3 px-4 py-6">
        {["40%", "60%", "50%"].map((width, i) => (
          <div
            key={i}
            className="h-5 animate-pulse rounded bg-gray-100"
            style={{ width }}
          />
        ))}
      </div>
    </div>
  );
}
