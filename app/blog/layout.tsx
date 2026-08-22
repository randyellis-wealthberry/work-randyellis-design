"use client";
import { TextMorph } from "@/components/ui/text-morph";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
// import { RelatedContent } from "@/components/seo/related-content";
import { GlobalRecommendations } from "@/components/ui/global-recommendations";
import { CTASection } from "@/components/ui/cta-section";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PROSE_ARTICLE } from "@/components/ui/prose-styles";

function CopyButton() {
  const [text, setText] = useState("Copy URL");
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  useEffect(() => {
    if (text === "Copied!") {
      const timer = setTimeout(() => {
        setText("Copy URL");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  return (
    <button
      onClick={() => {
        setText("Copied!");
        navigator.clipboard.writeText(currentUrl);
      }}
      // 44px target via the negative-margin pattern DESIGN.md cites (`-my-3
      // py-3`), so the control is touchable without loosening the row. The
      // focus ring is Ink on light and Paper on dark — The One Family Rule
      // extends to focus rings, and this button had none at all.
      className="font-base -my-3 inline-flex min-h-[44px] items-center py-3 text-center text-sm text-zinc-500 transition-colors hover:text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-zinc-400 dark:hover:text-zinc-100 dark:focus-visible:ring-white"
      type="button"
    >
      <TextMorph>{text}</TextMorph>
    </button>
  );
}

export default function LayoutBlogPost({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // /blog is the archive index; it ships its own <main>, header and sections.
  // Wrapping it in the post's prose <main> nested one landmark inside another
  // and printed a stray "Copy URL" above the archive.
  const isPost = pathname !== "/blog";

  // Generate breadcrumb for blog posts
  const generateBlogBreadcrumbs = () => {
    if (pathname === "/blog") {
      return [{ label: "Blog", current: true }];
    }

    // Extract blog post slug from pathname
    const slug = pathname.split("/blog/")[1];
    if (slug) {
      // Get blog post title from the slug (basic formatting)
      const title = slug
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      return [
        { label: "Blog", href: "/blog" },
        { label: title, current: true },
      ];
    }

    return [{ label: "Blog", current: true }];
  };

  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-zinc-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      {/* No fixed scroll-progress rule. The One Crank Rule: a surface gets at
          most one scroll-linked timeline, and its first corollary is the
          removal of the floating reading-progress widget. */}
      <div className="mt-16">
        <BreadcrumbNav items={generateBlogBreadcrumbs()} />
      </div>

      {isPost ? (
        <main id="main-content" className={PROSE_ARTICLE}>
          <CopyButton />
          {children}
        </main>
      ) : (
        children
      )}

      {/* Global Recommendations Section */}
      {isPost && (
        <div className="not-prose">
          <GlobalRecommendations
            contentType="blog"
            currentSlug={pathname.split("/blog/")[1] || ""}
            showCaseStudies={true}
            showArticles={true}
            caseStudyTitle="Featured case studies"
            articleTitle="More articles"
            className="mb-20"
          />
        </div>
      )}

      {/* CTA Section */}
      {isPost && (
        <div className="not-prose">
          <CTASection />
        </div>
      )}
    </>
  );
}
