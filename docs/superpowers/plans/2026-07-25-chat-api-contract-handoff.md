# Chat API Contract Handoff Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 백엔드 명세를 검증 가능한 프런트 계약으로 변환하고, 실제 API와 같은 MSW를 먼저 연결한 뒤 환경 설정만으로 실제 서버를 검증할 수 있는 상태를 만든다.

**Architecture:** 백엔드 서버 구현·배포는 기다리지 않되 요청·응답 계약은 먼저 합의한다. 동일한 API 함수와 DTO를 MSW와 실제 서버가 공유하게 하고, 화면은 mock 배열 대신 TanStack Query hook만 사용한다. 실제 서버 준비 후에는 MSW를 끄고 `VITE_API_BASE_URL`을 바꿔 같은 통신 경로를 smoke test한다.

**Tech Stack:** Axios 1, TanStack Query 5, React 19, TypeScript 6, Zustand 5, Vite 8, MSW 2

## Global Constraints

- 이 계획은 UI PR이 생성된 뒤 시작한다.
- 백엔드 서버가 없어도 MSW와 API 계층은 구현할 수 있지만 schema 계약 없이는 시작하지 않는다.
- 엔드포인트 경로, HTTP 메서드, 오류 코드를 프런트에서 추측하지 않는다.
- 날짜 원본은 ISO 8601 절대 시각이어야 하며 서버 상대시간 문자열을 사용하지 않는다.
- 보안 값은 `.env.local`에만 저장하고 커밋하지 않는다.
- 백엔드에 빠진 필드는 mock 값으로 숨기지 않고 명시적으로 요청한다.

---

### Task 1: 백엔드 명세 수령 및 기준 버전 고정

**Files:**
- Create: `docs/api/chat-auth-contract.md`

**Interfaces:**
- Consumes: 백엔드가 제공한 OpenAPI URL·파일 또는 API 문서
- Produces: 문서 버전, 수령 시각, 담당자, base URL이 고정된 계약 문서

- [ ] **Step 1: 백엔드에 필수 자료 요청**

다음 항목을 한 번에 요청한다.

```text
1. 로컬/개발 서버 base URL
2. OpenAPI 또는 엔드포인트별 요청·응답 예시
3. 인증 방식과 세션 만료 처리
4. 채팅 목록/상세/메시지 전송/이미지 업로드/읽음 처리 API
5. 실시간 연결 방식과 재연결 규칙
6. 연결 실패, 권한 없음, 없는 채팅방, 탈퇴 사용자 오류 코드
```

- [ ] **Step 2: 수령한 명세의 식별 정보 기록**

`docs/api/chat-auth-contract.md` 첫 부분에 다음 값을 실제 수령 정보로 기록한다.

계약 문서에는 `수령 일시`, `백엔드 담당자`, `문서 위치`,
`문서 버전 또는 커밋`, `로컬 base URL`, `개발 base URL`을 실제 수령 값으로
기록한다. 값이 하나라도 빠지면 이 단계를 완료 처리하지 않는다.

- [ ] **Step 3: 계약 문서만 커밋**

```bash
git add docs/api/chat-auth-contract.md
git commit -m "docs: 인증 및 채팅 API 계약 기준 기록"
```

### Task 2: 프런트 필드 매핑 및 누락 필드 요청

**Files:**
- Modify: `docs/api/chat-auth-contract.md`
- Reference: `src/types/chat.ts`
- Reference: `src/auth/sessionBootstrap.ts`

**Interfaces:**
- Consumes: Task 1의 실제 API 문서
- Produces: 모든 필드의 서버 경로·nullable 여부·프런트 타입 매핑

- [ ] **Step 1: 인증 계약 표 작성**

다음 항목마다 실제 endpoint, method, request, success response, error response를
기록한다.

```text
로그인 시작
로그인 콜백
현재 세션 조회
로그아웃
인증 만료
탈퇴 사용자
```

- [ ] **Step 2: 채팅 목록 필드 대조**

다음 프런트 필드가 응답의 어느 JSON 경로에서 오는지 기록한다.

```text
roomId
productId
productName
productImageUrl
partnerUserId
partnerNickname
partnerAvatarUrl
lastMessage
lastMessageAt
unreadCount
partnerLeft
nextCursor
```

`lastMessageAt`은 ISO 8601 절대 시각인지 확인한다. `10분 전` 같은 서버 문자열만
제공되면 절대 시각 필드를 요청한다.

- [ ] **Step 3: 채팅방과 메시지 필드 대조**

```text
messageId
roomId
senderUserId
messageType
content 또는 imageUrl
caption
sentAt
read
nextCursor
availability
```

- [ ] **Step 4: 동작 계약 대조**

```text
목록 최신순 정렬 보장 여부
목록 페이지네이션 방향
과거 메시지 페이지네이션 방향
텍스트 전송 멱등성 키 지원 여부
이미지 업로드 순서와 최대 크기
읽음 처리 시점
실시간 이벤트 종류
재연결 backoff 또는 재조회 규칙
```

- [ ] **Step 5: 누락 필드 요청서 전송**

누락마다 다음 형식으로 요청한다.

```text
[화면/기능] CHAT001 채팅 목록
[누락 필드] productName
[필요 이유] 채팅 행에 기능명세 필수 정보로 표시
[원하는 형식] string, null 불가
[관련 식별자] roomId와 같은 목록 항목에 포함
```

