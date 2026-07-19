# Chat Routes Design

## Goal

Connect the completed chat list and chat room screens to stable browser routes so users can open a conversation from the list or directly from its URL.

## Scope

- Add the chat-list route `/chats`.
- Add the chat-room route `/chats/:roomId`.
- Make selecting a room in the list navigate to its route.
- Resolve a known mock `roomId` to its matching room detail and messages.
- Show a clear invalid-room screen with a button that returns to `/chats`.
- Preserve browser back navigation through React Router.

## Out of Scope

- Backend/API calls, WebSocket/SSE, authentication, unread-count updates, and real message persistence.
- Side-menu and used-product-detail entry-point integrations. They are separate tasks.

## Design Decisions

### Route contract

`ROUTES.CHATS` is `/chats`. `ROUTES.CHAT_ROOM` is `/chats/:roomId`. A small `chatRoomPath(roomId)` helper replaces `:roomId` safely so callers do not assemble URLs themselves.

### Data resolution

The route layer reads the existing `MOCK_CHAT_ROOMS`, `MOCK_CHAT_ROOM_DETAIL`, and `MOCK_CHAT_MESSAGES` data. A known room ID receives a `ChatRoomDetail` derived from its list summary and only that room's messages. This keeps the screen components API-ready: they still receive their data through props rather than reading routing state directly.

### Navigation behavior

`ChatListPage` receives an `onSelectRoom` callback from the route layer. Its back button navigates to the existing home route. `ChatRoomPage` receives an `onBack` callback that uses browser history (`navigate(-1)`), so a user who entered from the list returns there naturally.

### Invalid route behavior

When `roomId` is absent from the mock room list, the application renders a Korean message explaining that the conversation cannot be found and a button labelled `채팅 목록으로` that navigates to `/chats`. No fallback room data is shown.

## Acceptance Criteria

1. Opening `/chats` renders the chat-list heading and its mock rooms.
2. Selecting a chat-list row changes the URL to `/chats/<roomId>` and renders that room.
3. Opening `/chats/chat-1` directly renders a chat room.
4. The chat-room back control returns to the previous route when the user arrived from `/chats`.
5. Opening an unknown path such as `/chats/unknown-room` shows the invalid-room message and the `채팅 목록으로` control.
6. Existing chat-page unit tests continue to pass, and route coverage is added in `src/App.test.tsx`.

## Constraints

- Reuse existing shared components and mock assets.
- Do not add a network dependency or change public API behavior.
- Keep route-specific logic out of `ChatListPage` and `ChatRoomPage` where props already provide a boundary.

