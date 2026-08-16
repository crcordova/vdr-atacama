import { cookies } from "next/headers";
import { env } from "./env";
import crypto from "node:crypto";

export const AUTH_COOKIE_NAME = "dataroom";
export const AUTH_COOKIE_VALUE = "authenticated";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24; // 86400 = 24h

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value === AUTH_COOKIE_VALUE;
}

export function validatePassword(submitted: string): boolean {
  const expected = env.DATAROOM_PASSWORD;
  // Guard against empty or mismatched-length inputs (timingSafeEqual requires equal length)
  const expectedBuf = Buffer.from(expected, "utf-8");
  const submittedBuf = Buffer.from(submitted, "utf-8");
  if (submittedBuf.length !== expectedBuf.length) {
    // Still do a constant-time comparison against expected to avoid leaking length info
    crypto.timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }
  return crypto.timingSafeEqual(expectedBuf, submittedBuf);
}
