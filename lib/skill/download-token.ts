import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A signed, expiring grant to download the modules one checkout paid for.
 *
 * The success page and the receipt email both hand the buyer links carrying
 * one of these. The download route verifies the signature and the expiry and
 * never touches Stripe again, so a buyer re-downloading a week later costs no
 * API call and cannot be blocked by a Stripe outage. The durable re-download
 * path is the success page itself, which re-verifies the session with Stripe
 * and mints a fresh token, so expiry here is a nuisance bound, not a lockout.
 *
 * Format: `base64url(json).base64url(hmac-sha256)`. No JWT library: the
 * payload has three fields and the site already owns the secret.
 */
export type DownloadGrant = {
  /** Stripe Checkout Session id the grant was minted for. */
  sid: string;
  /** Module ids the buyer may download. */
  skills: string[];
  /** Expiry, seconds since epoch. */
  exp: number;
};

export const DOWNLOAD_GRANT_TTL_SECONDS = 30 * 24 * 60 * 60;

function secretOrThrow(secret?: string): string {
  const value = secret ?? process.env.SKILL_DOWNLOAD_SECRET;
  if (!value) {
    throw new Error("SKILL_DOWNLOAD_SECRET is not set");
  }
  return value;
}

function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url");
}

export function signDownloadGrant(
  grant: Omit<DownloadGrant, "exp"> & { exp?: number },
  secret?: string,
  now: number = Date.now(),
): string {
  const key = secretOrThrow(secret);
  const payload: DownloadGrant = {
    sid: grant.sid,
    skills: [...grant.skills],
    exp: grant.exp ?? Math.floor(now / 1000) + DOWNLOAD_GRANT_TTL_SECONDS,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

/**
 * Returns the grant, or null for anything that is not a valid, unexpired,
 * correctly signed token. Callers treat null as 403, never as an exception.
 */
export function verifyDownloadGrant(
  token: string,
  secret?: string,
  now: number = Date.now(),
): DownloadGrant | null {
  let key: string;
  try {
    key = secretOrThrow(secret);
  } catch {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  const [body, signature] = parts;

  const expected = Buffer.from(sign(body, key));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  let grant: unknown;
  try {
    grant = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return null;
  }
  if (!isGrant(grant)) return null;
  if (grant.exp * 1000 <= now) return null;
  return grant;
}

function isGrant(value: unknown): value is DownloadGrant {
  if (!value || typeof value !== "object") return false;
  const g = value as Record<string, unknown>;
  return (
    typeof g.sid === "string" &&
    g.sid.length > 0 &&
    Array.isArray(g.skills) &&
    g.skills.every((s) => typeof s === "string") &&
    typeof g.exp === "number" &&
    Number.isFinite(g.exp)
  );
}
