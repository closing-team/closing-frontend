function toDotDate(date: string): string {
  return date.replaceAll("-", ".");
}

// TODO: applicationPeriod 실제 포맷이 확정되면 이 조합 로직 대신 API 값으로 교체 검토
export function formatApplicationPeriod(
  applyStartDate: string,
  applyEndDate: string | null,
): string {
  const start = toDotDate(applyStartDate);
  if (applyEndDate === null) {
    return `${start} - 상시`;
  }
  return `${start} - ${toDotDate(applyEndDate)}`;
}
