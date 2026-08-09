export type LoginResult =
  | { status: "existing" }
  | { status: "new" };

export type KakaoCodeLoginHandler = (
  code: string,
  signal: AbortSignal,
) => Promise<LoginResult>;
