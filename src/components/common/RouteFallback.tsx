// 라우트 청크를 내려받는 동안 보여줄 자리 표시자. 어떤 화면이 올지 알 수 없으므로
// 상단바와 본문 첫 줄 정도만 잡아 두고, 다른 화면 스켈레톤과 같은 결로 맞춘다.
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
