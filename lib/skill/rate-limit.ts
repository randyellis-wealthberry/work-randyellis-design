/**
 * A per-process, per-key counter with a sliding window. Enough to stop a
 * script from minting Checkout Sessions in a loop; not a distributed limiter,
 * and not pretending to be one. Fluid Compute reuses instances, so it holds
 * across many requests in practice, and the worst case under a cold start is
 * one extra allowed burst.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  max: number,
  windowMs: number,
  now: number = Date.now(),
): { ok: boolean; retryAfterSeconds: number } {
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }
  bucket.count += 1;
  if (bucket.count > max) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSeconds: 0 };
}

export function clientKey(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Test seam. */
export function resetRateLimits(): void {
  buckets.clear();
}
