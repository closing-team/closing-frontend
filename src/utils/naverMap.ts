import markerSvgRaw from "../assets/icons/marker.svg?raw";

export const DEFAULT_MAP_OPTIONS = {
  zoom: 16,
  zoomControl: false,
  scrollWheel: true,
} satisfies Omit<naver.maps.MapOptions, "center">;

export function buildMarkerIconHtml(size = 32): string {
  const primary =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary-500")
      .trim() || "#6558ff";

  return markerSvgRaw
    .replace('width="24" height="24"', `width="${size}" height="${size}"`)
    .replace("currentColor", primary);
}
