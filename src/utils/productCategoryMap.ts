function normalize(label: string): string {
  return label.replace(/\s*\/\s*/g, "/").trim();
}

const BUSINESS_CATEGORY_CODES: Record<string, string> = {
  "한식/백반": "KOREAN_MEAL",
  "치킨/호프/고깃집": "CHICKEN_PUB_BBQ",
  "중식/고화력주방": "CHINESE_HIGH_HEAT_KITCHEN",
  "일식/양식": "JAPANESE_WESTERN",
  "디저트카페 패키지": "DESSERT_CAFE_PACKAGE",
  "테이크아웃 전문": "TAKEOUT_SPECIALTY",
  "베이커리 전문장비": "BAKERY_EQUIPMENT",
  "사무실 가구 일괄": "OFFICE_FURNITURE_SET",
  "학원/독서실 집기": "ACADEMY_STUDY_ROOM_EQUIPMENT",
  "미용실/바버샵": "HAIR_SALON_BARBERSHOP",
  "네일/피부 관리실": "NAIL_SKINCARE_SALON",
  "헬스/필라테스": "GYM_PILATES",
  "의류 매장/무인 점포": "CLOTHING_UNMANNED_STORE",
};

const PRODUCT_CATEGORY_CODES: Record<string, string> = {
  "냉장고/냉동고": "REFRIGERATOR_FREEZER",
  "식기세척기/튀김기": "DISHWASHER_FRYER",
  "싱크대/작업대": "SINK_WORKTABLE",
  "제빙기/쇼케이스": "ICE_MAKER_SHOWCASE",
  "업소용 테이블": "COMMERCIAL_TABLE",
  "조명/매장 수납장": "LIGHTING_STORE_CABINET",
  "의자/소파/바 체어": "CHAIR_SOFA_BAR_CHAIR",
  "사무용 책상/의자": "OFFICE_DESK_CHAIR",
  "그릇/식기/소모품": "DISHWARE_TABLEWARE_CONSUMABLES",
  "냉난방기/가전": "HEATING_COOLING_APPLIANCE",
  "POS/키오스크/빌지프린터": "POS_KIOSK_BILL_PRINTER",
};

function buildReverseMap(map: Record<string, string>): Record<string, string> {
  const reversed: Record<string, string> = {};
  for (const [label, code] of Object.entries(map)) {
    reversed[code] = label;
  }
  return reversed;
}

const BUSINESS_CATEGORY_LABELS = buildReverseMap(BUSINESS_CATEGORY_CODES);
const PRODUCT_CATEGORY_LABELS = buildReverseMap(PRODUCT_CATEGORY_CODES);

export function toBusinessCategoryCode(label: string): string {
  return BUSINESS_CATEGORY_CODES[normalize(label)] ?? label;
}

export function toProductCategoryCode(label: string): string {
  return PRODUCT_CATEGORY_CODES[normalize(label)] ?? label;
}

export function fromBusinessCategoryCode(code: string): string {
  return BUSINESS_CATEGORY_LABELS[code] ?? code;
}

export function fromProductCategoryCode(code: string): string {
  return PRODUCT_CATEGORY_LABELS[code] ?? code;
}
