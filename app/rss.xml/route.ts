import { getBlogArticles } from "@/lib/utils/blog-data";
import { WEBSITE_URL } from "@/lib/constants";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// RSS 2.0 feed for the blog. Item dates come from getBlogArticles(), the same
// source the sitemap reads, which __tests__/seo/blog-date-consistency.test.ts
// pins to each post's MDX metadata.
export function GET(): Response {
  const articles = [...getBlogArticles()].sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
  );

  const items = articles
    .map((article) => {
      const url = `${WEBSITE_URL}/blog/${article.slug}`;
      return [
        "    <item>",
        `      <title>${escapeXml(article.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(article.publishedDate).toUTCString()}</pubDate>`,
        `      <description>${escapeXml(article.description)}</description>`,
        ...article.tags.map(
          (tag) => `      <category>${escapeXml(tag)}</category>`,
        ),
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const lastBuildDate = articles.length
    ? new Date(articles[0].publishedDate).toUTCString()
    : new Date(0).toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Randy Ellis — Blog</title>
    <link>${WEBSITE_URL}/blog</link>
    <description>Writing on AI product design, design engineering, and design leadership by Randy Ellis, Head of Product &amp; Fractional Chief Design Officer.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${WEBSITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
