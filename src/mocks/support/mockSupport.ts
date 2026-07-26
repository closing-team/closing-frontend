import type { SupportPost } from "../../components/support/SupportCard";

export interface SupportPostDetail extends SupportPost {
  overview: string;
  target: string;
  applicationHeading: string;
  applicationMethods: string[];
  contactHeading: string;
  contactLines: string[];
  applyUrl: string;
  applyUrlLabel: string;
}

export const SUPPORT_POSTS: SupportPostDetail[] = [
  {
    id: 1,
    organization: "중소벤처기업부",
    title: "2026년 「희망리턴패키지 원스톱폐업지원」 소상공인 모집 공고",
    period: "2026.01.01 - 2026.03.05",
    startDate: "2026-01-01",
    endDate: "2026-03-05",
    isBookmarked: true,
    overview:
      "소상공인의 신속·안전한 폐업 및 폐업부담 경감을 위해 사업 정리 컨설팅, 점포 철거비, 법률 자문, 채무 조정 등을 원스톱으로 지원합니다.",
    target: "폐업(예정) 소상공인",
    applicationHeading: "[사업신청 방법] 온라인 접수",
    applicationMethods: [
      "사업정리컨설팅/법률자문/채무조정 : 희망리턴패키지 홈페이지 접수",
      "점포철거비 지원 : 소상공인24 홈페이지 접수",
    ],
    contactHeading: "[문의처]",
    contactLines: ["소상공인 통합콜센터 1533-0100", "(내선 4번 희망리턴패키지)"],
    applyUrl: "https://www.sbiz24.kr",
    applyUrlLabel: "바로가기: https://www.sbiz24.kr / hope.sbiz.or.kr",
  },
  {
    id: 2,
    organization: "서울특별시",
    title: "[서울] 2026년 새 길 여는 폐업지원 사업 모집 공고",
    period: "2026.03.03 - 예산 소진시까지",
    startDate: "2026-03-03",
    endDate: null,
    isBookmarked: true,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    overview:
      "서울 소재 폐업(예정) 소상공인을 대상으로 사업 정리 및 재기 지원을 위한 컨설팅과 자금을 지원합니다.",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    target: "서울 소재 폐업(예정) 소상공인",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationHeading: "[사업신청 방법] 온라인 접수",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationMethods: ["서울시 소상공인 지원센터 홈페이지 접수"],
    contactHeading: "[문의처]",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    contactLines: ["서울시 소상공인 지원센터 02-1234-5678"],
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrl: "https://www.seoul.go.kr",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrlLabel: "바로가기: https://www.seoul.go.kr",
  },
  {
    id: 3,
    organization: "전북특별자치도",
    title: "[전북] 2026년 폐업 소상공인 사업정리 지원사업 공고",
    period: "2026.03.05 - 예산 소진시까지",
    startDate: "2026-03-05",
    endDate: null,
    isBookmarked: false,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    overview:
      "전북 소재 폐업 소상공인의 원활한 사업정리를 위해 철거비 및 법률 상담을 지원합니다.",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    target: "전북 소재 폐업(예정) 소상공인",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationHeading: "[사업신청 방법] 온라인 접수",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationMethods: ["전북특별자치도 소상공인 지원센터 홈페이지 접수"],
    contactHeading: "[문의처]",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    contactLines: ["전북특별자치도 소상공인 지원센터 063-123-4567"],
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrl: "https://www.jb.go.kr",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrlLabel: "바로가기: https://www.jb.go.kr",
  },
  {
    id: 4,
    organization: "전북특별자치도",
    title: "[전북] 2026년 새출발 재기지원 모집 공고",
    period: "2026.03.26 - 예산 소진시까지",
    startDate: "2026-03-26",
    endDate: null,
    isBookmarked: false,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    overview:
      "폐업 후 재창업을 준비하는 소상공인을 대상으로 재기 자금과 컨설팅을 지원합니다.",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    target: "폐업 후 재창업을 준비하는 소상공인",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationHeading: "[사업신청 방법] 온라인 접수",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applicationMethods: ["전북특별자치도 소상공인 지원센터 홈페이지 접수"],
    contactHeading: "[문의처]",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    contactLines: ["전북특별자치도 소상공인 지원센터 063-123-4567"],
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrl: "https://www.jb.go.kr",
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    applyUrlLabel: "바로가기: https://www.jb.go.kr",
  },
];
