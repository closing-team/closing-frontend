# MSW 우선 API 연동 설계

> 작성일: 2026-07-25
> 기준 자료: `API 연결` PDF, 백엔드 API 명세서, 현재 프런트엔드 저장소
> 범위: 담당 영역인 인증과 채팅 API

## 1. 결론

백엔드 서버가 아직 구현·배포되지 않아도 MSW로 프런트 API 연동을 먼저 개발할 수
있다. 다만 **“백엔드가 완성되면 주소만 바꾸면 된다”는 말은 조건부로 맞다.**

다음 조건이 모두 같으면 화면·query·adapter 코드를 고치지 않고 환경 변수만 바꿔
실제 서버로 전환할 수 있다.

- HTTP method와 endpoint path
- path/query parameter
- request body와 content type
- response status와 JSON schema
- nullable 여부와 날짜 형식
- 인증 쿠키·토큰 방식
- 오류 status와 error body
- 페이지네이션과 정렬 규칙

실제 전환은 엄밀히 말해 주소 하나만 바꾸는 것이 아니라 다음 두 설정을 바꾸는
작업이다.

```dotenv
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=백엔드가 제공한 실제 base URL
```

MSW와 실제 API의 계약이 다르면 DTO adapter, 인증 설정, 오류 처리, CORS,
이미지 업로드, 실시간 연결 등을 추가로 수정해야 한다.

## 2. MSW란 무엇인가

MSW(Mock Service Worker)는 프런트 코드가 보낸 실제 HTTP 요청을 네트워크 계층에서
가로채 미리 정한 mock 응답을 돌려주는 도구다.

컴포넌트가 mock 배열을 직접 import하는 방식과 달리, 화면은 Axios와 API 함수를
통해 평소와 똑같이 요청한다. 개발 환경에서는 Service Worker가 그 요청에 응답하고,
실제 환경에서는 같은 요청이 백엔드로 전달된다.

```text
화면
  ↓
TanStack Query hook
  ↓
API 함수
  ↓
Axios 인스턴스
  ↓
VITE_ENABLE_MSW=true  → MSW handler가 응답
VITE_ENABLE_MSW=false → 실제 백엔드가 응답
```

이 구조의 장점은 다음과 같다.

- 백엔드 서버를 기다리지 않고 loading, success, empty, error UI를 구현할 수 있다.
- Axios, query hook, DTO adapter 등 실제 통신 경로를 미리 검증한다.
- 같은 handler를 브라우저 개발 환경과 Vitest 통합 테스트에서 재사용할 수 있다.
- 네트워크 오류, 401, 404, 탈퇴 사용자 같은 상태를 반복 재현할 수 있다.

MSW는 백엔드 자체를 구현하는 도구가 아니다. mock 응답이 실제 백엔드 계약과
일치하는지는 팀이 별도로 관리해야 한다.

## 3. PDF에서 확인한 담당 endpoint

PDF는 MSW 연결과 실제 API 연결 현황을 확인하는 체크리스트다. schema 개발 기준은
별도의 백엔드 API 명세서를 보라고 명시되어 있다. 2026-07-25 기준 아래 항목의
MSW 연결과 API 연결 현황은 모두 `시작 전`이다.

### 인증

```text
POST   /api/v1/auth/kakao
DELETE /api/v1/auth/logout
POST   /api/v1/auth/signup
GET    /api/v1/terms
```

### 채팅

```text
POST  /api/v1/chat-rooms/{productId}
POST  /api/v1/chat-rooms/{chatRoomId}/messages
PATCH /api/v1/chat-rooms/{chatRoomId}/read
GET   /api/v1/chat-rooms/{chatRoomId}/messages
GET   /api/v1/chat-rooms
```

이 목록은 method와 path만 보여주므로 이것만으로 정확한 MSW handler를 완성할 수는
없다. 요청·응답 schema, 인증, 오류, 페이지네이션 계약은 백엔드 명세에서 추가로
확인해야 한다.

