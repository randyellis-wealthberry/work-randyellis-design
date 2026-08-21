import { WEBSITE_URL } from "@/lib/constants";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/json-ld";
import { JsonLd } from "@/components/seo/json-ld";

/**
 * Server-rendered Article + BreadcrumbList for MDX blog posts (Phase 10 D-10)
 *
 * Author is the site Person @id (D-15), enabling Google to link blog posts to
 * the primary Person entity across the site.
 */
export function BlogPostJsonLd({
  title,
  description,
  datePublished,
  slug,
  dateModified,
  imageUrl,
  keywords,
}: {
  title: string;
  description: string;
  datePublished: string;
  slug: string;
  dateModified?: string;
  imageUrl?: string;
  keywords?: string[];
}) {
  const url = `${WEBSITE_URL}/blog/${slug}`;

  return (
    <JsonLd
      id="blog-post-jsonld"
      data={[
        buildArticleSchema({
          title,
          description,
          datePublished,
          dateModified,
          url,
          imageUrl,
          keywords,
        }),
        buildBreadcrumbSchema([
          { name: "Home", url: WEBSITE_URL },
          { name: "Blog", url: `${WEBSITE_URL}/blog` },
          { name: title, url },
        ]),
      ]}
    />
  );
}
