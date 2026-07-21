export const ROUTES = {
  HOME: "/",
  SPLASH: "/splash",
  LOGIN: "/login",
  TERMS: "/terms",
  LLM: "/ai",
  LLM_PLAN: "/ai/plan",
  GUIDE: "/guide",
  GUIDE_DETAIL: "/guide/:stepId",
  GUIDE_NOTICE_TEMPLATE: "/guide/2/template",
  GUIDE_STEP6_TEMPLATE: "/guide/6/template",
  SUPPORT: "/support",
  SUPPORT_DETAIL: "/support/:supportId",
  BUSINESS_AUTH: "/business-auth",
  USED: "/used",
  USED_DETAIL: "/used/:productId",
  USED_SEARCH: "/used/search",
  USED_SEARCH_RESULT: "/used/search/result",
  USED_WRITE: "/used/write",
  USED_MY_PRODUCTS: "/used/my-products",
  USED_LIKED: "/used/liked",
  CHAT: "/chat",
  CHAT_DETAIL: "/chat/:productId",
} as const;

export const supportDetailPath = (id: number | string) =>
  ROUTES.SUPPORT_DETAIL.replace(":supportId", encodeURIComponent(id));
