/**
 * Distributed Rate Limiting System
 *
 * Enterprise-grade rate limiting with:
 * - Redis/Upstash for distributed state
 * - Sliding window algorithm
 * - Per-IP and per-API-key limits
 * - Automatic cleanup and monitoring
 * - Circuit breaker patterns
 */

import { RateLimitConfig, RateLimitResult } from "../database/types";

// Optional Redis import - gracefully fallback if not available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let Redis: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  Redis = require("@upstash/redis").Redis;
} catch {
  // Redis not available, will use in-memory fallback
}

interface RateLimitWindow {
  count: number;
  windowStart: number;
  requests: number[];
}

export class DistributedRateLimiter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private redis: any | null = null;
  private fallbackStore = new Map<string, RateLimitWindow>();
  private isRedisAvailable = false;
  private lastRedisCheck = 0;
  private readonly checkInterval = 30000; // 30 seconds

  constructor() {
    this.initializeRedis();
  }

  private async initializeRedis(): Promise<void> {
    try {
      if (
        process.env.UPSTASH_REDIS_REST_URL &&
        process.env.UPSTASH_REDIS_REST_TOKEN
      ) {
        this.redis = new Redis({
          url: process.env.UPSTASH_REDIS_REST_URL,
          token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });

        // Test Redis connection
        await this.redis.ping();
        this.isRedisAvailable = true;
        this.lastRedisCheck = Date.now();

        console.log("Distributed rate limiter initialized with Redis");
      } else {
        console.warn(
          "Redis not configured, using in-memory fallback for rate limiting",
        );
      }
    } catch (error) {
      console.error("Failed to initialize Redis for rate limiting:", error);
      this.isRedisAvailable = false;
    }
  }

  private async checkRedisHealth(): Promise<void> {
    const now = Date.now();
    if (now - this.lastRedisCheck < this.checkInterval) return;

    try {
      if (this.redis) {
        await this.redis.ping();
        this.isRedisAvailable = true;
      }
    } catch (error) {
      console.error("Redis health check failed:", error);
      this.isRedisAvailable = false;
    }

    this.lastRedisCheck = now;
  }

  async checkLimit(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    await this.checkRedisHealth();

    if (this.isRedisAvailable && this.redis) {
      return this.checkLimitRedis(identifier, config);
    } else {
      return this.checkLimitMemory(identifier, config);
    }
  }

  private async checkLimitRedis(
    identifier: string,
    config: RateLimitConfig,
  ): Promise<RateLimitResult> {
    if (!this.redis) throw new Error("Redis not available");

    const now = Date.now();
    const windowStart = now - config.windowMs;
    const key = `rate_limit:${identifier}`;

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline();

      // Remove expired entries
      pipeline.zremrangebyscore(key, "-inf", windowStart);

      // Count current requests in window
      pipeline.zcard(key);

      // Add current request
      pipeline.zadd(key, { score: now, member: `${now}-${Math.random()}` });

      // Set expiration
      pipeline.expire(key, Math.ceil(config.windowMs / 1000));

      const results = await pipeline.exec();

      if (
        !results ||
        results.some((result: { error?: unknown }) => result.error)
      ) {
        throw new Error("Pipeline execution failed");
      }

      const count = (results[1].result as number) + 1; // +1 for the request we just added
      const remaining = Math.max(0, config.maxRequests - count);
      const resetTime = now + config.windowMs;

      return {
        allowed: count <= config.maxRequests,
        count,
        remaining,
        resetTime,
        retryAfter:
          count > config.maxRequests
            ? Math.ceil(config.windowMs / 1000)
            : undefined,
      };
    } catch (error) {
      console.error(
        "Redis rate limit check failed, falling back to memory:",
        error,
      );
      this.isRedisAvailable = false;
      return this.checkLimitMemory(identifier, config);
    }
  }

  private checkLimitMemory(
    identifier: string,
    config: RateLimitConfig,
  ): RateLimitResult {
    const now = Date.now();
    const windowStart = now - config.windowMs;

    let window = this.fallbackStore.get(identifier);

    if (!window || window.windowStart < windowStart) {
      // Create new window or reset expired window
      window = {
        count: 0,
        windowStart: now,
        requests: [],
      };
    }

    // Clean up old requests
    window.requests = window.requests.filter(
      (timestamp) => timestamp > windowStart,
    );

    // Add current request
    window.requests.push(now);
    window.count = window.requests.length;

    this.fallbackStore.set(identifier, window);

    // Cleanup expired entries periodically
    this.cleanupMemoryStore();

    const remaining = Math.max(0, config.maxRequests - window.count);
    const resetTime = now + config.windowMs;

    return {
      allowed: window.count <= config.maxRequests,
      count: window.count,
      remaining,
      resetTime,
      retryAfter:
        window.count > config.maxRequests
          ? Math.ceil(config.windowMs / 1000)
          : undefined,
    };
  }

  private cleanupMemoryStore(): void {
    // Randomly cleanup expired entries (1% chance)
    if (Math.random() < 0.01) {
      const now = Date.now();
      const maxAge = 5 * 60 * 1000; // 5 minutes

      for (const [key, window] of this.fallbackStore.entries()) {
        if (now - window.windowStart > maxAge) {
          this.fallbackStore.delete(key);
        }
      }
    }
  }

  async getStats(): Promise<{
    redisAvailable: boolean;
    memoryStoreSize: number;
    lastRedisCheck: number;
  }> {
    return {
      redisAvailable: this.isRedisAvailable,
      memoryStoreSize: this.fallbackStore.size,
      lastRedisCheck: this.lastRedisCheck,
    };
  }

  async reset(identifier: string): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        await this.redis.del(`rate_limit:${identifier}`);
      }
      this.fallbackStore.delete(identifier);
    } catch (error) {
      console.error("Failed to reset rate limit:", error);
    }
  }

  async resetAll(): Promise<void> {
    try {
      if (this.isRedisAvailable && this.redis) {
        // Delete all rate limit keys
        const keys = await this.redis.keys("rate_limit:*");
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
      }
      this.fallbackStore.clear();
    } catch (error) {
      console.error("Failed to reset all rate limits:", error);
    }
  }
}

// Singleton instance
export const distributedRateLimiter = new DistributedRateLimiter();

// Rate limiting configurations
export const RATE_LIMIT_CONFIGS = {
  newsletter: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100,
  },
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
  },
  health: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
} as const;

// Helper function for Next.js middleware
export function generateRateLimitKey(
  request: { headers: { get: (key: string) => string | null }; ip?: string },
  type: "ip" | "api_key" = "ip",
  prefix: string = "",
): string {
  let identifier: string;

  if (type === "api_key") {
    const apiKey =
      request.headers.get("x-api-key") ||
      request.headers.get("authorization")?.replace("Bearer ", "");
    identifier = apiKey || "anonymous";
  } else {
    // Use IP address
    identifier =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") ||
      "unknown";
  }

  return `${prefix}${type}:${identifier}`;
}
