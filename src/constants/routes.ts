export const ROUTES = {
  SPLASH: "/splash",
  LOGIN: "/login",
  TERMS: "/terms",
  CHATS: "/chats",
  CHAT_ROOM: "/chats/:roomId",
  HOME: "/",
  GUIDE: "/guide",
  GUIDE_DETAIL: "/guide/:stepId",
  GUIDE_NOTICE_TEMPLATE: "/guide/2/template",
  GUIDE_STEP6_TEMPLATE: "/guide/6/template",
  SUPPORT: "/support",
  SUPPORT_DETAIL: "/support/:supportId",
  USED: "/used",
  USED_SEARCH: "/used/search",
  USED_SEARCH_RESULT: "/used/search/result",
  USED_BUSINESS_AUTH: "/used/business-auth",
  USED_WRITE: "/used/write",
  USED_DETAIL: "/used/:productId",
  USED_CHAT: "/used/chat/:productId",
  LLM: "/ai",
  LLM_CHAT: "/ai/chat",
} as const;

export const chatRoomPath = (roomId: string) =>
  ROUTES.CHAT_ROOM.replace(":roomId", encodeURIComponent(roomId));