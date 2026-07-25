import markerSvgRaw from "../assets/icons/marker.svg?raw";

// 읽기 전용 지도와 위치 선택 지도가 공유하는 기본 옵션.
// 휠로만 확대/축소하고 확대·축소 컨트롤 막대는 숨긴다.
export const DEFAULT_MAP_OPTIONS = {
  zoom: 16,
  zoomControl: false,
  scrollWheel: true,
} satisfies Omit<naver.maps.MapOptions, "center">;

// marker.svg를 naver.maps.Marker의 커스텀 아이콘으로 그대로 재사용한다.
// 아이콘은 CSS 컨텍스트 밖(HTML 문자열)에서 렌더되므로 currentColor 대신
// --color-primary-500 토큰 값을 직접 주입한다.
export function buildMarkerIconHtml(size = 32): string {
  const primary =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary-500")
      .trim() || "#6558ff";

  return markerSvgRaw
    .replace('width="24" height="24"', `width="${size}" height="${size}"`)
    .replace("currentColor", primary);
}
