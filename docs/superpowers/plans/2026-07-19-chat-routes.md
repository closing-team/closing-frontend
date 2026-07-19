# Chat Routes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing chat list and chat room available at `/chats` and `/chats/:roomId` with safe navigation for unknown room IDs.

**Architecture:** Route components in `App.tsx` own React Router parameters and navigation callbacks. `ChatListPage` and `ChatRoomPage` remain presentational, receiving route-dependent data and actions through props. `mockChat.ts` exports a focused resolver so the route layer can locate a room without duplicating data lookup rules.

**Tech Stack:** React 19, React Router 7, TypeScript, Vitest, Testing Library, Tailwind CSS v4.

## Global Constraints

- Add no API client, authentication behavior, or real-time transport.
- Reuse existing chat mock data and existing common components.
- Keep the list and room pages usable as independently testable components.
- Write and run each route behavior test before its production implementation.

---

### Task 1: Define chat route constants and mock lookup

**Files:**
- Modify: `src/constants/routes.ts`
- Modify: `src/mocks/mockChat.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Produces `ROUTES.CHATS` with value `/chats`.
- Produces `ROUTES.CHAT_ROOM` with value `/chats/:roomId`.
- Produces `chatRoomPath(roomId: string): string`.
- Produces `getMockChatRoom(roomId: string)` returning `{ room: ChatRoomDetail; messages: ChatMessage[] } | undefined`.

- [x] **Step 1: Write a failing route test that opens `/chats/chat-1`.**

```tsx
window.history.pushState({}, "", "/chats/chat-1");
render(<App />);
expect(await screen.findByRole("heading", { name: "민수아빠" })).toBeInTheDocument();
```

- [x] **Step 2: Run the test and verify it fails because no chat route exists.**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because `/chats/chat-1` does not render a chat-room heading.

- [x] **Step 3: Add constants and the lookup without changing page components.**

```ts
export const chatRoomPath = (roomId: string) =>
  ROUTES.CHAT_ROOM.replace(":roomId", encodeURIComponent(roomId));
```

- [x] **Step 4: Run the focused test and verify it is still red until the route is registered.**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because `App.tsx` has not registered `/chats/:roomId`.

### Task 2: Register list, room, and invalid-room routes

**Files:**
- Modify: `src/App.tsx`
- Create: `src/pages/chat/InvalidChatRoomPage.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes `ROUTES.CHATS`, `ROUTES.CHAT_ROOM`, `chatRoomPath`, and `getMockChatRoom`.
- Produces routed `ChatListPage`, `ChatRoomPage`, and `InvalidChatRoomPage` destinations.

- [x] **Step 1: Add failing tests for list selection and an invalid room.**

```tsx
window.history.pushState({}, "", "/chats");
render(<App />);
fireEvent.click(await screen.findByRole("button", { name: /민수아빠 채팅방/ }));
expect(await screen.findByRole("heading", { name: "민수아빠" })).toBeInTheDocument();

window.history.pushState({}, "", "/chats/unknown-room");
render(<App />);
expect(await screen.findByText("채팅방을 찾을 수 없습니다.")).toBeInTheDocument();
```

- [x] **Step 2: Run the focused test and verify both behaviors fail.**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because list selection has no router callback and unknown rooms have no route state.

- [x] **Step 3: Implement the smallest route components and invalid-room page.**

```tsx
function ChatListRoute() {
  const navigate = useNavigate();
  return <ChatListPage onBack={() => navigate(ROUTES.HOME)} onSelectRoom={(roomId) => navigate(chatRoomPath(roomId))} />;
}
```

- [x] **Step 4: Run route tests and verify all pass.**

Run: `npm run test -- src/App.test.tsx`

Expected: PASS.

### Task 3: Verify direct URL and regression behavior

**Files:**
- Test: `src/App.test.tsx`
- Modify: `docs/superpowers/specs/2026-07-19-chat-routes-design.md`
- Modify: `docs/superpowers/plans/2026-07-19-chat-routes.md`

- [x] **Step 1: Add a failing browser-history test for room back navigation.**

```tsx
window.history.pushState({}, "", "/chats");
render(<App />);
fireEvent.click(await screen.findByRole("button", { name: /민수아빠 채팅방/ }));
fireEvent.click(await screen.findByRole("button", { name: "뒤로가기" }));
expect(await screen.findByRole("heading", { name: "채팅" })).toBeInTheDocument();
```

- [x] **Step 2: Run the focused test and verify it fails before the room back callback uses history.**

Run: `npm run test -- src/App.test.tsx`

Expected: FAIL because the room back control is not wired to `navigate(-1)`.

- [x] **Step 3: Wire room back navigation and run the full test suite.**

Run: `npm run test -- --run`

Expected: PASS with all chat, login, and existing project tests.

- [x] **Step 4: Run static and production checks.**

Run: `npm run lint && npm run build && git diff --check`

Expected: no lint errors, successful build, and no whitespace errors.

- [x] **Step 5: Commit the focused feature.**

```bash
git add src/App.tsx src/App.test.tsx src/constants/routes.ts src/mocks/mockChat.ts src/pages/chat/InvalidChatRoomPage.tsx docs/superpowers/specs/2026-07-19-chat-routes-design.md docs/superpowers/plans/2026-07-19-chat-routes.md
git commit -m "[채팅] feat: 채팅 라우트 연결"
```

## Plan Self-Review

- Spec coverage: Tasks 1–3 cover direct list and room URLs, list selection, invalid IDs, back navigation, and regression verification.
- Placeholder scan: no `TBD`, `TODO`, or unspecified implementation steps are present.
- Type consistency: `chatRoomPath` is the only function that converts a room ID into a route, and `getMockChatRoom` is the only route-data resolver.