## 4. 현재 저장소 상태

MSW는 아직 적용 완료 상태가 아니다.

### 준비된 항목

- `msw@2.15.0` 설치
- `public/mockServiceWorker.js` 생성
- Axios 공통 인스턴스 `src/api/axios.ts`
- `VITE_API_BASE_URL` 참조
- TanStack Query provider 설치

### 없는 항목

- `setupWorker`를 사용하는 browser worker
- 인증·채팅 request handler
- 앱 시작 전 `worker.start()` 호출
- Vitest용 `setupServer`
- MSW 활성화 환경 변수
- 실제 endpoint를 호출하는 인증·채팅 API 함수
- API DTO와 화면 도메인 타입 사이 adapter
- query hook과 mutation hook

현재 채팅 화면은 Zustand의 `MOCK_PRODUCTS`, `MOCK_MESSAGES`를 직접 읽기 때문에
base URL만 바꿔도 실제 API로 전환되지 않는다.

## 5. 설계 원칙

### 5.1 화면은 mock을 알지 않는다

페이지와 컴포넌트는 `src/mocks`를 import하지 않는다. 화면은 query hook과 mutation
hook만 사용한다.

### 5.2 API 함수는 환경과 무관하다

API 함수는 항상 동일한 상대 경로를 사용한다.

```ts
api.get("/api/v1/chat-rooms");
api.get(`/api/v1/chat-rooms/${chatRoomId}/messages`);
api.post(`/api/v1/chat-rooms/${chatRoomId}/messages`, request);
```

MSW 사용 여부를 API 함수 내부의 `if`문으로 분기하지 않는다.

### 5.3 MSW와 실제 API가 DTO를 공유한다

`src/types/api`에 백엔드 schema와 같은 DTO를 정의한다. MSW handler는 이 DTO를
만족하는 fixture를 반환하고, adapter는 DTO를 `ChatRoomSummary`,
`ChatRoomDetail`, `ChatMessage`로 변환한다.

### 5.4 mock 활성화는 명시적이다

MSW는 `VITE_ENABLE_MSW === "true"`이고 개발 모드일 때만 시작한다. 실제 배포
bundle에서는 worker가 실행되지 않아야 한다.

### 5.5 계약이 없는 필드는 추측하지 않는다

상품명, 최근 메시지 절대 시각, 읽지 않은 수, 탈퇴 여부가 API schema에 없다면
fixture에만 임의로 넣지 않는다. 백엔드에 필드 추가를 요청한 뒤 DTO와 handler에
동시에 반영한다.

## 6. 파일 구조

```text
src/api/axios.ts
src/api/auth.ts
src/api/chat.ts
src/types/api/auth.ts
src/types/api/chat.ts
src/utils/chatApiAdapter.ts
src/queries/authQueries.ts
src/queries/chatQueries.ts
src/mocks/browser.ts
src/mocks/server.ts
src/mocks/handlers/index.ts
src/mocks/handlers/auth.ts
src/mocks/handlers/chat.ts
src/mocks/fixtures/auth.ts
src/mocks/fixtures/chat.ts
src/mocks/enableMocking.ts
```

이미지 업로드 endpoint가 별도로 확정될 때만 `src/api/chatUpload.ts`와 대응
handler를 추가한다.

## 7. 실행 흐름

### 개발 환경

1. `main.tsx`가 React를 렌더링하기 전에 `enableMocking()`을 기다린다.
2. `VITE_ENABLE_MSW=true`이면 `src/mocks/browser.ts`를 동적 import한다.
3. worker가 시작된 뒤 앱이 렌더링된다.
4. 화면의 Axios 요청을 MSW handler가 가로채 DTO 형태의 응답을 반환한다.

