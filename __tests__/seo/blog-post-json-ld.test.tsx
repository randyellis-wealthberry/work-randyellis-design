import { renderToStaticMarkup } from "react-dom/server";
import { WEBSITE_URL } from "@/lib/constants";
import { PERSON_ID } from "@/lib/seo/json-ld";
import { BlogPostJsonLd } from "@/components/seo/blog-post-json-ld";
import * as fs from "fs";
import * as path from "path";

describe("BlogPostJsonLd", () => {
  test("renders single script tag with id blog-post-jsonld", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="Test Title"
        description="Test Description"
        datePublished="2025-07-21"
        slug="test-slug"
        keywords={["A", "B"]}
      />,
    );
    expect(html).toContain('<script type="application/ld+json"');
    expect(html).toContain('id="blog-post-jsonld"');
    const scriptCount = (html.match(/<script/g) || []).length;
    expect(scriptCount).toBe(1);
  });

  test("emits array of 2 objects (Article + BreadcrumbList)", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="T"
        description="D"
        datePublished="2025-07-21"
        slug="profits-not-pixels"
        keywords={["A", "B"]}
      />,
    );
    const scriptMatch = html.match(/<script[^>]*>(.*?)<\/script>/s);
    expect(scriptMatch).not.toBeNull();
    const parsed = JSON.parse(scriptMatch![1]);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed.length).toBe(2);
  });

  test("array[0] is Article with correct properties (no imageUrl)", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="T"
        description="D"
        datePublished="2025-07-21"
        slug="profits-not-pixels"
        keywords={["A", "B"]}
      />,
    );
    const scriptMatch = html.match(/<script[^>]*>(.*?)<\/script>/s);
    const parsed = JSON.parse(scriptMatch![1]);
    const article = parsed[0];

    expect(article["@type"]).toBe("Article");
    expect(article.headline).toBe("T");
    expect(article.url).toBe(
      "https://work.randyellis.design/blog/profits-not-pixels",
    );
    expect(article.datePublished).toBe("2025-07-21");
    expect(article.dateModified).toBe("2025-07-21"); // defaults to datePublished
    expect(article.author["@id"]).toBe(PERSON_ID);
    expect(article.author.name).toBe("Randy Ellis");
    expect(article.keywords).toBe("A, B");
    expect(article.image).toBeUndefined();
    expect(article.mainEntityOfPage["@id"]).toBe(article.url);
  });

  test("array[0] includes image and custom dateModified when provided", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="T"
        description="D"
        datePublished="2025-07-21"
        slug="test-slug"
        imageUrl="https://x/y.png"
        dateModified="2025-08-01"
      />,
    );
    const scriptMatch = html.match(/<script[^>]*>(.*?)<\/script>/s);
    const parsed = JSON.parse(scriptMatch![1]);
    const article = parsed[0];

    expect(article.image).toBe("https://x/y.png");
    expect(article.dateModified).toBe("2025-08-01");
  });

  test("array[1] is BreadcrumbList with 3 items", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="T"
        description="D"
        datePublished="2025-07-21"
        slug="profits-not-pixels"
      />,
    );
    const scriptMatch = html.match(/<script[^>]*>(.*?)<\/script>/s);
    const parsed = JSON.parse(scriptMatch![1]);
    const breadcrumb = parsed[1];

    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement).toHaveLength(3);

    expect(breadcrumb.itemListElement[0].name).toBe("Home");
    expect(breadcrumb.itemListElement[0].item).toBe(WEBSITE_URL);

    expect(breadcrumb.itemListElement[1].name).toBe("Blog");
    expect(breadcrumb.itemListElement[1].item).toBe(`${WEBSITE_URL}/blog`);

    expect(breadcrumb.itemListElement[2].name).toBe("T");
    expect(breadcrumb.itemListElement[2].item).toBe(
      `${WEBSITE_URL}/blog/profits-not-pixels`,
    );
  });

  test("does not include Organization or articleSection", () => {
    const html = renderToStaticMarkup(
      <BlogPostJsonLd
        title="T"
        description="D"
        datePublished="2025-07-21"
        slug="test"
      />,
    );
    const stringified = JSON.stringify(
      JSON.parse(html.match(/<script[^>]*>(.*?)<\/script>/s)![1]),
    );
    expect(stringified).not.toContain("Organization");
    expect(stringified).not.toContain("articleSection");
  });
});

