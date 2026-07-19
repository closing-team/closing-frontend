# 채팅 목록 디자인 QA

**비교 대상**

- source visual truth: Figma `클로징` 파일의 `채팅목록` 프레임 (`987:68812`), 로컬 QA 캡처 `.superpowers/sdd/chat-list-figma-375x812.png` (커밋 제외)
- implementation screenshot: 로컬 QA 캡처 `.superpowers/sdd/chat-list-implementation-375x812.png` (커밋 제외)
- full-view comparison: 로컬 QA 산출물 `.superpowers/sdd/chat-list-comparison.png` (커밋 제외)
- viewport: 375 × 812 px
- state: 최신 대화 4개가 있는 기본 목록 상태
- normalization: Figma의 iOS 상태 표시줄 44 px은 웹 구현 범위가 아니므로 원본 상단 44 px을 제외하고 비교함

**Findings**

- Actionable P0/P1/P2 mismatch 없음.
- 타이포그래피: 닉네임 16/24, 최근 메시지 14/21, 위치·시간 12/18의 크기와 위계, 말줄임이 원본과 일치함.
- 간격과 레이아웃: 56 px 상단 바, 99 px 행 높이, 이미지·텍스트·배지의 가로 위치와 행 간 리듬이 원본과 일치함.
- 색상과 토큰: 흰 배경, 본문/보조 텍스트 대비, 보라색 읽지 않은 메시지 배지가 원본과 일치함.
- 이미지 품질: Figma 원본 상품 이미지와 파트너 아바타를 실제 래스터 자산으로 사용했으며 표시 크기에 맞게 최적화함.
- 문구와 콘텐츠: 최신 Figma의 닉네임, 최근 메시지, 위치, 상대 시간, 읽지 않은 개수를 동일하게 반영함.

**Focused Region Evidence**

- 별도 확대 비교는 필요하지 않았음. 원본 크기의 750 × 798 나란히 비교 이미지에서 상단 바, 네 행의 타이포그래피, 이미지 마스킹, 배지와 말줄임을 모두 선명하게 판별할 수 있었음.

**Primary Interactions and Runtime Checks**

- 브라우저에서 임시 미리보기 경로를 열어 네 개 채팅 행과 전체 접근성 이름을 확인함.
- 채팅 행 선택, 뒤로가기 콜백, 홈 이동 어댑터는 Vitest로 검증함.
- 브라우저 console warning/error: 없음.

**Comparison History**

- 첫 정규화 비교에서 actionable P0/P1/P2 차이가 발견되지 않아 수정 반복은 필요하지 않았음.

**Implementation Checklist**

- [x] 최신 Figma 프레임과 동일한 기본 목록 상태
- [x] 웹 범위 밖인 iOS 상태 표시줄 제외
- [x] 실제 이미지 자산 사용 및 최적화
- [x] 말줄임, 읽지 않은 배지, 빈 상태, 최신순 정렬
- [x] 키보드 사용 가능한 semantic button 행과 접근성 이름
- [x] 브라우저 console 확인 및 동작 테스트

**Follow-up Polish**

- 실제 채팅 상세 라우트가 정해지면 `onSelectRoom`을 라우터에 연결할 수 있음. 이는 Task 1의 시각 범위 밖이며 현재 목록 컴포넌트는 콜백으로 준비되어 있음.

final result: passed