같은 형식으로 `lastMessageAt`, `unreadCount`, `partnerLeft`, 이미지 업로드 결과,
오류 코드를 요청한다.

- [ ] **Step 6: 누락 0건 확인 후 커밋**

계약 문서의 모든 필드에 실제 JSON 경로 또는 명시적 `미지원` 결정이 있어야 한다.

```bash
git add docs/api/chat-auth-contract.md
git commit -m "docs: 채팅 API 필드 매핑 확정"
```

### Task 3: 로컬 환경 변수 인계

**Files:**
- Create or Modify: `.env.example`
- Local only: `.env.local`
- Verify: `.gitignore`

**Interfaces:**
- Consumes: Task 1에서 확정된 실제 base URL
- Produces: 문서화된 환경 변수 이름과 커밋되지 않는 개인 설정

- [ ] **Step 1: 예제 환경 변수 파일 작성**

```dotenv
VITE_API_BASE_URL=
VITE_NAVER_MAP_CLIENT_ID=
VITE_ENABLE_MSW=false
```

실제 비밀 값은 넣지 않는다. 각 변수의 용도는 주석으로 설명한다.

- [ ] **Step 2: 개인 환경 설정**

각 개발자는 `.env.local`의 `VITE_API_BASE_URL`에 Task 1에서 확정한 실제 개발
base URL을, `VITE_NAVER_MAP_CLIENT_ID`에 팀에서 발급한 개발용 지도 client id를
입력한다. MSW 개발 중에는 `VITE_ENABLE_MSW=true`로 설정한다.

- [ ] **Step 3: 비밀 파일 제외 확인**

Run: `git check-ignore -v .env.local`

Expected: `.gitignore`의 `.env.local` 규칙이 출력됨.

Run: `git status --short`

Expected: `.env.local`은 출력되지 않고 `.env.example`만 변경 파일로 표시됨.

- [ ] **Step 4: 환경 변수 문서 커밋**

```bash
git add .env.example
git commit -m "docs: 프런트 환경 변수 예시 추가"
```

### Task 4: MSW 우선 API 구현 계획 작성 게이트

**Files:**
- Reference: `docs/superpowers/specs/2026-07-25-msw-first-api-integration-design.md`
- Create: `docs/superpowers/plans/2026-07-25-msw-first-api-integration.md`

**Interfaces:**
- Consumes: 승인된 `docs/api/chat-auth-contract.md`
- Produces: 실제 endpoint와 DTO 이름이 들어간 구현 명세와 실행 계획

- [ ] **Step 1: 구현 브랜치 기준점 확인**

UI PR이 `dev`에 병합된 뒤 최신 `origin/dev`를 기준으로
`feat/junyoung/chat-api-integration` 브랜치를 만든다. UI PR이 병합 전이면 이
단계를 진행하지 않는다.

- [ ] **Step 2: 실제 계약 기반 파일 구조 확정**

다음 책임을 기준으로 실제 DTO와 endpoint를 문서에 배치한다.

```text
src/api/axios.ts                  공통 base URL, timeout, 인증 전송
src/api/auth.ts                   세션 조회와 인증 요청
src/api/chat.ts                   채팅 목록, 상세, 전송, 읽음 처리
src/api/chatUpload.ts             이미지 업로드가 별도 계약일 때만 생성
src/types/api/auth.ts             백엔드 인증 DTO
src/types/api/chat.ts             백엔드 채팅 DTO
src/utils/chatApiAdapter.ts       백엔드 DTO → ChatRoomSummary/Detail/Message
src/queries/chatQueries.ts        TanStack Query key와 query options
src/mocks/browser.ts              브라우저용 setupWorker
src/mocks/server.ts               Vitest용 setupServer
src/mocks/enableMocking.ts        VITE_ENABLE_MSW 조건부 시작
src/mocks/handlers/auth.ts        실제 인증 계약과 같은 MSW 응답
src/mocks/handlers/chat.ts        실제 채팅 계약과 같은 MSW 응답
src/mocks/handlers/index.ts       handler 통합 export
```

이미지 업로드가 채팅 전송과 단일 endpoint라면 `chatUpload.ts`는 생성하지 않는다.

- [ ] **Step 3: 명세에 실제 식별자만 사용**

새 API 설계와 계획에는 승인된 계약의 endpoint, method, DTO 필드, 오류 코드,
페이지네이션 파라미터를 그대로 기록한다. 미정 표시, 임의 URL, 임의 오류 코드는
허용하지 않는다.

- [ ] **Step 4: 테스트 우선 순서 확정**

API 구현 계획은 다음 독립 완료 단위로 나눈다.

```text
1. API DTO와 Axios 함수
2. 브라우저·Vitest MSW bootstrap
3. 인증 handler와 세션 복원 API
4. 채팅 목록 handler, 조회 hook, DTO adapter
5. 채팅방·과거 메시지 handler와 조회 hook
6. 텍스트 메시지 전송과 중복 방지
7. 이미지 업로드·전송
8. 읽음 처리
9. 연결 실패·탈퇴 오류 매핑
10. 페이지의 Zustand mock 직접 참조 제거
11. MSW 계약 테스트와 전체 빌드
12. MSW 비활성화, 실제 base URL smoke test
13. push와 별도 API PR
```

- [ ] **Step 5: 사용자에게 API 설계 검토 요청**

실제 계약이 반영된 spec을 먼저 커밋하고 검토받은 뒤 상세 구현 plan을 확정한다.
승인 전에는 API 소스 코드를 수정하지 않는다.