API 요청을 handler에 빼먹었을 때 조용히 실제 네트워크로 나가지 않도록
`/api/v1/` 요청의 unhandled request는 개발 중 오류로 처리한다. 이미지·폰트·지도
등 외부 자산 요청은 우회한다.

### 테스트 환경

`src/mocks/server.ts`의 `setupServer`를 `src/test/setup.ts`에서 시작한다.

- `beforeAll`: server 시작
- `afterEach`: handler reset과 Testing Library cleanup
- `afterAll`: server 종료

테스트마다 handler를 override해 401, 404, 네트워크 오류, 빈 목록, 탈퇴 사용자를
검증한다.

### 실제 API 환경

1. `.env.local` 또는 배포 환경에서 `VITE_ENABLE_MSW=false`로 설정한다.
2. `VITE_API_BASE_URL`을 실제 backend base URL로 설정한다.
3. 동일한 API 함수와 query hook으로 smoke test한다.
4. 계약 차이가 발견되면 환경 변수로 숨기지 않고 백엔드 명세 또는 adapter를
   수정한다.

## 8. “주소만 바꾸면 된다”가 성립하는 경우

다음 조건에서는 화면 코드를 수정하지 않고 환경 설정만 바꾸는 것이 맞다.

- MSW handler와 실제 서버가 같은 path와 method를 사용한다.
- fixture가 실제 response envelope와 필드명을 그대로 사용한다.
- 날짜가 동일한 ISO 8601 형식이다.
- 인증 방식과 `withCredentials` 설정이 미리 맞춰져 있다.
- 오류 status와 body가 동일하다.
- 화면이 mock store가 아니라 API hook을 사용한다.
- 이미지와 실시간 통신을 포함한 모든 사용 기능의 계약이 동일하다.

## 9. 추가 수정이 필요한 경우

다음 중 하나라도 다르면 주소 변경만으로 끝나지 않는다.

- `{ data: ... }` 같은 response envelope 차이
- `chatRoomId`와 `roomId` 같은 필드명 차이
- 최근 메시지 시각 대신 `10분 전` 같은 문자열만 제공
- 쿠키 인증인데 Axios `withCredentials` 또는 CORS 설정이 없음
- 이미지 전송이 JSON이 아니라 `multipart/form-data`
- pagination이 page 방식과 cursor 방식으로 다름
- 탈퇴 사용자와 연결 실패의 오류 코드가 mock과 다름
- 채팅 실시간 방식이 REST polling에서 WebSocket/SSE로 변경

따라서 정확한 표현은 다음과 같다.

> MSW를 실제 API 계약과 동일하게 만들고 화면이 API 계층만 사용한다면, 백엔드
> 준비 후에는 MSW를 끄고 base URL을 바꾸는 수준으로 전환할 수 있다.

## 10. 환경 변수

`.env.example`에는 이름만 기록하고 실제 값은 커밋하지 않는다.

```dotenv
VITE_ENABLE_MSW=false
VITE_API_BASE_URL=
VITE_NAVER_MAP_CLIENT_ID=
```

개발자가 MSW를 사용할 때는 개인 `.env.local`에서 `VITE_ENABLE_MSW=true`로
덮어쓴다.

## 11. 테스트 및 완료 기준

- 앱이 MSW 활성 상태에서 인증·채팅 endpoint를 실제 Axios로 호출한다.
- 채팅 목록, 빈 목록, 채팅방, 전송, 읽음, 오류, 탈퇴 상태를 handler로 재현한다.
- Vitest가 같은 handler를 사용한다.
- 페이지와 컴포넌트가 mock 배열을 직접 import하지 않는다.
- unhandled `/api/v1/` 요청이 개발 중 즉시 드러난다.
- MSW를 끄면 요청이 `VITE_API_BASE_URL`의 실제 서버로 전달된다.
- 실제 API 전환 뒤 화면 소스 변경 없이 정상 응답을 표시한다.
- schema 차이가 있으면 adapter 또는 백엔드 계약에 명시적으로 반영한다.
