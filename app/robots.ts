import type { MetadataRoute } from "next";
import { WEBSITE_URL } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // CRITICAL: Never re-add /_next/ to disallow — Googlebot needs /_next/static
      // JS/CSS to render client-side content (T-02). Next.js never recommends blocking it.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/", "/drafts/"],
      },
      // D-21: Open to AI crawlers for AEO/GEO visibility. Trade-off accepted: increased
      // training/response inclusion vs. potential scraping. AI crawlers matching a specific
      // User-agent group ignore *, so the 4 disallows must be repeated to keep /admin/ and
      // /api/ protected for AI crawlers too (T-10-05).
      {
        userAgent: [
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
        ],
        allow: "/",
        disallow: ["/private/", "/admin/", "/api/", "/drafts/"],
      },
    ],
    sitemap: `${WEBSITE_URL}/sitemap.xml`,
    host: WEBSITE_URL,
  };
}
