import { Metadata } from "next";
import { BlogArchiveAccordion } from "@/components/blog/blog-archive-accordion";
import { GlobalRecommendationsGrid } from "@/components/blog/global-recommendations-grid";
import { getBlogArchiveData } from "@/lib/utils/blog-data";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Blog",
  description:
    "📚 AI design insights from the trenches: Claude + Obsidian workflows, AI video creation with Remotion, and why profits beat pixels. Real-world tutorials that work.",
  path: "/blog",
});

export default function BlogPage() {
  const archiveData = getBlogArchiveData();
  const { categories, totalCount } = archiveData;

  return (
    // No floating scroll-progress bar. The One Crank Rule names its removal
    // explicitly ("no floating reading-progress widget"), and the one that sat
    // here was a blue→purple gradient with a shadow — two hues and an
    // elevation on a surface whose whole vocabulary is zinc and hairlines.
    //
    // The Browser Surfaces Rule: selection and caret are part of the palette.
    // Copied verbatim from the case-study template's <main>.
    //
    // Vertical rhythm comes from SECTION's own mt-20 (80px between movements),
    // not from a `space-y` on the container — a space-y utility outranks the
    // section's margin and would flatten the documented rhythm to 48px.
    <main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
    >
      {/* Header Section */}
      <header className="space-y-6">
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          Blog Archive
        </h1>
        <p className="max-w-[62ch] text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          Explore insights, tutorials, and thoughts on design, development, and
          product strategy. A collection of{" "}
          <span className="tabular-nums">{totalCount}</span> articles covering
          topics like {categories.slice(0, -1).join(", ")}
          {categories.length > 1
            ? `, and ${categories[categories.length - 1]}`
            : categories[0]}
          .
        </p>
      </header>

      {/* Archive Section */}
      <section className={SECTION} aria-labelledby="all-articles-heading">
        <SectionLabel id="all-articles-heading">All articles</SectionLabel>
        <BlogArchiveAccordion className="mt-6 w-full" />
      </section>

      {/* Recommendations Section */}
      <GlobalRecommendationsGrid title="Latest articles" limit={6} />

      {/* Footer Section */}
      <footer className="mt-20 border-t border-zinc-200 pt-8 dark:border-zinc-800">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="tabular-nums">{totalCount}</span>
          <span>{totalCount === 1 ? "article" : "articles"}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{categories.length}</span>
          <span>{categories.length === 1 ? "category" : "categories"}</span>
        </p>
      </footer>
    </main>
  );
}
