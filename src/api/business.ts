import { api } from "./axios";
import type { ApiEnvelope } from "../types/productApi";
import type {
  VerifyBusinessRequestJson,
  VerifyBusinessResponseData,
} from "../types/businessApi";

export async function verifyBusiness(
  request: VerifyBusinessRequestJson,
): Promise<VerifyBusinessResponseData> {
  const res = await api.put<ApiEnvelope<VerifyBusinessResponseData>>(
    "/api/v1/businesses",
    request,
  );
  return res.data.data;
}
