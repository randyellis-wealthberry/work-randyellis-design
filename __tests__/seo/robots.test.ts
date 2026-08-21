import robots from "@/app/robots";
import { WEBSITE_URL } from "@/lib/constants";

describe("robots.ts policy", () => {
  let result: ReturnType<typeof robots>;

  beforeEach(() => {
    result = robots();
  });

  it("should not disallow /_next/ for any user-agent", () => {
    // T-02: Googlebot needs /_next/static JS/CSS to render
    const hasNextBlock = result.rules.some((rule) => {
      const disallows = Array.isArray(rule.disallow)
        ? rule.disallow
        : [rule.disallow];
      return disallows.some((path) => path && path.includes("/_next/"));
    });
    expect(hasNextBlock).toBe(false);
  });

  it("should not fully block any crawler (no disallow: / rules)", () => {
    // D-21: open to AI crawlers for AEO/GEO visibility
    const hasFullBlock = result.rules.some((rule) => {
      const disallows = Array.isArray(rule.disallow)
        ? rule.disallow
        : [rule.disallow];
      return (
        disallows.length === 1 &&
        (disallows[0] === "/" || disallows[0] === "")
      );
    });
    expect(hasFullBlock).toBe(false);
  });

  it("should have * rule with allow: / and exactly 4 disallows", () => {
    // D-06: keep /admin/ blocked
    const wildcardRule = result.rules.find((rule) => rule.userAgent === "*");
    expect(wildcardRule).toBeDefined();
    expect(wildcardRule?.allow).toBe("/");
    expect(wildcardRule?.disallow).toEqual([
      "/private/",
      "/admin/",
      "/api/",
      "/drafts/",
    ]);
  });

  it("should have AI crawler group with all named crawlers and same 4 disallows", () => {
    // T-07: consistent AI-crawler policy
    const expectedCrawlers = [
      "GPTBot",
      "ChatGPT-User",
      "OAI-SearchBot",
      "ClaudeBot",
      "Claude-Web",
      "Claude-SearchBot",
      "Claude-User",
      "anthropic-ai",
      "CCBot",
      "PerplexityBot",
      "Perplexity-User",
      "Google-Extended",
      "Applebot-Extended",
      "Bytespider",
      "meta-externalagent",
    ];

    const aiRule = result.rules.find(
      (rule) =>
        Array.isArray(rule.userAgent) &&
        rule.userAgent.includes("GPTBot") &&
        rule.userAgent.includes("ClaudeBot"),
    );

    expect(aiRule).toBeDefined();
    expect(Array.isArray(aiRule?.userAgent)).toBe(true);

    const userAgents = aiRule?.userAgent as string[];
    expectedCrawlers.forEach((crawler) => {
      expect(userAgents).toContain(crawler);
    });

    expect(aiRule?.allow).toBe("/");
    expect(aiRule?.disallow).toEqual([
      "/private/",
      "/admin/",
      "/api/",
      "/drafts/",
    ]);
  });

  it("should include sitemap and host fields", () => {
    expect(result.sitemap).toBe(`${WEBSITE_URL}/sitemap.xml`);
    expect(result.host).toBe(WEBSITE_URL);
  });
});