describe("BlogPostJsonLd source assertions", () => {
  const componentPath = path.join(
    process.cwd(),
    "components/seo/blog-post-json-ld.tsx",
  );

  test("component file exists", () => {
    expect(fs.existsSync(componentPath)).toBe(true);
  });

  test("does not begin with use client directive", () => {
    const source = fs.readFileSync(componentPath, "utf-8");
    const firstLine = source.split("\n")[0];
    expect(firstLine).not.toContain('"use client"');
    expect(firstLine).not.toContain("'use client'");
  });

  test("does not import next/script", () => {
    const source = fs.readFileSync(componentPath, "utf-8");
    expect(source).not.toContain("next/script");
  });

  test("does not import from structured-data", () => {
    const source = fs.readFileSync(componentPath, "utf-8");
    expect(source).not.toContain("structured-data");
  });

  test("imports buildArticleSchema and buildBreadcrumbSchema", () => {
    const source = fs.readFileSync(componentPath, "utf-8");
    expect(source).toContain("buildArticleSchema");
    expect(source).toContain("buildBreadcrumbSchema");
  });
});

describe("MDX blog posts migration", () => {
  const mdxPosts = [
    {
      path: "app/blog/claude-obsidian-workflows/page.mdx",
      slug: "claude-obsidian-workflows",
    },
    {
      path: "app/blog/create-professional-videos-claude-code-guide/page.mdx",
      slug: "create-professional-videos-claude-code-guide",
    },
    {
      path: "app/blog/exploring-the-intersection-of-design-ai-and-design-engineering/page.mdx",
      slug: "exploring-the-intersection-of-design-ai-and-design-engineering",
    },
    {
      path: "app/blog/profits-not-pixels/page.mdx",
      slug: "profits-not-pixels",
    },
  ];

  mdxPosts.forEach(({ path: mdxPath, slug }) => {
    describe(`${slug}`, () => {
      const fullPath = path.join(process.cwd(), mdxPath);
      let source: string;

      beforeAll(() => {
        source = fs.readFileSync(fullPath, "utf-8");
      });

      test("imports BlogPostJsonLd from blog-post-json-ld", () => {
        expect(source).toContain('from "@/components/seo/blog-post-json-ld"');
      });

      test("renders BlogPostJsonLd component", () => {
        expect(source).toContain("<BlogPostJsonLd");
      });

      test(`has slug="${slug}" prop`, () => {
        expect(source).toContain(`slug="${slug}"`);
      });

      test("does not contain ArticleStructuredData", () => {
        expect(source).not.toContain("ArticleStructuredData");
      });

      test("does not import from structured-data", () => {
        expect(source).not.toContain("structured-data");
      });

      test("does not have url prop with full URL", () => {
        expect(source).not.toContain(
          ` url="https://work.randyellis.design/blog/`,
        );
      });
    });
  });
});

describe("Blog layout cleanup", () => {
  const layoutPath = path.join(process.cwd(), "app/blog/layout.tsx");
  let source: string;

  beforeAll(() => {
    source = fs.readFileSync(layoutPath, "utf-8");
  });

  test("does not contain BreadcrumbStructuredData", () => {
    expect(source).not.toContain("BreadcrumbStructuredData");
  });

  test("does not import from structured-data", () => {
    expect(source).not.toContain("structured-data");
  });

  test("does not contain schemaItems variable", () => {
    expect(source).not.toContain("schemaItems");
  });

  test("still contains BreadcrumbNav import and usage", () => {
    expect(source).toContain("BreadcrumbNav");
    expect(source).toContain("<BreadcrumbNav");
  });
});
