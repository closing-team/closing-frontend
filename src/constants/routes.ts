export const ROUTES = {
  // auth
  SPLASH: "/splash",
  LOGIN: "/login",
  TERMS: "/terms",

  // home
  HOME: "/",
<<<<<<< HEAD

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
  SUPPORT_DETAIL: "/supports/:supportId",

  // used
=======
  GUIDE: "/guide",
  GUIDE_DETAIL: "/guide/:stepId",
  SUPPORT: "/support",
  SUPPORT_BOOKMARK: "/support/bookmark",
  SUPPORT_DETAIL: "/support/:supportId",
>>>>>>> dc74a7b ([지원정보] feat: 북마크 목록 진입용 라우트(SUP002) 연결)
  USED: "/used",
  USED_DETAIL: "/used/:productId",
  USED_SEARCH: "/used/search",
  USED_SEARCH_RESULT: "/used/search/result",
  USED_WRITE: "/used/write",
  USED_MY: "/used/my",
  USED_LIKED: "/used/liked",

  // chat
  CHAT: "/chats",
  CHAT_ROOM: "/chats/:productId",

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
} as const;

export const guideDetailPath = (id: number | string) =>
  ROUTES.GUIDE_DETAIL.replace(":stepId", encodeURIComponent(id));

export const supportDetailPath = (id: number | string) =>
  ROUTES.SUPPORT_DETAIL.replace(":supportId", encodeURIComponent(id));

export const usedDetailPath = (id: number | string) =>
  ROUTES.USED_DETAIL.replace(":productId", encodeURIComponent(id));

export const chatRoomPath = (id: number | string) =>
  ROUTES.CHAT_ROOM.replace(":productId", encodeURIComponent(id));
