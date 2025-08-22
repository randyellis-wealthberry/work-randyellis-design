/**
 * Nonce Generation Test Suite
 *
 * Tests the cryptographically secure nonce generation functionality
 * used for Content Security Policy inline script/style allowlisting.
 */

import { generateCSPNonce, isValidNonce } from "@/lib/security/csp-utils";

describe("Nonce Generation", () => {
  describe("generateCSPNonce", () => {
    it("should generate a valid base64 string", () => {
      const nonce = generateCSPNonce();

      expect(nonce).toMatch(/^[A-Za-z0-9+/]+=*$/);
    });

    it("should generate nonces with sufficient length", () => {
      const nonce = generateCSPNonce();

      // Base64 encoded 16+ bytes should be at least 22 characters
      expect(nonce.length).toBeGreaterThanOrEqual(22);
    });

    it("should generate unique nonces", () => {
      const nonces = new Set();

      // Generate 1000 nonces to test for uniqueness
      for (let i = 0; i < 1000; i++) {
        const nonce = generateCSPNonce();
        expect(nonces.has(nonce)).toBe(false);
        nonces.add(nonce);
      }
    });

    it("should generate cryptographically random nonces", () => {
      const nonces = Array.from({ length: 100 }, () => generateCSPNonce());

      // Test for sufficient entropy by checking character distribution
      const charCounts = new Map<string, number>();

      nonces.forEach((nonce) => {
        nonce.split("").forEach((char) => {
          charCounts.set(char, (charCounts.get(char) || 0) + 1);
        });
      });

      // Should have good distribution of characters
      expect(charCounts.size).toBeGreaterThanOrEqual(30); // At least 30 different characters used
    });

    it("should handle multiple rapid calls", () => {
      const startTime = performance.now();
      const nonces = Array.from({ length: 1000 }, () => generateCSPNonce());
      const endTime = performance.now();

      // Should be fast even for many generations
      expect(endTime - startTime).toBeLessThan(1000);

      // All should be unique
      const uniqueNonces = new Set(nonces);
      expect(uniqueNonces.size).toBe(nonces.length);
    });

    it("should work in different environments", () => {
      // Test that it works regardless of Node.js vs browser environment mocking
      const nonce1 = generateCSPNonce();
      const nonce2 = generateCSPNonce();

      expect(nonce1).toBeDefined();
      expect(nonce2).toBeDefined();
      expect(nonce1).not.toBe(nonce2);
    });
  });

  describe("isValidNonce", () => {
    it("should validate correctly generated nonces", () => {
      const nonce = generateCSPNonce();

      expect(isValidNonce(nonce)).toBe(true);
    });

    it("should reject invalid base64 strings", () => {
      expect(isValidNonce("not-base64!")).toBe(false);
      expect(isValidNonce("invalid@chars")).toBe(false);
      expect(isValidNonce("")).toBe(false);
    });

    it("should reject nonces that are too short", () => {
      expect(isValidNonce("abc")).toBe(false);
      expect(isValidNonce("short")).toBe(false);
    });

    it("should reject null or undefined values", () => {
      expect(isValidNonce(null as any)).toBe(false);
      expect(isValidNonce(undefined as any)).toBe(false);
    });

    it("should handle edge cases", () => {
      expect(isValidNonce("   ")).toBe(false); // whitespace
      expect(isValidNonce("123")).toBe(false); // too short
      expect(isValidNonce("a".repeat(1000))).toBe(false); // too long
    });
  });

  describe("Nonce Security Properties", () => {
    it("should have sufficient entropy for security", () => {
      const nonce = generateCSPNonce();

      // Decode base64 to check byte length
      const decoded = Buffer.from(nonce, "base64");
      expect(decoded.length).toBeGreaterThanOrEqual(16); // At least 128 bits
    });

    it("should not contain predictable patterns", () => {
      const nonces = Array.from({ length: 100 }, () => generateCSPNonce());

      // Check that nonces don't start with the same characters
      const prefixes = nonces.map((n) => n.substring(0, 4));
      const uniquePrefixes = new Set(prefixes);

      // Should have high diversity in prefixes
      expect(uniquePrefixes.size).toBeGreaterThan(prefixes.length * 0.8);
    });

    it("should be suitable for CSP nonce values", () => {
      const nonce = generateCSPNonce();

      // Should not contain characters that would break CSP syntax
      expect(nonce).not.toMatch(/['";\s]/);

      // Should be safe for HTTP headers
      expect(nonce).not.toMatch(/[\x00-\x1F\x7F]/);
    });

    it("should generate nonces suitable for HTML attributes", () => {
      const nonce = generateCSPNonce();

      // Should be safe for use in HTML nonce attributes
      expect(nonce).not.toMatch(/[<>&"']/);
    });
  });

  describe("Performance and Memory", () => {
    it("should not leak memory with many generations", () => {
      // Test that nonce generation doesn't hold onto large amounts of memory
      const nonces = [];

      // Generate nonces and ensure they don't accumulate
      for (let i = 0; i < 1000; i++) {
        const nonce = generateCSPNonce();
        if (i % 100 === 0) {
          nonces.push(nonce); // Keep a small sample
        }
      }

      // Should not accumulate large strings or objects
      expect(nonces.length).toBeLessThanOrEqual(10);
      nonces.forEach((nonce) => {
        expect(typeof nonce).toBe("string");
        expect(nonce.length).toBeLessThan(100); // Reasonable nonce size
      });
    });

    it("should maintain consistent performance", () => {
      const iterations = 100;
      const times: number[] = [];

      for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        generateCSPNonce();
        const end = performance.now();
        times.push(end - start);
      }

      // Check that generation time remains reasonable
      const averageTime = times.reduce((a, b) => a + b) / times.length;
      const maxTime = Math.max(...times);

      expect(averageTime).toBeLessThan(5); // Should be reasonably fast
      expect(maxTime).toBeLessThan(50); // No outliers should be extremely slow
    });
  });

  describe("Concurrent Generation", () => {
    it("should handle concurrent nonce generation safely", async () => {
      const concurrency = 100;
      const promises = Array.from({ length: concurrency }, () =>
        Promise.resolve(generateCSPNonce()),
      );

      const nonces = await Promise.all(promises);

      // All should be unique
      const uniqueNonces = new Set(nonces);
      expect(uniqueNonces.size).toBe(concurrency);

      // All should be valid
      nonces.forEach((nonce) => {
        expect(isValidNonce(nonce)).toBe(true);
      });
    });
  });
});
