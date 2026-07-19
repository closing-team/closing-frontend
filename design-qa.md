# 중고거래 채팅방 디자인 QA

**비교 대상**

- source visual truth: Figma `클로징` 파일의 `중고거래_채팅` 프레임 (`1180:8376`), 로컬 QA 캡처 `.superpowers/sdd/chat-room-figma-375x812.png` (커밋 제외)
- implementation screenshot: 로컬 QA 캡처 `.superpowers/sdd/chat-room-implementation-375x812.png` (커밋 제외)
- full-view comparison: 로컬 QA 산출물 `.superpowers/sdd/chat-room-comparison.png` (커밋 제외)
- viewport: 375 × 812 px
- state: 거래 상품 요약과 세 개의 기본 대화가 있는 채팅방 초기 상태
- normalization: Figma의 iOS 상태 표시줄 44 px은 웹 구현 범위가 아니므로 원본 상단 44 px을 제외하고 구현 화면의 상단 768 px과 비교함

**Findings**

- Actionable P0/P1/P2 mismatch 없음.
- 구조와 간격: 56 px 상단 바, 68 px 상품 요약, 날짜와 메시지 그룹의 간격, 하단 72 px 작성 영역이 원본과 일치함.
- 메시지: 내 메시지는 오른쪽 보라색 말풍선, 상대 메시지는 아바타가 있는 왼쪽 흰색 말풍선으로 표시되며 연속 메시지의 읽음·시간 표시는 마지막 말풍선에 한 번만 노출됨.
- 타이포그래피와 색상: SUIT 글꼴, 제목·본문·캡션 위계, Primary 500과 Gray 토큰을 프로젝트 디자인 시스템에서 사용함.
- 이미지 품질: Figma가 제공한 상품 이미지와 파트너 아바타를 실제 래스터 자산으로 사용함. 상품 이미지의 세로 크롭도 Figma의 위치와 비율에 맞춤.
- 문구와 콘텐츠: 최신 Figma의 닉네임, 상품명, 가격, 날짜, 메시지, 시간과 읽음 상태를 동일하게 반영함.

**Focused Region Evidence**

- 별도 확대 비교는 필요하지 않았음. 766 × 806 나란히 비교 이미지에서 상단 바, 상품 이미지 크롭, 메시지 정렬, 메타데이터, 하단 작성 영역을 원본 크기로 선명하게 판별할 수 있었음.

**Primary Interactions and Runtime Checks**

- 브라우저에서 임시 미리보기 경로를 열어 상품 요약, 세 메시지, 작성 영역의 접근성 구조를 확인함.
- 텍스트를 입력한 뒤 전송 버튼을 눌러 새 메시지가 화면에 추가되는지 확인했고, 새로고침 후 목 초기 상태로 복원되는 것도 확인함.
- 이미지 선택·미리보기·제거, 이미지와 문구 동시 전송, 실패 후 재시도, 작성 중 잠금은 Vitest로 검증함.
- 브라우저 console warning/error: 없음.

**Comparison History**

- 첫 비교에서 상품 썸네일이 채팅 목록용 목 이미지를 사용하고 있어 Figma 원본 자산으로 교체함.
- 두 번째 비교에서 원본의 세로 크롭 범위와 차이가 있어 Figma 원본 자산을 해당 표시 범위로 미리 최적화함. 재사용 컴포넌트는 일반 API 이미지에도 안전한 `object-cover`를 유지함.
- 최종 정규화 비교에서 actionable P0/P1/P2 차이가 없음을 확인함.

**Implementation Checklist**

- [x] 최신 Figma 프레임과 동일한 기본 채팅방 상태
- [x] 웹 범위 밖인 iOS 상태 표시줄 제외
- [x] 실제 Figma 상품 이미지와 파트너 아바타 사용
- [x] 메시지 정렬·그룹화·읽음·시간 표시
- [x] 텍스트 전송과 Enter/Shift+Enter 동작
- [x] 이미지 선택, 56 × 56 미리보기, 제거와 캡션 전송
- [x] 실패 알림과 동일 payload 재시도
- [x] 긴 대화에서도 대화 영역만 스크롤되고 작성 영역은 하단 고정
- [x] 외부 메시지 갱신·채팅방 변경 동기화와 새 메시지 자동 스크롤
- [x] 브라우저 console 확인 및 핵심 동작 테스트

**Follow-up Polish**

- 실제 인증·사용자·채팅 API와 운영 라우트 연결은 Task 7에서 진행함. 현재 화면은 목 데이터와 주입 가능한 콜백으로 준비되어 있음.

final result: passed
