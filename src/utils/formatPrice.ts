// 금액을 천 단위 구분 기호가 있는 문자열로 포맷한다.
// 단위("원")는 호출부에서 붙인다.
export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}
