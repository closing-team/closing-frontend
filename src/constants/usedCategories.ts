import type { CategoryGroup } from "../types/used";

// 검색어는 keyword 파라미터로 그대로 전달되므로, 백엔드 카테고리 라벨
// ("업소용 테이블", "사무용 책상/의자" 등)과 띄어쓰기를 동일하게 유지
export const RECOMMENDED_KEYWORD_POOL = [
  // 주방기기/설비
  "쇼케이스",
  "45박스 냉장고",
  "업소용 냉장고",
  "업소용 냉동고",
  "워크인 냉장고",
  "육절기",
  "튀김기",
  "식기세척기",
  "제빙기",
  "인덕션",
  "그리들",
  "살라만다",
  "브레이징 팬",
  "스팀 오븐",
  "데크 오븐",

  // 카페/베이커리
  "에스프레소 머신",
  "커피 그라인더",
  "제과 오븐",
  "발효기",
  "믹서기",
  "쇼케이스 냉장고",

  // 홀 가구/인테리어
  "카페 의자",
  "업소용 테이블",
  "접이식 테이블",
  "홀 의자",
  "바 체어",
  "소파",
  "파라솔",
  "대기 의자",
  "진열대",
  "선반",

  // 사무/IT 장비
  "POS기",
  "키오스크",
  "카드 단말기",
  "영수증 프린터",
  "사무용 책상",
  "사무용 의자",
  "파티션",
  "캐비닛",

  // 뷰티
  "미용 의자",
  "샴푸대",
  "스타일링 거울",
  "네일 테이블",
  "자외선 소독기",

  // 헬스
  "러닝머신",
  "웨이트 머신",
  "스피닝 자전거",
  "요가 매트",

  // 브랜드
  "라셀르",
] as const;

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
    items: ["헬스/필라테스", "의류 매장/무인 점포"],
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
      "POS/키오스크/빌지프린터",
    ],
  },
];

export const INDUSTRY_OPTIONS = INDUSTRY_CATEGORIES.flatMap((group) =>
  group.items.map((item) => ({ value: item, label: item })),
);

export const ITEM_OPTIONS = ITEM_CATEGORIES.flatMap((group) =>
  group.items.map((item) => ({ value: item, label: item })),
);
