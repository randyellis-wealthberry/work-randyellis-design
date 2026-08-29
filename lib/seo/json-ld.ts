/**
 * Server-safe JSON-LD schema builders for structured data
 *
 * D-08 entity story: Person (Randy) + WebSite + CreativeWork + Article,
 * plus FAQPage (amended 2026-08-29, Phase 13 T-02: FAQPage is permitted
 * because the homepage Q&A is now server-rendered visible content — the
 * original exclusion predates that). Still no Organization, LocalBusiness,
 * or ProfessionalService nodes.
 */

import { WEBSITE_URL } from "@/lib/constants";
import { createBaseMetadata, projectCreativeWorkProps } from "@/lib/metadata";
import type { Project } from "@/lib/data/types";

export type JsonLdObject = Record<string, unknown>;

export const PERSON_ID = `${WEBSITE_URL}/#person`;
export const WEBSITE_ID = `${WEBSITE_URL}/#website`;

/**
 * Person entity reference (creator/author/copyrightHolder/publisher)
 */
function personRef(withUrl = false): JsonLdObject {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Randy Ellis",
    ...(withUrl && { url: `${WEBSITE_URL}/` }),
  };
}

/**
 * Single source for site description (Phase 9 D-18 spirit)
 */
function siteDescription(): string {
  const desc = createBaseMetadata().description;
  return typeof desc === "string" ? desc : "";
}

/**
 * D-08 entity story: Person is the primary entity; no Organization nodes (D-08),
 * no partner URLs in sameAs (D-11 — sameAs must identify the same entity)
 */
export function buildPersonSchema(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Randy Ellis",
    jobTitle: ["Head of Product", "Fractional Chief Design Officer"],
    description: siteDescription(),
    url: `${WEBSITE_URL}/`,
    image: `${WEBSITE_URL}/images/randyellis-official-avatar.png`,
    sameAs: [
      "https://www.linkedin.com/in/iamrandyellis/",
      "https://github.com/randyellis-wealthberry",
      "https://x.com/iamrandyellis",
    ],
    knowsAbout: [
      "AI Product Design",
      "Generative AI",
      "Design Systems",
      "Product Leadership",
      "UX Research",
      "Design Engineering",
      "React",
      "Next.js",
      "TypeScript",
      "Leadership Communication",
      "AI Design Tools",
      "Product Strategy",
      "Fractional Chief Design Officer",
      "Startup Design Leadership",
      "Venture-backed Design Scaling",
      "Design Systems Architecture",
      "Remote Design Management",
      "Fractional Executive Services",
      "Startup Advisory Services",
      "Design Operations",
      "Product Design Consulting",
    ],
    award: [
      "Silver Award, The Davey Awards — Mobile Apps/Social (GrowIt!)",
      "Silver Award, The Davey Awards — Mobile Apps/Lifestyle (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best User Interface App/Experience (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best Lifestyle App (GrowIt!)",
    ],
  };
}

/**
 * WebSite schema with SearchAction (D-13)
 *
 * The filter is implemented in Plan 10-06 — app/projects/projects-client.tsx
 * reads ?category= query param.
 */
export function buildWebSiteSchema(): JsonLdObject {
  const baseMetadata = createBaseMetadata();
  const siteName = baseMetadata.openGraph?.siteName ?? "Randy Ellis";

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: `${WEBSITE_URL}/`,
    name: siteName,
    description: siteDescription(),
    inLanguage: "en-US",
    author: personRef(),
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${WEBSITE_URL}/projects?category={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * CreativeWork schema for project case studies
 *
 * D-14: teamSize and role are deliberate non-standard extension keys
 * (CRED-06 solo-vs-team differentiation)
 *
 * Phase 9 D-11: props single-sourced via projectCreativeWorkProps
 */
export function buildCreativeWorkSchema(project: Project): JsonLdObject {
  const props = projectCreativeWorkProps(project);

  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: props.name,
    description: props.description,
    url: props.url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": props.url,
    },
    inLanguage: "en-US",
    genre: props.category,
    keywords: props.technologies.join(", "),
    creator: personRef(true),
    copyrightHolder: personRef(),
  };

  // Conditionally add fields only when defined
  if (props.dateCreated) {
    schema.dateCreated = props.dateCreated;
  }

  if (props.imageUrl) {
    schema.image = {
      "@type": "ImageObject",
      url: props.imageUrl,
    };
  }

  if (props.teamSize !== undefined) {
    schema.teamSize = props.teamSize;
  }

  if (props.role) {
    schema.role = props.role;
  }

  if (props.metrics && props.metrics.length > 0) {
    schema.additionalProperty = props.metrics.map((metric) => ({
      "@type": "PropertyValue",
      name: metric.label,
      value: metric.value,
    }));
  }

  return schema;
}

/**
 * Article schema for blog posts
 *
 * D-15: author = Person ref with url; publisher = Person ref
 */
export function buildArticleSchema(input: {
  title: string;
  description: string;
  datePublished: string;
  url: string;
  dateModified?: string;
  imageUrl?: string;
  keywords?: string[];
}): JsonLdObject {
  const schema: JsonLdObject = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: personRef(true),
    publisher: personRef(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": input.url,
    },
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  if (input.imageUrl) {
    schema.image = input.imageUrl;
  }

  if (input.keywords && input.keywords.length > 0) {
    schema.keywords = input.keywords.join(", ");
  }

  return schema;
}

/**
 * BreadcrumbList schema for navigation
 */
export function buildBreadcrumbSchema(
  items: ReadonlyArray<{ name: string; url: string }>,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * FAQPage schema (Phase 13 T-02, D-08 amendment).
 *
 * MUST be fed the same array the visible accordion renders — FAQPage markup
 * for Q&A a human cannot read on the page is a policy violation, which is why
 * this builder takes the data rather than owning a copy of it.
 */
export function buildFaqPageSchema(
  faqs: ReadonlyArray<{ question: string; answer: string }>,
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

/**
 * Serialize JSON-LD data with < and > escaped to prevent script breakout
 *
 * Prevents `</script>` injection when schema text is user/data-derived
 */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");
}
