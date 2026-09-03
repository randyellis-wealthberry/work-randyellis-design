/**
 * Every page that sets its own canonical must keep the RSS alternate the
 * root layout advertises. Next.js replaces a page's `alternates` object
 * rather than merging it, and seven pages had quietly lost the feed link.
 */
import { metadata as about } from "@/app/about/page";
import { metadata as services } from "@/app/services/page";
import { metadata as metis } from "@/app/metis/page";
import { metadata as skills } from "@/app/skills/page";
import { metadata as privacy } from "@/app/privacy-policy/page";
import { metadata as terms } from "@/app/terms-of-service/page";
import { metadata as hire } from "@/app/hire-ai-randy/page";
import { metadata as projects } from "@/app/projects/page";
import { metadata as blog } from "@/app/blog/page";
import { canonicalAlternates } from "@/lib/metadata";

const PAGES = {
  "/about": about,
  "/services": services,
  "/metis": metis,
  "/skills": skills,
  "/privacy-policy": privacy,
  "/terms-of-service": terms,
  "/hire-ai-randy": hire,
  "/projects": projects,
  "/blog": blog,
};

describe("page metadata alternates", () => {
  it("canonicalAlternates carries the canonical and the RSS feed", () => {
    const alternates = canonicalAlternates("/x");
    expect(alternates.canonical).toBe("/x");
    expect(alternates.types).toHaveProperty("application/rss+xml");
  });

  Object.entries(PAGES).forEach(([path, meta]) => {
    it(`${path} keeps the RSS alternate and canonical`, () => {
      const canonical = String(meta.alternates?.canonical ?? "");
      expect(canonical.endsWith(path)).toBe(true);
      expect(meta.alternates?.types).toHaveProperty("application/rss+xml");
    });

    it(`${path} keeps its title and description within SERP limits`, () => {
      const title =
        typeof meta.title === "string"
          ? meta.title
          : ((meta.title as { absolute?: string; default?: string })
              ?.absolute ??
            (meta.title as { default?: string })?.default ??
            "");
      // The layout template appends " | Randy Ellis" (14 chars).
      expect(title.length + 14).toBeLessThanOrEqual(75);
      expect(String(meta.description ?? "").length).toBeLessThanOrEqual(175);
      expect(String(meta.description ?? "").length).toBeGreaterThan(50);
    });
  });
});
