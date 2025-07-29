/**
 * Rate Limiting Logic Tests
 * Tests the core rate limiting functionality in isolation
 */

describe("Rate Limiting Logic", () => {
  let rateLimitStore: Map<string, { count: number; resetTime: number }>;
  let checkRateLimit: (key: string) => {
    allowed: boolean;
    count: number;
    remaining: number;
    resetTime: number;
  };

  const RATE_LIMIT_CONFIG = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5, // 5 requests per minute
  };

  beforeEach(() => {
    // Reset the rate limit store
    rateLimitStore = new Map();
    
    // Implement the rate limiting logic for testing
    checkRateLimit = (key: string) => {
      const now = Date.now();
      const entry = rateLimitStore.get(key);

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
    };
  });

  it("allows first request", () => {
    const result = checkRateLimit("test-key");
    
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(1);
    expect(result.remaining).toBe(4);
  });

  it("allows requests up to the limit", () => {
    const key = "test-key";
    
    // Make 5 requests (the limit)
    for (let i = 1; i <= 5; i++) {
      const result = checkRateLimit(key);
      expect(result.allowed).toBe(true);
      expect(result.count).toBe(i);
      expect(result.remaining).toBe(5 - i);
    }
  });

  it("blocks requests over the limit", () => {
    const key = "test-key";
    
    // Make 5 requests (up to limit)
    for (let i = 1; i <= 5; i++) {
      checkRateLimit(key);
    }
    
    // 6th request should be blocked
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.count).toBe(6);
    expect(result.remaining).toBe(0);
  });

  it("handles different keys separately", () => {
    const key1 = "user1";
    const key2 = "user2";
    
    // Each key should have independent limits
    for (let i = 1; i <= 5; i++) {
      const result1 = checkRateLimit(key1);
      const result2 = checkRateLimit(key2);
      
      expect(result1.allowed).toBe(true);
      expect(result2.allowed).toBe(true);
      expect(result1.count).toBe(i);
      expect(result2.count).toBe(i);
    }
  });

  it("resets after time window expires", () => {
    const key = "test-key";
    
    // Exhaust the limit
    for (let i = 1; i <= 6; i++) {
      checkRateLimit(key);
    }
    
    // Verify it's blocked
    let result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    
    // Simulate time passing by manipulating the store directly
    const entry = rateLimitStore.get(key)!;
    entry.resetTime = Date.now() - 1000; // Set reset time to past
    rateLimitStore.set(key, entry);
    
    // Next request should be allowed (new window)
    result = checkRateLimit(key);
    expect(result.allowed).toBe(true);
    expect(result.count).toBe(1);
    expect(result.remaining).toBe(4);
  });

  it("calculates remaining requests correctly", () => {
    const key = "test-key";
    
    // Test remaining count decreases properly
    expect(checkRateLimit(key).remaining).toBe(4); // 1st request
    expect(checkRateLimit(key).remaining).toBe(3); // 2nd request
    expect(checkRateLimit(key).remaining).toBe(2); // 3rd request
    expect(checkRateLimit(key).remaining).toBe(1); // 4th request
    expect(checkRateLimit(key).remaining).toBe(0); // 5th request (at limit)
    expect(checkRateLimit(key).remaining).toBe(0); // 6th request (over limit)
  });

  it("provides correct reset time", () => {
    const beforeTime = Date.now();
    const result = checkRateLimit("test-key");
    const afterTime = Date.now();
    
    // Reset time should be approximately now + windowMs
    expect(result.resetTime).toBeGreaterThan(beforeTime + RATE_LIMIT_CONFIG.windowMs - 100);
    expect(result.resetTime).toBeLessThan(afterTime + RATE_LIMIT_CONFIG.windowMs + 100);
  });
});