import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Stateless, signed unsubscribe tokens. The token is an HMAC of the normalized
 * email, so links can be verified without a database lookup and cannot be
 * forged to unsubscribe someone else.
 */

function secret(): string {
  const value = process.env.UNSUBSCRIBE_SECRET;
  if (!value) {
    throw new Error("Missing required environment variable: UNSUBSCRIBE_SECRET");
  }
  return value;
}

function baseUrl(): string {
  const value = process.env.APP_BASE_URL;
  if (!value) {
    throw new Error("Missing required environment variable: APP_BASE_URL");
  }
  return value.replace(/\/+$/, "");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function signEmail(email: string): string {
  return createHmac("sha256", secret())
    .update(normalizeEmail(email))
    .digest("base64url");
}

export function verifyToken(email: string, token: string): boolean {
  if (!email || !token) return false;
  const expected = Buffer.from(signEmail(email));
  const provided = Buffer.from(token);
  // timingSafeEqual throws on length mismatch, so guard first.
  return (
    expected.length === provided.length && timingSafeEqual(expected, provided)
  );
}

function withToken(path: string, email: string): string {
  const params = new URLSearchParams({
    e: normalizeEmail(email),
    t: signEmail(email),
  });
  return `${baseUrl()}${path}?${params.toString()}`;
}

/** Human-facing unsubscribe page (link in the email body). */
export function buildUnsubscribeUrl(email: string): string {
  return withToken("/unsubscribe", email);
}

/** One-click endpoint for the List-Unsubscribe-Post header (RFC 8058). */
export function buildOneClickUrl(email: string): string {
  return withToken("/api/unsubscribe", email);
}
