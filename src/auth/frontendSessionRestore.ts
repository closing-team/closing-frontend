import type { RestoreSession } from "./sessionBootstrap";
import { readAuthSession } from "./authSession";

export const frontendSessionRestore: RestoreSession = async (signal) => {
  signal.throwIfAborted();
  return readAuthSession() ? "authenticated" : "unauthenticated";
};
