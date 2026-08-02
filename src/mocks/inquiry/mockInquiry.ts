export type InquiryStatus = "pending" | "answered";

export interface InquiryAnswer {
  content: string;
  answeredAt: Date;
}

export interface Inquiry {
  id: number;
  type: string;
  status: InquiryStatus;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  answer?: InquiryAnswer;
}

export let MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 1,
    type: "세무 신고 서류 문의",
    status: "pending",
    title: "폐업 세무 신고 서류 검토 관련 문의",
    content:
      "AI가 추천해 준 서류 목록 중에서 부가세 확정 신고서 관련한 내용이 정확한지 확인하고 싶어 문의드립니다. 폐업 시 추가로 제출해야 하는 서류가 있다면 함께 안내받을 수 있을까요?",
    createdAt: new Date(2026, 4, 1),
  },
  {
    id: 2,
    type: "서비스 오류 신고",
    status: "answered",
    title: "집기 일괄 인수 등록 시 에러가 발생합니다.",
    content:
      "중고거래 탭에서 가구 세트 이미지를 여러 장 등록하고 저장하는 도중 이미지가 안 보입니다.",
    images: ["furniture-set-1"],
    createdAt: new Date(2026, 3, 28),
    answer: {
      content:
        "안녕하세요, 사장님. 클로징 고객센터입니다.\n일시적인 네트워크 트래픽 증가로 인해 이미지 업로드 지연 현상이 있었습니다. 현재는 정상화되었으며 동일 문제 발생 시 재문의 부탁드립니다. 감사합니다.",
      answeredAt: new Date(2026, 3, 28),
    },
  },
];

const TITLE_MAX_LENGTH = 20;

let nextId = Math.max(...MOCK_INQUIRIES.map((i) => i.id)) + 1;

export function insertInquiry(input: {
  type: string;
  content: string;
  images: string[];
}): Inquiry {
  const created: Inquiry = {
    id: nextId++,
    type: input.type,
    status: "pending",
    title: input.content.slice(0, TITLE_MAX_LENGTH),
    content: input.content,
    images: input.images,
    createdAt: new Date(),
  };
  MOCK_INQUIRIES = [created, ...MOCK_INQUIRIES];
  return created;
}
