export interface BusinessVerificationRecord {
  registrationId: number;
  userId: number;
  businessNumber: string;
  ownerName: string;
  openDate: string;
  verifiedAt: string;
}

let businessVerifications: BusinessVerificationRecord[] = [];
let nextRegistrationId = 1;

export function findBusinessVerification(
  userId: number,
): BusinessVerificationRecord | undefined {
  return businessVerifications.find((v) => v.userId === userId);
}

export function upsertBusinessVerification(
  userId: number,
  data: { businessNumber: string; ownerName: string; openDate: string },
): BusinessVerificationRecord {
  const existing = findBusinessVerification(userId);
  const verifiedAt = new Date().toISOString();
  if (existing) {
    Object.assign(existing, { ...data, verifiedAt });
    return existing;
  }
  const created: BusinessVerificationRecord = {
    registrationId: nextRegistrationId++,
    userId,
    ...data,
    verifiedAt,
  };
  businessVerifications = [...businessVerifications, created];
  return created;
}
