import { ROUTES } from "./routes";

export const PAGE_TITLES: Partial<Record<keyof typeof ROUTES, string>> = {
  LOGIN: "로그인",
  TERMS: "약관 동의",
  AI: "AI 맞춤 계획 만들기",
  AI_PLAN: "AI 맞춤 계획 만들기",
  GUIDE: "폐업 가이드",
  GUIDE_DETAIL: "폐업 가이드",
  GUIDE_NOTICE_TEMPLATE: "작성 템플릿",
  GUIDE_REPORT_TEMPLATE: "작성 템플릿",
  SUPPORT: "지원정보",
  SUPPORT_DETAIL: "지원정보",
  USED: "중고거래",
  USED_DETAIL: "상품 상세",
  USED_SEARCH: "중고거래 검색",
  USED_SEARCH_RESULT: "검색 결과",
  USED_WRITE: "물품 등록",
  USED_EDIT: "물품 수정",
  USED_MY: "나의 판매물품",
  USED_LIKED: "관심 물품",
  CHAT: "채팅 목록",
  CHAT_ROOM: "채팅",
  PROFILE_EDIT: "프로필 수정",
  BUSINESS_AUTH: "사업자 인증",
  INQUIRY: "1:1 문의하기",
  INQUIRY_HISTORY: "나의 문의내역",
  POLICY: "약관 및 정책",
};

export const PAGE_DESCRIPTIONS: Partial<Record<keyof typeof ROUTES, string>> = {
  HOME: "오늘의 일정과 전체 폐업 준비 진행률을 한눈에 확인하세요.",
  AI: "사장님의 상황을 알려주시면 AI가 맞춤 폐업 일정을 생성해 드려요.",
  AI_PLAN: "AI가 생성한 맞춤 폐업 일정을 확인하고 캘린더에 추가하세요.",
  GUIDE: "임대차 정리부터 세무 신고까지, 폐업 절차를 단계별로 안내합니다.",
  GUIDE_DETAIL:
    "임대차 정리부터 세무 신고까지, 폐업 절차를 단계별로 안내합니다.",
  GUIDE_NOTICE_TEMPLATE:
    "문자·내용증명 발송에 바로 쓸 수 있는 작성 템플릿입니다.",
  GUIDE_REPORT_TEMPLATE:
    "문자·내용증명 발송에 바로 쓸 수 있는 작성 템플릿입니다.",
  SUPPORT: "폐업 사장님을 위한 정부·지자체 지원사업 공고를 모아봤어요.",
  SUPPORT_DETAIL: "폐업 사장님을 위한 정부·지자체 지원사업 공고를 모아봤어요.",
  USED: "폐업 매장의 집기·비품을 중고로 사고파세요.",
  USED_DETAIL: "판매자에게 직접 문의하고 안전하게 거래하세요.",
  USED_SEARCH: "찾으시는 업종·품목의 중고 물품을 검색해보세요.",
  USED_SEARCH_RESULT: "검색하신 조건에 맞는 중고 물품 목록입니다.",
  USED_WRITE: "판매할 물품의 사진과 정보를 등록해주세요.",
  USED_EDIT: "등록한 물품의 정보를 수정해주세요.",
  USED_MY: "내가 등록한 판매 물품의 상태를 관리하세요.",
  USED_LIKED: "관심 등록한 중고 물품을 모아봤어요.",
  CHAT: "판매자·구매자와 나눈 채팅 목록입니다.",
  CHAT_ROOM: "판매자·구매자와 실시간으로 대화를 나눠보세요.",
  PROFILE_EDIT: "닉네임과 사업자 정보를 수정할 수 있어요.",
  BUSINESS_AUTH: "안전한 중고거래를 위해 사업자 정보를 인증해주세요.",
  INQUIRY: "궁금하신 점을 남겨주시면 빠르게 답변드릴게요.",
  INQUIRY_HISTORY: "지금까지 남기신 문의와 답변 내역을 확인하세요.",
  POLICY: "클로징의 서비스 이용약관과 개인정보 처리방침을 확인하세요.",
};

export const GUIDE_STEP_TITLES: Record<string, string> = {
  "1": "STEP 1. 영업 종료일(폐업일) 산정",
  "2": "STEP 2. 임대차 계약 해지 통보 및 조율",
  "3": "STEP 3. 직원 퇴사 및 해고 예고 통보",
  "4": "STEP 4. 재고·집기 처분 가이드",
  "5": "STEP 5. 매장 철거 및 원상복구 가이드",
  "6": "STEP 6. 사업자등록 및 인허가 폐업 신고",
  "7": "STEP 7. 4대보험 탈퇴 및 상실 신고",
  "8": "STEP 8. 부가가치세 및 잔존재화 신고",
  "9": "STEP 9. 종합소득세 확정 신고",
};

export const DEFAULT_TITLE = "클로징";
export const NOT_FOUND_TITLE = "페이지 오류";

export const DEFAULT_DESCRIPTION = "폐업을 앞둔 사장님의 든든한 동행 가이드";
export const NOT_FOUND_DESCRIPTION =
  "요청하신 페이지를 찾을 수 없어요. 주소가 정확한지 확인해주세요.";

export function buildDocumentTitle(pageTitle?: string): string {
  return pageTitle ? `${pageTitle} - 클로징` : DEFAULT_TITLE;
}
