import { Metadata } from "next";
import { BlogArchiveAccordion } from "@/components/blog/blog-archive-accordion";
import { GlobalRecommendationsGrid } from "@/components/blog/global-recommendations-grid";
import { getBlogArchiveData } from "@/lib/utils/blog-data";
import { ScrollProgress } from "@/components/motion-primitives/scroll-progress";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export const metadata: Metadata = {
  title: "Blog Archive - Randy Ellis",
  description:
    "Explore insights, tutorials, and thoughts on design, development, and product strategy from Randy Ellis. A collection of articles covering UX design, frontend development, and business strategy.",
  openGraph: {
    title: "Blog Archive - Randy Ellis",
    description:
      "Explore insights, tutorials, and thoughts on design, development, and product strategy.",
    type: "website",
    url: "https://work.randyellis.design/blog",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Archive - Randy Ellis",
    description:
      "Explore insights, tutorials, and thoughts on design, development, and product strategy.",
  },
};

export default function BlogPage() {
  const archiveData = getBlogArchiveData();
  const { categories, totalCount } = archiveData;

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Scroll Progress Indicator */}
      <ScrollProgress
        className="fixed top-0 left-0 z-50 h-1 bg-gradient-to-r from-blue-500 to-purple-600 shadow-sm"
        springOptions={{ stiffness: 100, damping: 30 }}
      />

      <div className="container mx-auto px-4 py-16">
        <main className="space-y-12" role="main">
          {/* Header Section */}
          <header className="space-y-6 text-center">
            <div className="space-y-4">
              <TextEffect
                as="h1"
                preset="scale"
                className="text-4xl font-bold text-zinc-950 md:text-5xl dark:text-zinc-50"
                delay={0.3}
                speedSegment={1.5}
              >
                Blog Archive
              </TextEffect>
              <p className="mx-auto max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">
                Explore insights, tutorials, and thoughts on design,
                development, and product strategy. A collection of {totalCount}{" "}
                articles covering topics like{" "}
                {categories.slice(0, -1).join(", ")}
                {categories.length > 1
                  ? `, and ${categories[categories.length - 1]}`
                  : categories[0]}
                .
              </p>
            </div>
          </header>

          {/* Archive Section */}
          <section className="space-y-8">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-6 text-2xl font-bold text-zinc-950 dark:text-zinc-50">
                All Articles
              </h2>
              <BlogArchiveAccordion className="w-full" />
            </div>
          </section>

          {/* Recommendations Section */}
          <section className="space-y-8">
            <div className="mx-auto max-w-6xl">
              <GlobalRecommendationsGrid
                title="Latest Articles"
                limit={6}
                className="w-full"
              />
            </div>
          </section>

          {/* Footer Section */}
          <footer className="border-t border-zinc-200 pt-12 text-center dark:border-zinc-700">
            <div className="space-y-4">
              <p className="text-zinc-600 dark:text-zinc-400">
                Stay updated with the latest articles and insights.
              </p>
              <div className="flex justify-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span>{totalCount} Total Articles</span>
                <span>•</span>
                <span>{categories.length} Categories</span>
                <span>•</span>
                <span>Updated Regularly</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
