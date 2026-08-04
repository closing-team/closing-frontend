import type { SupportDetail } from "../../types/supportApi";

export const SUPPORT_POSTS: SupportDetail[] = [
  {
    supportId: 1,
    organizationName: "중소벤처기업부",
    title: "2026년 「희망리턴패키지 원스톱폐업지원」 소상공인 모집 공고",
    applyStartDate: "2026-01-01",
    applyEndDate: "2026-03-05",
    // TODO: applicationPeriod 실제 포맷 확정 전 임시값, 화면 표시에는 사용하지 않음
    applicationPeriod: "2026.01.01 - 2026.03.05",
    status: "ONGOING",
    isBookmarked: true,
    viewCount: 1520,
    content:
      "소상공인의 신속·안전한 폐업 및 폐업부담 경감을 위해 사업 정리 컨설팅, 점포 철거비, 법률 자문, 채무 조정 등을 원스톱으로 지원합니다.\n\n지원대상: 폐업(예정) 소상공인\n\n[사업신청 방법] 온라인 접수\n- 사업정리컨설팅/법률자문/채무조정 : 희망리턴패키지 홈페이지 접수\n- 점포철거비 지원 : 소상공인24 홈페이지 접수\n\n[문의처]\n소상공인 통합콜센터 1533-0100\n(내선 4번 희망리턴패키지)",
    externalUrl: "https://www.sbiz24.kr",
  },
  {
    supportId: 2,
    organizationName: "서울특별시",
    title: "[서울] 2026년 새 길 여는 폐업지원 사업 모집 공고",
    applyStartDate: "2026-03-03",
    applyEndDate: null,
    // TODO: applicationPeriod 실제 포맷 확정 전 임시값, 화면 표시에는 사용하지 않음
    applicationPeriod: "2026.03.03 - 예산 소진시까지",
    status: "ONGOING",
    isBookmarked: true,
    viewCount: 842,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    content:
      "서울 소재 폐업(예정) 소상공인을 대상으로 사업 정리 및 재기 지원을 위한 컨설팅과 자금을 지원합니다.\n\n지원대상: 서울 소재 폐업(예정) 소상공인\n\n[사업신청 방법] 온라인 접수\n- 서울시 소상공인 지원센터 홈페이지 접수\n\n[문의처]\n서울시 소상공인 지원센터 02-1234-5678",
    externalUrl: "https://www.seoul.go.kr",
  },
  {
    supportId: 3,
    organizationName: "전북특별자치도",
    title: "[전북] 2026년 폐업 소상공인 사업정리 지원사업 공고",
    applyStartDate: "2026-03-05",
    applyEndDate: null,
    // TODO: applicationPeriod 실제 포맷 확정 전 임시값, 화면 표시에는 사용하지 않음
    applicationPeriod: "2026.03.05 - 예산 소진시까지",
    status: "ONGOING",
    isBookmarked: false,
    viewCount: 356,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    content:
      "전북 소재 폐업 소상공인의 원활한 사업정리를 위해 철거비 및 법률 상담을 지원합니다.\n\n지원대상: 전북 소재 폐업(예정) 소상공인\n\n[사업신청 방법] 온라인 접수\n- 전북특별자치도 소상공인 지원센터 홈페이지 접수\n\n[문의처]\n전북특별자치도 소상공인 지원센터 063-123-4567",
    externalUrl: "https://www.jb.go.kr",
  },
  {
    supportId: 4,
    organizationName: "전북특별자치도",
    title: "[전북] 2026년 새출발 재기지원 모집 공고",
    applyStartDate: "2026-03-26",
    applyEndDate: null,
    // TODO: applicationPeriod 실제 포맷 확정 전 임시값, 화면 표시에는 사용하지 않음
    applicationPeriod: "2026.03.26 - 예산 소진시까지",
    status: "ONGOING",
    isBookmarked: false,
    viewCount: 121,
    // TODO: 임시 데이터, 실제 공고 내용으로 교체 필요
    content:
      "폐업 후 재창업을 준비하는 소상공인을 대상으로 재기 자금과 컨설팅을 지원합니다.\n\n지원대상: 폐업 후 재창업을 준비하는 소상공인\n\n[사업신청 방법] 온라인 접수\n- 전북특별자치도 소상공인 지원센터 홈페이지 접수\n\n[문의처]\n전북특별자치도 소상공인 지원센터 063-123-4567",
    externalUrl: "https://www.jb.go.kr",
  },
];
