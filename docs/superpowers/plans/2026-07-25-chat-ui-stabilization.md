# Chat UI Stabilization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 채팅 목록의 상품명·최근 메시지 시간을 바로잡고, 채팅 예외 상태와 스플래시 프레임을 구현한 뒤 복제 파일을 정리하여 UI 전용 PR을 만든다.

**Architecture:** 채팅 도메인 타입과 순수 시간 포매터를 화면 컴포넌트에서 분리한다. 라우트 페이지는 Zustand mock 데이터를 계속 사용하고, Figma에 없는 예외 상태는 `ChatAvailabilityNotice`와 비활성화 가능한 `ChatComposer`로 격리한다. 실제 API 연결은 이 계획에 포함하지 않고 별도 계약 인수 계획을 거친다.

**Tech Stack:** React 19, TypeScript 6, React Router 7, Zustand 5, Tailwind CSS 4, Vitest 4, Testing Library

## Global Constraints

- 구현 기준은 기능명세 우선, Figma 시각 체계 유지이다.
- 앱 화면 폭은 최대 375px, 최소 320px이다.
- 채팅 목록 시간의 유일한 원본은 `lastMessageAt`이다.
- 연결 상태와 개별 메시지 전송 실패 상태를 합치지 않는다.
- UI 안정화 단계에서는 `.env`를 수정하지 않는다.
- 실제 API 코드와 엔드포인트 추측은 이 PR에 포함하지 않는다.
- 기존 사용자 변경과 무관한 파일을 수정하거나 삭제하지 않는다.

---

### Task 1: 채팅 목록에 상품명 표시

**Files:**
- Create: `src/components/chat/ChatCard.test.tsx`
- Modify: `src/components/chat/ChatCard.tsx`

**Interfaces:**
- Consumes: `ChatRoomSummary.productName: string`
- Produces: 상품명까지 포함하는 채팅 행 UI와 접근 가능한 이름

- [ ] **Step 1: 상품명 노출 회귀 테스트 작성**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ChatCard from "./ChatCard";
import type { ChatRoomSummary } from "../../types/chat";

const room: ChatRoomSummary = {
  id: "room-1",
  productId: "product-1",
  productName: "업소용 냉장고",
  productImageUrl: "/product.jpg",
  partnerNickname: "민수아빠",
  partnerAvatarUrl: "/avatar.jpg",
  location: "부산 해운대구",
  lastMessage: "제품 상태는 어떤가요?",
  lastMessageAt: "2026-07-25T12:50:00+09:00",
  relativeTime: "10분 전",
  unreadCount: 5,
};

