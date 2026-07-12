// 중고거래(MKT / used) 도메인 타입

// 거래 방식 — 상품은 여러 방식을 동시에 지원할 수 있음
export type DealType = '직거래' | '택배거래';

export interface Product {
  id: number;
  title: string;
  price: number;
  imageUrl: string | null;
  dealTypes: DealType[];
  distanceM: number; // 현재 위치로부터의 거리(m) — 거리순 정렬 기준
  neighborhood: string; // 동네명 (예: 원홍동)
  timeAgo: string; // 노출용 상대 시간 (예: '3일 전')
  createdAt: string; // ISO 문자열 — 최신순 정렬 기준
  likes: number; // 인기순 정렬 기준
  liked: boolean; // 내 찜 여부
}

// 필터 탭 — 전체 / 원홍동 근처 / 택배만 / 직거래만
export type UsedFilter = 'all' | 'nearby' | 'parcel' | 'direct';

// 정렬 옵션 — 인기순 / 최신순 / 거리순 / 저가순 / 고가순
export type UsedSort = 'popular' | 'latest' | 'distance' | 'priceLow' | 'priceHigh';
