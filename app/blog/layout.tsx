"use client";
import { TextMorph } from "@/components/ui/text-morph";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
// import { RelatedContent } from "@/components/seo/related-content";
import { GlobalRecommendations } from "@/components/ui/global-recommendations";
import { CTASection } from "@/components/ui/cta-section";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

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

/**
 * The in-prose heading ladder.
 *
 * The One Heading Ladder Rule allows exactly two voices below the page title:
 * the Label that opens a section and the Subhead that names a thing inside it.
 * What was here graded h1→h4 across 20px/18px/16px/16px, so h3, h4, h5 and h6
 * all resolved to the same 16px/500 — a reader could not tell a subsection from
 * a sub-subsection, and one post ships 9 h2 + 16 h3 + 24 h4 into that.
 *
 * h2 is now the Label voice opening a movement: a full-contrast rule, 80px of
 * air above it, and the label itself in Quiet at 14px/500/+0.02em — the same
 * three strings `section-chrome.tsx` exports, spelled as prose modifiers
 * because a Markdown heading cannot import a component. h3 and below are all
 * the Subhead: Body at font-medium in Ink. The step between the two is a rule
 * and a tone, not two pixels of type size.
 *
 * `prose-zinc`, not `prose-gray`: gray is a blue-leaning family and the rest of
 * the site is one zinc ramp (The One Family Rule).
 */
const PROSE = [
  "prose prose-zinc dark:prose-invert pb-8",
  // Section opener — the SECTION rule, with the Headline voice rather than the
  // Label voice. A page-level section is announced by a Label because the label
  // names a region of the page; an article's section heading is part of the
  // reading, and at 14px Quiet it rendered *smaller and lighter than its own
  // h3 subsections*, which inverts the hierarchy the ladder exists to carry.
  // Headline (1.5rem / 600 / -0.03em) is already in the type scale for exactly
  // this and was going unused.
  "prose-h2:mt-20 prose-h2:scroll-mt-10 prose-h2:border-t prose-h2:border-zinc-900 prose-h2:pt-10",
  "prose-h2:text-2xl prose-h2:leading-tight prose-h2:font-semibold prose-h2:tracking-[-0.03em] prose-h2:text-zinc-900",
  "dark:prose-h2:border-zinc-100 dark:prose-h2:text-white",
  // The named thing inside a section — Body at font-medium, in Ink. h3 takes
  // the Hairline (the second and last allowed rule weight, "for separating
  // peers inside a set") so a subsection is legible against a sub-subsection
  // without inventing a third type size the ladder does not have. h4 and below
  // are the same voice with no rule; a section that wants a fourth level wants
  // to be two sections, and the MDX is where that gets fixed, not the CSS.
  "prose-h3:mt-12 prose-h3:border-t prose-h3:border-zinc-200 prose-h3:pt-6",
  "prose-h3:text-base prose-h3:font-medium prose-h3:text-zinc-900",
  "dark:prose-h3:border-zinc-800 dark:prose-h3:text-white",
  // Below the Subhead, the Label voice: smaller and quieter than the h3 above
  // it, so the ladder descends monotonically instead of flattening.
  "prose-h4:mt-8 prose-h4:text-sm prose-h4:font-medium prose-h4:tracking-[0.02em] prose-h4:text-zinc-500 dark:prose-h4:text-zinc-400",
  "prose-h5:mt-8 prose-h5:text-sm prose-h5:font-medium prose-h5:tracking-[0.02em] prose-h5:text-zinc-500 dark:prose-h5:text-zinc-400",
  "prose-h6:mt-8 prose-h6:text-sm prose-h6:font-medium prose-h6:tracking-[0.02em] prose-h6:text-zinc-500 dark:prose-h6:text-zinc-400",
  // A thematic break is the Hairline weight; and every `---` in these posts
  // sits directly above an `##`, where the section's own rule already does the
  // job — two stacked rules of different weights is The Two-Weight Rule's
  // failure mode, not its vocabulary.
  "prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800 [&_hr:has(+h2)]:hidden",
  "prose-strong:font-medium",
  // Links are Ink with an Edge underline that darkens on hover — never a hue.
  "prose-a:font-medium prose-a:text-zinc-900 prose-a:decoration-zinc-300 prose-a:underline-offset-4 hover:prose-a:decoration-zinc-900",
  "dark:prose-a:text-white dark:prose-a:decoration-zinc-700 dark:hover:prose-a:decoration-zinc-100",
  // The Browser Surfaces Rule — verbatim from the case-study template's <main>.
  "caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900",
].join(" ");

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
        <main id="main-content" className={PROSE}>
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
