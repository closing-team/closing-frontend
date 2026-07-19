export type LoginResult =
  | { status: "existing" }
  | { status: "new" };

export type KakaoLoginHandler = () => Promise<LoginResult>;