describe("ChatCard", () => {
  it("상품명과 최근 메시지 정보를 화면과 접근 가능한 이름에 표시한다", () => {
    render(<ChatCard room={room} onSelect={vi.fn()} />);

    expect(screen.getByText("업소용 냉장고")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /민수아빠 채팅방, 업소용 냉장고, 제품 상태는 어떤가요\?, 10분 전/,
      }),
    ).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: 테스트가 현재 타입 또는 화면에서 실패하는지 확인**

Run: `npm test -- src/components/chat/ChatCard.test.tsx`

Expected: `lastMessageTimeLabel` 타입이 없거나 상품명 텍스트를 찾지 못해 FAIL.

- [ ] **Step 3: 행 정보 구조와 접근 가능한 이름 수정**

`ChatCard.tsx`에서 접근 가능한 이름을 다음 순서로 구성한다.

```ts
const accessibleName = [
  `${room.partnerNickname} 채팅방`,
  room.productName,
  room.lastMessage,
  room.relativeTime,
  unreadMessageLabel,
]
  .filter(Boolean)
  .join(", ");
```

텍스트 영역은 닉네임, 한 줄 말줄임 상품명, 한 줄 말줄임 최근 메시지를 표시하고,
우측 보조 영역은 현재 `relativeTime`과 읽지 않은 메시지 배지를 표시한다.
지역 정보는 타입에 남기되 기본 행에서는 표시하지 않는다.

- [ ] **Step 4: 상품명 테스트 통과 확인**

Run: `npm test -- src/components/chat/ChatCard.test.tsx`

Expected: PASS.

- [ ] **Step 5: Task 1 커밋**

```bash
git add src/components/chat/ChatCard.tsx src/components/chat/ChatCard.test.tsx
git commit -m "feat: 채팅 목록에 상품명 표시"
```

### Task 2: 최근 메시지 시각 기반 시간 표시

**Files:**
- Create: `src/utils/chatTime.ts`
- Create: `src/utils/chatTime.test.ts`
- Modify: `src/types/chat.ts`
- Modify: `src/utils/chatAdapter.ts`
- Modify: `src/components/chat/ChatCard.tsx`
- Modify: `src/components/chat/ChatCard.test.tsx`

**Interfaces:**
- Produces: `formatChatListTime(sentAt: string, now?: Date): string`
- Produces: `ChatRoomSummary.lastMessageTimeLabel: string`
- Removes: `ChatRoomSummary.relativeTime`

- [ ] **Step 1: 시간 경계값 테스트 작성**

```ts
import { describe, expect, it } from "vitest";
import { formatChatListTime } from "./chatTime";

const now = new Date("2026-07-25T13:00:00+09:00");

describe("formatChatListTime", () => {
  it.each([
    ["2026-07-25T12:59:31+09:00", "방금 전"],
    ["2026-07-25T12:50:00+09:00", "10분 전"],
    ["2026-07-25T11:00:00+09:00", "2시간 전"],
    ["2026-07-23T13:00:00+09:00", "2일 전"],
    ["2026-07-10T13:00:00+09:00", "7월 10일"],
    ["2025-12-31T13:00:00+09:00", "2025. 12. 31."],
    ["invalid", ""],
  ])("%s를 %s로 표시한다", (sentAt, expected) => {
    expect(formatChatListTime(sentAt, now)).toBe(expected);
  });
});
```

- [ ] **Step 2: 포매터 테스트가 실패하는지 확인**

Run: `npm test -- src/utils/chatTime.test.ts`

Expected: 모듈이 없어 FAIL.

- [ ] **Step 3: 순수 포매터 구현**

```ts
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatChatListTime(
  sentAt: string,
  now: Date = new Date(),
): string {
  const sent = new Date(sentAt);
  if (Number.isNaN(sent.getTime())) return "";

  const elapsed = Math.max(0, now.getTime() - sent.getTime());
  if (elapsed < MINUTE_MS) return "방금 전";
  if (elapsed < HOUR_MS) return `${Math.floor(elapsed / MINUTE_MS)}분 전`;
  if (elapsed < DAY_MS) return `${Math.floor(elapsed / HOUR_MS)}시간 전`;
  if (elapsed < 7 * DAY_MS) return `${Math.floor(elapsed / DAY_MS)}일 전`;

  if (sent.getFullYear() === now.getFullYear()) {
    return `${sent.getMonth() + 1}월 ${sent.getDate()}일`;
  }

  return `${sent.getFullYear()}. ${sent.getMonth() + 1}. ${sent.getDate()}.`;
}
```

- [ ] **Step 4: 채팅 요약 타입과 어댑터 교체**

`src/types/chat.ts`에서 `relativeTime`을 제거하고 다음 필드를 추가한다.

```ts
lastMessageTimeLabel: string;
```

`ChatCard.tsx`와 `ChatCard.test.tsx`도 `room.relativeTime` 참조를
`room.lastMessageTimeLabel`로 바꾼다.

`toChatRoomSummaries`에 테스트용 현재 시각을 주입한다.

```ts
export function toChatRoomSummaries(
  products: Product[],
  messagesByProduct: Record<number, UsedChatMessage[]>,
  now: Date = new Date(),
): ChatRoomSummary[] {
  // 기존 map 내부
  return {
    // 기존 필드
    lastMessageAt: last.sentAt,
    lastMessageTimeLabel: formatChatListTime(last.sentAt, now),
    unreadCount,
  };
}
```

`product.timeAgo`를 채팅 시간에 사용하는 코드는 제거한다.

- [ ] **Step 5: 포매터와 카드 테스트 통과 확인**

Run: `npm test -- src/utils/chatTime.test.ts src/components/chat/ChatCard.test.tsx`

Expected: PASS.

- [ ] **Step 6: TypeScript 참조 정리 확인**

Run: `rg -n "relativeTime|product\\.timeAgo" src/components/chat src/pages/chat src/types/chat.ts src/utils/chatAdapter.ts`

Expected: 채팅 목록 경로에서 결과 없음.

- [ ] **Step 7: Task 2 커밋**

```bash
git add src/utils/chatTime.ts src/utils/chatTime.test.ts src/types/chat.ts src/utils/chatAdapter.ts src/components/chat/ChatCard.tsx src/components/chat/ChatCard.test.tsx
git commit -m "fix: 최근 메시지 시각으로 채팅 시간 계산"
```

### Task 3: 연결 실패와 상대방 탈퇴 UI

**Files:**
- Create: `src/components/chat/ChatAvailabilityNotice.tsx`
- Create: `src/pages/chat/ChatRoomPage.test.tsx`
- Modify: `src/types/chat.ts`
- Modify: `src/components/chat/ChatComposer.tsx`
- Modify: `src/pages/chat/ChatRoomPage.tsx`
- Modify: `src/utils/chatAdapter.ts`

**Interfaces:**
- Produces: `ChatAvailability = "active" | "disconnected" | "partner-left"`
- Produces: `ChatRoomDetail.availability: ChatAvailability`
- Produces: `ChatComposerProps.disabled?: boolean`
- Produces: `ChatComposerProps.disabledPlaceholder?: string`
- Produces: `ChatRoomView` named export for isolated component tests

- [ ] **Step 1: 예외 상태 컴포넌트 테스트 작성**

`ChatRoomPage.test.tsx`에서 `ChatRoomView`를 직접 렌더링하고 다음 세 시나리오를
검증한다.

```tsx
it("연결 실패 시 입력을 막고 다시 연결을 제공한다", async () => {
  const onReconnect = vi.fn();
  render(
    <ChatRoomView
      room={{ ...room, availability: "disconnected" }}
      messages={[]}
      onBack={vi.fn()}
      onSelectProduct={vi.fn()}
      onSendMessage={vi.fn()}
      onReconnect={onReconnect}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "채팅 연결이 원활하지 않습니다.",
  );
  expect(screen.getByRole("textbox", { name: "메시지 입력" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "다시 연결" }));
  expect(onReconnect).toHaveBeenCalledOnce();
});

it("탈퇴 사용자 채팅에서는 입력과 재연결을 모두 막는다", () => {
  render(
    <ChatRoomView
      room={{ ...room, availability: "partner-left" }}
      messages={[]}
      onBack={vi.fn()}
      onSelectProduct={vi.fn()}
      onSendMessage={vi.fn()}
    />,
  );

  expect(screen.getByRole("alert")).toHaveTextContent(
    "탈퇴한 사용자와는 대화할 수 없습니다.",
  );
  expect(screen.getByRole("textbox", { name: "메시지 입력" })).toBeDisabled();
  expect(
    screen.queryByRole("button", { name: "다시 연결" }),
  ).not.toBeInTheDocument();
});
```

- [ ] **Step 2: 예외 상태 테스트가 실패하는지 확인**

Run: `npm test -- src/pages/chat/ChatRoomPage.test.tsx`

Expected: `ChatRoomView` export 또는 `availability` 타입이 없어 FAIL.

- [ ] **Step 3: 채팅 가용 상태 타입 추가**

```ts
export type ChatAvailability =
  | "active"
  | "disconnected"
  | "partner-left";

export interface ChatRoomDetail {
  // 기존 필드
  availability: ChatAvailability;
}
```

`toChatRoomDetail`이 mock 단계에서는 `availability: "active"`를 반환하게 한다.

- [ ] **Step 4: 전용 알림 컴포넌트 구현**

```tsx
import type { ChatAvailability } from "../../types/chat";

interface ChatAvailabilityNoticeProps {
  availability: Exclude<ChatAvailability, "active">;
  onReconnect?: () => void | Promise<void>;
}

export default function ChatAvailabilityNotice({
  availability,
  onReconnect,
}: ChatAvailabilityNoticeProps) {
  return (
    <div
      role="alert"
      className="mx-4 mb-2 flex min-h-11 items-center justify-between gap-3 rounded-lg bg-gray-900 px-4 py-3 text-body-3 text-white"
    >
      <span>
        {availability === "disconnected"
          ? "채팅 연결이 원활하지 않습니다."
          : "탈퇴한 사용자와는 대화할 수 없습니다."}
      </span>
      {availability === "disconnected" && (
        <button
          type="button"
          className="shrink-0 font-semibold text-primary-100"
          onClick={() => void onReconnect?.()}
        >
          다시 연결
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 5: 입력기 비활성화 인터페이스 추가**

`ChatComposer`에 다음 props를 추가하고 이미지 선택, 텍스트 입력, 전송 버튼에
`disabled || isSending`을 적용한다.

```ts
interface ChatComposerProps {
  onSend: (message: PendingChatMessage) => void | Promise<void>;
  disabled?: boolean;
  disabledPlaceholder?: string;
}
```

비활성 상태의 placeholder는 `메시지를 보낼 수 없습니다.`로 표시한다.

- [ ] **Step 6: ChatRoomView에 상태 연결**

기존 내부 `ChatRoomView`를 named export로 바꾸고 `onReconnect` prop을 추가한다.
`room.availability !== "active"`이면 `ChatAvailabilityNotice`를 입력기 위에
표시하고 `ChatComposer`를 비활성화한다. 기본 라우트 페이지는 adapter가 제공하는
`active` 상태를 그대로 사용한다.

- [ ] **Step 7: 예외 상태와 기존 전송 실패 테스트 통과 확인**

Run: `npm test -- src/pages/chat/ChatRoomPage.test.tsx`

Expected: active, disconnected, partner-left, 개별 전송 실패 재시도가 모두 PASS.

- [ ] **Step 8: Task 3 커밋**

```bash
git add src/components/chat/ChatAvailabilityNotice.tsx src/components/chat/ChatComposer.tsx src/pages/chat/ChatRoomPage.tsx src/pages/chat/ChatRoomPage.test.tsx src/types/chat.ts src/utils/chatAdapter.ts
git commit -m "feat: 채팅 연결 및 탈퇴 예외 상태 추가"
```

### Task 4: 스플래시를 홈과 같은 앱 프레임으로 제한

**Files:**
- Modify: `src/pages/auth/SplashPage.test.tsx`
- Modify: `src/pages/auth/SplashPage.tsx`

**Interfaces:**
- Consumes: CSS 토큰 `max-w-app`, `--container-app-min`
- Produces: 홈과 같은 320–375px 중앙 앱 프레임

- [ ] **Step 1: 프레임 회귀 테스트 추가**

```tsx
it("홈과 같은 앱 프레임과 동적 뷰포트 높이를 사용한다", () => {
  renderSplash({ status: "checking" });

  expect(screen.getByRole("main")).toHaveClass(
    "mx-auto",
    "min-h-dvh",
    "w-full",
    "max-w-app",
    "min-w-[var(--container-app-min)]",
    "shadow-sm",
  );
});
```

- [ ] **Step 2: 현재 구현에서 테스트 실패 확인**

Run: `npm test -- src/pages/auth/SplashPage.test.tsx`

Expected: 공통 프레임 클래스가 없어 FAIL.

- [ ] **Step 3: 최소 클래스 변경**

최상위 `main`:

```tsx
<main className="relative mx-auto min-h-dvh w-full max-w-app min-w-[var(--container-app-min)] overflow-hidden bg-primary-500 shadow-sm">
```

내부 컨테이너의 `min-h-screen`을 `min-h-dvh`로 바꾼다.

- [ ] **Step 4: 스플래시와 인증 부트스트랩 회귀 테스트**

Run: `npm test -- src/pages/auth/SplashPage.test.tsx src/components/auth/AuthBootstrap.test.tsx src/auth/sessionBootstrap.test.ts`

Expected: PASS.

- [ ] **Step 5: Task 4 커밋**

```bash
git add src/pages/auth/SplashPage.tsx src/pages/auth/SplashPage.test.tsx
git commit -m "fix: 스플래시를 앱 프레임 너비로 제한"
```

### Task 5: 복제 파일과 채팅 테스트 정리

**Files:**
- Verify then remove: 이름이 ` 2`로 끝나는 `src` 하위 파일 25개
- Keep: Task 1–3에서 만든 정식 채팅 테스트

**Interfaces:**
- Consumes: Task 1–3의 정식 테스트
- Produces: TypeScript 빌드 입력에 복제 파일이 없는 소스 트리

- [ ] **Step 1: 복제 파일 목록 고정**

Run: `rg --files src -g '* 2.*' | sort`

Expected: 현재 확인된 25개 파일만 출력.

- [ ] **Step 2: 정식 파일이 있는 복제본 비교**

정식 파일이 있는 복제본은 다음과 같이 정확한 두 파일을 지정해 비교한다.

```bash
git diff --no-index -- src/pages/auth/TermsPage.tsx "src/pages/auth/TermsPage 2.tsx"
git diff --no-index -- src/pages/chat/ChatRoomPage.tsx "src/pages/chat/ChatRoomPage 2.tsx"
git diff --no-index -- src/test/setup.ts "src/test/setup 2.ts"
git diff --no-index -- src/types/auth.ts "src/types/auth 2.ts"
```

인증 자산도 같은 basename의 정식 파일과 ` 2` 파일을 각각 비교한다. 채팅 테스트의
유효 시나리오가 Task 1–3 정식 테스트에 반영됐는지 확인한다.
`ChatRoomPage 2.tsx`의 props 기반 mock 페이지 구조는 현재 라우터·Zustand 구조와
충돌하므로 정식 페이지로 덮어쓰지 않는다.

- [ ] **Step 3: 명시적으로 확인한 복제 파일 제거**

다음 대상만 제거한다.

```text
src/assets/images/auth/kakao-icon 2.svg
src/assets/images/auth/login-button-spacer 2.svg
src/assets/images/auth/login-hero-body 2.png
src/assets/images/auth/login-hero-eye-left 2.svg
src/assets/images/auth/login-hero-eye-right 2.svg
src/assets/images/auth/login-hero-hair 2.png
src/assets/images/auth/login-hero-hat 2.png
src/assets/images/auth/login-hero-mouth 2.svg
src/assets/images/auth/login-hero-top 2.png
src/assets/images/auth/login-logo 2.png
src/assets/images/auth/login-wordmark 2.svg
src/assets/images/chat/chat-partner-avatar 2.png
src/assets/images/chat/chat-product-1 2.png
src/assets/images/chat/chat-product-2 2.png
src/assets/images/chat/chat-product-3 2.png
src/assets/images/chat/chat-product-4 2.png
src/assets/images/chat/chat-room-product 2.png
src/mocks/mockChat 2.ts
src/pages/auth/LoginPage.test 2.tsx
src/pages/auth/TermsPage 2.tsx
src/pages/chat/ChatListPage.test 2.tsx
src/pages/chat/ChatRoomPage 2.tsx
src/pages/chat/ChatRoomPage.test 2.tsx
src/test/setup 2.ts
src/types/auth 2.ts
```

목록은 25개이므로 Step 1의 실제 개수와 이 목록이 일치하는지 다시 확인한 뒤
삭제한다. 삭제 시 glob이나 상위 디렉터리 재귀 삭제를 사용하지 않는다.

- [ ] **Step 4: 복제 파일 제거 확인**

Run: `rg --files src -g '* 2.*'`

Expected: 출력 없음.

- [ ] **Step 5: 채팅 테스트가 실제로 수집되는지 확인**

Run: `npm test -- src/components/chat/ChatCard.test.tsx src/utils/chatTime.test.ts src/pages/chat/ChatRoomPage.test.tsx`

Expected: 세 정식 테스트 파일이 수집되고 PASS.

- [ ] **Step 6: Task 5 커밋**

```bash
git add -A src
git commit -m "test: 채팅 테스트와 복제 파일 정리"
```

### Task 6: 전체 검증, push, UI PR 생성

**Files:**
- Verify: 전체 추적 파일
- No source changes expected

**Interfaces:**
- Produces: 검증된 `feat/junyoung/auth-bootstrap` 원격 브랜치와 `dev` 대상 UI PR

- [ ] **Step 1: 전체 테스트 실행**

Run: `npm test`

Expected: 모든 테스트 PASS, 실패 0개.

- [ ] **Step 2: 린트 실행**

Run: `npm run lint`

Expected: 오류 0개. 기존 경고가 남으면 PR 본문에 파일과 경고 내용을 기록한다.

- [ ] **Step 3: 프로덕션 빌드 실행**

Run: `npm run build`

Expected: TypeScript와 Vite 빌드 PASS.

- [ ] **Step 4: diff 위생 검사**

Run: `git diff --check`

Expected: 출력 없음.

Run: `git status --short`

Expected: 의도한 파일만 표시되거나 마지막 커밋 후 깨끗함.

- [ ] **Step 5: 375px·1440px 시각 검증**

Run: `npm run dev -- --host 127.0.0.1`

검증 항목:

- 375px: 스플래시가 전체 앱 너비를 사용한다.
- 1440px: 스플래시 보라색 영역이 중앙 375px이고 홈과 같은 위치다.
- 채팅 목록: 상품명, 최근 메시지, 최근 메시지 시간이 잘리지 않는다.
- 채팅방: 예외 알림이 입력기 바로 위에 표시되고 페이지 폭을 넘지 않는다.

- [ ] **Step 6: 원격 브랜치 push**

```bash
git push -u origin feat/junyoung/auth-bootstrap
```

Expected: 현재 로컬 커밋이 원격 브랜치에 업로드됨.

- [ ] **Step 7: `dev` 대상 draft PR 생성**

PR 제목:

```text
feat: 인증 부트스트랩 및 채팅 UI 안정화
```

PR 본문 필수 항목:

```markdown
## 변경 사항
- 채팅 목록 상품명 및 최근 메시지 시간 수정
- 채팅 연결 실패·탈퇴 사용자 예외 UI 추가
- 스플래시 앱 프레임 너비 수정
- 복제 파일 및 채팅 테스트 정리

## 검증
- npm test
- npm run lint
- npm run build
- 375px / 1440px 수동 확인

## 후속 작업
- 백엔드 계약 수령 후 인증·채팅 API는 별도 PR로 연결
```

- [ ] **Step 8: PR CI 확인**

모든 필수 체크가 통과하는지 확인한다. 실패하면 로그를 근거로 같은 브랜치에서
수정하고 `npm test`, `npm run lint`, `npm run build`를 다시 실행한다.
