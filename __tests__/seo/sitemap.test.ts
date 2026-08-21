import sitemap from "@/app/sitemap";
import { PROJECTS } from "@/lib/data/projects";
import { getBlogArticles } from "@/lib/utils/blog-data";
import { WEBSITE_URL } from "@/lib/constants";

describe("Sitemap", () => {
  let sitemapEntries: Awaited<ReturnType<typeof sitemap>>;

  beforeAll(() => {
    sitemapEntries = sitemap();
  });

  it("every entry has a valid lastModified Date", () => {
    sitemapEntries.forEach((entry) => {
      expect(entry.lastModified).toBeDefined();
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(Number.isNaN(entry.lastModified!.getTime())).toBe(false);
    });
  });

  it("static URLs include exactly the 7 required pages", () => {
    const urls = sitemapEntries.map((entry) => entry.url);
    const requiredStaticUrls = [
      `${WEBSITE_URL}/`,
      `${WEBSITE_URL}/projects`,
      `${WEBSITE_URL}/about`,
      `${WEBSITE_URL}/blog`,
      `${WEBSITE_URL}/metis`,
      `${WEBSITE_URL}/privacy-policy`,
      `${WEBSITE_URL}/terms-of-service`,
    ];

    requiredStaticUrls.forEach((requiredUrl) => {
      expect(urls).toContain(requiredUrl);
    });
  });

  it("every PROJECTS entry exists with correct priority and changeFrequency", () => {
    PROJECTS.forEach((project) => {
      const projectUrl = `${WEBSITE_URL}/projects/${project.slug}`;
      const entry = sitemapEntries.find((e) => e.url === projectUrl);

      expect(entry).toBeDefined();
      expect(entry?.priority).toBe(project.featured ? 0.8 : 0.6);
      expect(entry?.changeFrequency).toBe("monthly");
    });
  });

  it("every blog article exists with lastModified matching publishedDate", () => {
    const blogArticles = getBlogArticles();

    blogArticles.forEach((post) => {
      const blogUrl = `${WEBSITE_URL}/blog/${post.slug}`;
      const entry = sitemapEntries.find((e) => e.url === blogUrl);

      expect(entry).toBeDefined();
      expect(entry?.lastModified).toBeDefined();
      expect(entry!.lastModified!.getTime()).toBe(
        new Date(post.publishedDate).getTime(),
      );
    });
  });

  it("all URLs are absolute under WEBSITE_URL with no duplicates", () => {
    const urls = sitemapEntries.map((entry) => entry.url);

    // All URLs start with WEBSITE_URL
    urls.forEach((url) => {
      expect(url.startsWith(WEBSITE_URL)).toBe(true);
    });

    // No localhost URLs
    urls.forEach((url) => {
      expect(url).not.toContain("localhost");
    });

    // No duplicates
    const uniqueUrls = new Set(urls);
    expect(uniqueUrls.size).toBe(urls.length);
  });

  it("static and project entries share one build-time instant within 24h", () => {
    const staticUrls = [
      `${WEBSITE_URL}/`,
      `${WEBSITE_URL}/projects`,
      `${WEBSITE_URL}/about`,
      `${WEBSITE_URL}/blog`,
      `${WEBSITE_URL}/metis`,
      `${WEBSITE_URL}/privacy-policy`,
      `${WEBSITE_URL}/terms-of-service`,
    ];

    const projectUrls = PROJECTS.map((p) => `${WEBSITE_URL}/projects/${p.slug}`);

    const staticAndProjectEntries = sitemapEntries.filter((entry) =>
      [...staticUrls, ...projectUrls].includes(entry.url),
    );

    // Extract all lastModified timestamps
    const timestamps = staticAndProjectEntries.map(
      (entry) => entry.lastModified!.getTime(),
    );

    // All timestamps should be identical (same build-time instant)
    const uniqueTimestamps = new Set(timestamps);
    expect(uniqueTimestamps.size).toBe(1);

    // The build time should be within 24h of now
    const buildTime = timestamps[0];
    const now = Date.now();
    const twentyFourHoursMs = 24 * 60 * 60 * 1000;
    expect(Math.abs(now - buildTime)).toBeLessThan(twentyFourHoursMs);
  });
});
