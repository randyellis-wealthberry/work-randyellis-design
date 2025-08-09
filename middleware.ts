import { NextRequest, NextResponse } from "next/server";

/**
 * Rate Limiting Middleware
 *
 * Protects the newsletter subscription endpoint from abuse by limiting requests to:
 * - 5 requests per minute per IP address
 * - Returns 429 status with Retry-After header when limit exceeded
 * - Adds rate limit headers to all responses
 *
 * Currently uses in-memory storage. For production scale or multiple server instances,
 * consider upgrading to Redis/Upstash for distributed rate limiting.
 */

// In-memory rate limiting store
// In production, you'd want to use Redis or a distributed cache
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 5, // 5 requests per minute
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
};

function getRateLimitKey(request: NextRequest): string {
  // Use IP address as the key, with fallback to forwarded headers
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") || // Cloudflare
    "unknown";

  return `ratelimit:${ip}:${request.nextUrl.pathname}`;
}

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

function checkRateLimit(key: string): {
  allowed: boolean;
  count: number;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    // 1% chance to cleanup
    cleanupExpiredEntries();
  }

  if (!entry || now > entry.resetTime) {
    // First request or window expired
    const resetTime = now + RATE_LIMIT_CONFIG.windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      count: 1,
      remaining: RATE_LIMIT_CONFIG.maxRequests - 1,
      resetTime,
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(key, entry);

  return {
    allowed: entry.count <= RATE_LIMIT_CONFIG.maxRequests,
    count: entry.count,
    remaining: Math.max(0, RATE_LIMIT_CONFIG.maxRequests - entry.count),
    resetTime: entry.resetTime,
  };
}

export function middleware(request: NextRequest) {
  // Only apply rate limiting to newsletter subscription endpoint
  if (
    request.nextUrl.pathname === "/api/newsletter/subscribe" &&
    request.method === "POST"
  ) {
    const key = getRateLimitKey(request);
    const { allowed, count, remaining, resetTime } = checkRateLimit(key);

    if (!allowed) {
      // Rate limit exceeded
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Please wait a moment before trying again.",
          retryAfter: Math.ceil((resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "X-RateLimit-Limit": RATE_LIMIT_CONFIG.maxRequests.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": Math.ceil(resetTime / 1000).toString(),
            "Retry-After": Math.ceil(
              (resetTime - Date.now()) / 1000,
            ).toString(),
          },
        },
      );
    }

    // Add rate limit headers to successful responses
    const response = NextResponse.next();
    response.headers.set(
      "X-RateLimit-Limit",
      RATE_LIMIT_CONFIG.maxRequests.toString(),
    );
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    response.headers.set(
      "X-RateLimit-Reset",
      Math.ceil(resetTime / 1000).toString(),
    );

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply to API routes
    "/api/:path*",
  ],
};
