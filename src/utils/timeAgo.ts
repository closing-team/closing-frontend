const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// 타임존 표기가 없는 날짜시간 문자열은 UTC로 명시해서 파싱
export function parseAsUtcIfUnspecified(isoDate: string): Date {
  const hasTimezone = /[Zz]$|[+-]\d{2}:?\d{2}$/.test(isoDate);
  const hasTime = isoDate.includes("T");
  return new Date(hasTime && !hasTimezone ? `${isoDate}Z` : isoDate);
}

export function formatTimeAgo(isoDate: string, now: Date = new Date()): string {
  const diff = now.getTime() - parseAsUtcIfUnspecified(isoDate).getTime();

  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  return `${Math.floor(diff / DAY)}일 전`;
}
