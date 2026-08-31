/**
 * Phase 13 (T-03): each blog post has exactly one publication date.
 *
 * Three surfaces state it: the listing array in lib/utils/blog-data.ts
 * (drives the sitemap lastModified, the visible archive date, and the RSS
 * pubDate), the MDX metadata's openGraph.publishedTime, and the
 * BlogPostJsonLd datePublished / BlogHeroWrapper byline. Before this phase
 * they disagreed on 3 of 4 posts (worst case 9 months apart). This suite
 * pins agreement so a fifth post cannot reintroduce drift.
 */
import fs from "fs";
import path from "path";
import { getBlogArticles } from "@/lib/utils/blog-data";

const DATE = /\d{4}-\d{2}-\d{2}/;

describe("blog date consistency (T-03)", () => {
  const articles = getBlogArticles();

  it("lists every post directory under app/blog", () => {
    const dirs = fs
      .readdirSync(path.join(process.cwd(), "app/blog"), {
        withFileTypes: true,
      })
      .filter(
        (d) =>
          d.isDirectory() &&
          fs.existsSync(path.join(process.cwd(), "app/blog", d.name, "page.mdx")),
      )
      .map((d) => d.name)
      .sort();
    expect(articles.map((a) => a.slug).sort()).toEqual(dirs);
  });

  articles.forEach((article) => {
    describe(article.slug, () => {
      const source = fs.readFileSync(
        path.join(process.cwd(), "app/blog", article.slug, "page.mdx"),
        "utf8",
      );

      it("builds metadata via createArticleMetadata (T-07)", () => {
        expect(source).toContain("createArticleMetadata(");
      });

      it("states one date across metadata, JSON-LD, byline, and listing", () => {
        const publishedTime = source.match(
          new RegExp(`publishedTime:\\s*"(${DATE.source})"`),
        )?.[1];
        const jsonLdDate = source.match(
          new RegExp(`datePublished="(${DATE.source})"`),
        )?.[1];
        const bylineDate = source.match(
          new RegExp(`date="(${DATE.source})"`),
        )?.[1];

        expect(publishedTime).toBeDefined();
        expect(jsonLdDate).toBe(publishedTime);
        expect(bylineDate).toBe(publishedTime);
        expect(article.publishedDate).toBe(publishedTime);
      });
    });
  });
});
