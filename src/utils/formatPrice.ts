export function formatPrice(price: number): string {
  return price.toLocaleString("ko-KR");
}

export function isFreePrice(price: number): boolean {
  return price === 0;
}

export function formatPriceLabel(price: number): string {
  return isFreePrice(price) ? "나눔" : `${formatPrice(price)}원`;
}
