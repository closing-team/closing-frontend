import type { CategoryGroup } from "../../types/used";

export const RECOMMENDED_KEYWORDS = [
  "쇼케이스",
  "라셀르",
  "45박스 냉장고",
  "카페의자",
];

export const INDUSTRY_CATEGORIES: CategoryGroup[] = [
  {
    title: "외식/식당",
    items: ["한식/백반", "치킨/호프/고깃집", "중식/고화력주방", "일식/양식"],
  },
  {
    title: "카페/베이커리",
    items: ["디저트카페 패키지", "테이크아웃 전문", "베이커리 전문장비"],
  },
  {
    title: "사무실/교육",
    items: ["사무실 가구 일괄", "학원/독서실 집기"],
  },
  {
    title: "뷰티/생활 서비스",
    items: ["미용실/바버샵", "네일/피부 관리실"],
  },
  {
    title: "체육/기타 업종",
    items: ["헬스/필라테스", "의류/무인 점포"],
  },
];

export const ITEM_CATEGORIES: CategoryGroup[] = [
  {
    title: "주방기기/설비",
    items: [
      "냉장고/냉동고",
      "식기세척기/튀김기",
      "싱크대/작업대",
      "제빙기/쇼케이스",
    ],
  },
  {
    title: "홀 가구/인테리어",
    items: ["업소용 테이블", "조명/매장 수납장", "의자/소파/바 체어"],
  },
  {
    title: "사무 가구/IT 장비",
    items: [
      "사무용 책상/의자",
      "그릇/식기/소모품",
      "냉난방기/가전",
      "POS/키오스크/벨",
    ],
  },
];

export const INDUSTRY_OPTIONS = [
  { value: "외식/식당", label: "외식/식당" },
  { value: "카페/베이커리", label: "카페/베이커리" },
  { value: "사무실/교육", label: "사무실/교육" },
  { value: "뷰티/생활 서비스", label: "뷰티/생활 서비스" },
  { value: "체육/기타 업종", label: "체육/기타 업종" },
];

export const ITEM_OPTIONS = [
  { value: "냉장고/냉동고", label: "냉장고/냉동고" },
  { value: "식기세척기/튀김기", label: "식기세척기/튀김기" },
  { value: "싱크대/작업대", label: "싱크대/작업대" },
  { value: "제빙기/쇼케이스", label: "제빙기/쇼케이스" },
  { value: "업소용 테이블", label: "업소용 테이블" },
  { value: "POS/키오스크/벨", label: "POS/키오스크/벨" },
];
