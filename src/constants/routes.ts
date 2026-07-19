export const ROUTES = {
  SPLASH: "/splash",
  LOGIN: "/login",
  TERMS: "/terms",
  CHATS: "/chats",
  CHAT_ROOM: "/chats/:roomId",
  HOME: "/",
  GUIDE: "/guide",
  GUIDE_DETAIL: "/guide/:stepId",
  SUPPORT: "/support",
  SUPPORT_DETAIL: "/support/:supportId",
  USED: "/used",
  USED_DETAIL: "/used/:productId",
  USED_WRITE: "/used/write",
} as const;

export const chatRoomPath = (roomId: string) =>
  ROUTES.CHAT_ROOM.replace(":roomId", encodeURIComponent(roomId));
