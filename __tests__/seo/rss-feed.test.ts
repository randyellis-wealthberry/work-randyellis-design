/**
 * Phase 13 (T-06): /rss.xml is a valid RSS 2.0 feed with one item per blog
 * article, dates in RFC-822, XML entities escaped.
 */
import { GET } from "@/app/rss.xml/route";
import { getBlogArticles } from "@/lib/utils/blog-data";
import { WEBSITE_URL } from "@/lib/constants";

describe("rss.xml route", () => {
  let body: string;
  let response: Response;

  beforeAll(async () => {
    response = GET();
    body = await response.text();
  });

  it("serves RSS 2.0 with channel fields", () => {
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain(
      "application/rss+xml",
    );
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain("<title>Randy Ellis — Blog</title>");
    expect(body).toContain(`<link>${WEBSITE_URL}/blog</link>`);
    expect(body).toContain("<language>en-us</language>");
    expect(body).toContain(
      `<atom:link href="${WEBSITE_URL}/rss.xml" rel="self"`,
    );
  });

  it("has one item per blog article with permalink guid", () => {
    const articles = getBlogArticles();
    const itemCount = (body.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(articles.length);
    for (const article of articles) {
      expect(body).toContain(
        `<guid isPermaLink="true">${WEBSITE_URL}/blog/${article.slug}</guid>`,
      );
    }
  });

  it("emits RFC-822 pubDates that match each article's publishedDate", () => {
    for (const article of getBlogArticles()) {
      expect(body).toContain(
        `<pubDate>${new Date(article.publishedDate).toUTCString()}</pubDate>`,
      );
    }
  });

  it("escapes XML entities in text fields", () => {
    // No raw ampersands outside entity references anywhere in the document.
    const rawAmpersands = body.match(/&(?!amp;|lt;|gt;|quot;|apos;|#)/g);
    expect(rawAmpersands).toBeNull();
  });

  it("orders items newest first", () => {
    const dates = [...body.matchAll(/<pubDate>([^<]+)<\/pubDate>/g)].map(
      (m) => new Date(m[1]).getTime(),
    );
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });
});
