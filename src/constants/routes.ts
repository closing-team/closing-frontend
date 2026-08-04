export const ROUTES = {
  // auth
  SPLASH: "/splash",
  LOGIN: "/login",
  TERMS: "/terms",

  // home
  HOME: "/",
// ai
  AI: "/ai",
  AI_PLAN: "/ai/plan",

  // guide
  GUIDE: "/guides",
  GUIDE_DETAIL: "/guides/:stepId",
  GUIDE_NOTICE_TEMPLATE: "/guides/2/template",
  GUIDE_REPORT_TEMPLATE: "/guides/6/template",

  // support
  SUPPORT: "/supports",
  SUPPORT_BOOKMARK: "/supports/bookmark",
  SUPPORT_DETAIL: "/supports/:supportId",

  // used
  USED: "/used",
  USED_DETAIL: "/used/:productId",
  USED_SEARCH: "/used/search",
  USED_SEARCH_RESULT: "/used/search/result",
  USED_WRITE: "/used/write",
  USED_EDIT: "/used/write/:productId",
  USED_MY: "/used/my",
  USED_LIKED: "/used/liked",

  // chat
  CHAT: "/chats",
  CHAT_ROOM: "/chats/:chatRoomId",

  // account
  PROFILE_EDIT: "/profile",
  BUSINESS_AUTH: "/business",

  // inquiry
  INQUIRY: "/inquiry",
  INQUIRY_HISTORY: "/inquiry/history",

  // policy
  POLICY: "/policy",

  // dev
  DEV: "/dev",
  DEV_EMPTY_VIEWS: "/dev/empty-views",
} as const;

export const guideDetailPath = (id: number | string) =>
  ROUTES.GUIDE_DETAIL.replace(":stepId", encodeURIComponent(id));

export const supportDetailPath = (id: number | string) =>
  ROUTES.SUPPORT_DETAIL.replace(":supportId", encodeURIComponent(id));

export const usedDetailPath = (id: number | string) =>
  ROUTES.USED_DETAIL.replace(":productId", encodeURIComponent(id));

export const usedEditPath = (id: number | string) =>
  ROUTES.USED_EDIT.replace(":productId", encodeURIComponent(id));

export const chatRoomPath = (id: number | string) =>
  ROUTES.CHAT_ROOM.replace(":chatRoomId", encodeURIComponent(id));
