"use client";

import * as React from "react";
import { GlobalCaseStudyGrid } from "./global-case-study-grid";
import { GlobalArticleGrid } from "./global-article-grid";
import { InView } from "@/components/motion-primitives/in-view";
import { cn } from "@/lib/utils";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { getBlogArticles, type BlogArticle } from "@/lib/utils/blog-data";
import { trackRecommendationSectionView } from "@/lib/analytics";
import { usePathname } from "next/navigation";

interface GlobalRecommendationsProps {
  /**
   * Type of content for context-aware recommendations
   * @deprecated Use context prop instead for clarity
   */
  contentType?: "project" | "blog";

  /**
   * Context for recommendations - determines which content to exclude
   */
  context?: "case-study" | "blog-post" | string;

  /**
   * Slug of current content to exclude from recommendations
   */
  excludeCurrent?: string;

  /**
   * Alternative prop name for current slug (for test compatibility)
   */
  currentSlug?: string;

  /**
   * Whether to show case studies section
   */
  showCaseStudies?: boolean;

  /**
   * Whether to show articles section
   */
  showArticles?: boolean;

  /**
   * Additional CSS classes for container
   */
  className?: string;

  /**
   * Custom title for case studies section
   */
  caseStudyTitle?: string;

  /**
   * Custom title for articles section
   */
  articleTitle?: string;

  /**
   * Maximum number of case studies to show
   */
  caseStudyLimit?: number;

  /**
   * Maximum number of articles to show
   */
  articleLimit?: number;

  /**
   * Custom spacing class (for configuration flexibility)
   */
  spacing?: string;

  /**
   * Animation delay for staggered effects
   */
  animationDelay?: number;

  /**
   * Priority ordering for content
   */
  priority?: "articles-first" | "case-studies-first";
}

export function GlobalRecommendations({
  context,
  excludeCurrent,
  currentSlug,
  showCaseStudies = true,
  showArticles = true,
  className,
  caseStudyTitle = "Featured Case Studies",
  articleTitle = "Latest Articles",
  caseStudyLimit = 2,
  articleLimit = 2,
  spacing = "space-y-12",
  animationDelay = 0,
  priority = "case-studies-first",
}: GlobalRecommendationsProps) {
  const pathname = usePathname();

  // Normalize the current slug prop (tests use both names)
  const normalizedCurrentSlug = React.useMemo(() => {
    return excludeCurrent || currentSlug;
  }, [excludeCurrent, currentSlug]);

  // Check data availability for conditional rendering
  const availableData = React.useMemo(() => {
    const projects = PROJECTS || [];
    const articles = getBlogArticles() || [];

    // Filter projects to exclude current one (same logic as GlobalCaseStudyGrid)
    const availableProjects = projects.filter((project: Project) => {
      if (!project?.name || !project?.slug) return false;
      if (normalizedCurrentSlug && project.slug === normalizedCurrentSlug)
        return false;
      if (project.archived) return false;
      return true;
    });

    // Filter articles to exclude current one (same logic as GlobalArticleGrid)
    const availableArticles = articles.filter((article: BlogArticle) => {
      if (!article?.title || !article?.slug) return false;
      if (normalizedCurrentSlug && article.slug === normalizedCurrentSlug)
        return false;
      return true;
    });

    return {
      hasProjects: availableProjects.length > 0,
      hasArticles: availableArticles.length > 0,
      totalAvailable: availableProjects.length + availableArticles.length,
    };
  }, [normalizedCurrentSlug]);

  // Early return if nothing should be rendered
  const shouldRender = React.useMemo(() => {
    // If both sections are disabled, don't render
    if (!showCaseStudies && !showArticles) {
      return false;
    }

    // If only case studies enabled but no projects available
    if (showCaseStudies && !showArticles && !availableData.hasProjects) {
      return false;
    }

    // If only articles enabled but no articles available
    if (!showCaseStudies && showArticles && !availableData.hasArticles) {
      return false;
    }

    // If both enabled but no data at all
    if (showCaseStudies && showArticles && availableData.totalAvailable === 0) {
      return false;
    }

    return true;
  }, [showCaseStudies, showArticles, availableData]);

  // Track analytics when sections are being rendered
  React.useEffect(() => {
    // Early exit conditions
    if (!showCaseStudies && !showArticles) {
      return;
    }
    if (showCaseStudies && !showArticles && !availableData.hasProjects) {
      return;
    }
    if (!showCaseStudies && showArticles && !availableData.hasArticles) {
      return;
    }
    if (showCaseStudies && showArticles && availableData.totalAvailable === 0) {
      return;
    }

    // Skip if no pathname and no explicit context
    if (!pathname && !context) {
      return;
    }

    // Determine page type and slug from context/pathname
    let pageType: "project" | "blog" = "project";
    let pageSlug = "";

    if (pathname.startsWith("/blog/")) {
      pageType = "blog";
      pageSlug = pathname.replace("/blog/", "");
    } else if (pathname.startsWith("/projects/")) {
      pageType = "project";
      pageSlug = pathname.replace("/projects/", "");
    } else if (context === "blog-post") {
      pageType = "blog";
      pageSlug = normalizedCurrentSlug || "";
    } else if (context === "case-study" || context === "project") {
      pageType = "project";
      pageSlug = normalizedCurrentSlug || "";
    }

    // Build sections array
    const sectionsShown: ("case_studies" | "articles")[] = [];
    if (showCaseStudies && availableData.hasProjects) {
      sectionsShown.push("case_studies");
    }
    if (showArticles && availableData.hasArticles) {
      sectionsShown.push("articles");
    }

    // Track section view
    if (sectionsShown.length > 0) {
      trackRecommendationSectionView(
        pageType,
        pageSlug,
        sectionsShown,
        showCaseStudies && availableData.hasProjects ? caseStudyLimit : 0,
        showArticles && availableData.hasArticles ? articleLimit : 0,
      );
    }
  }, [
    shouldRender,
    pathname,
    normalizedCurrentSlug,
    context,
    showCaseStudies,
    showArticles,
    availableData,
    caseStudyLimit,
    articleLimit,
  ]);

  // Don't render container if nothing should be shown
  if (!shouldRender) {
    return null;
  }

  // Determine section order based on priority
  const renderCaseStudiesFirst = priority === "case-studies-first";

  const caseStudySection = showCaseStudies && availableData.hasProjects && (
    <InView
      key="case-studies"
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{
        duration: 0.4,
        delay: renderCaseStudiesFirst ? animationDelay : animationDelay + 0.2,
      }}
      viewOptions={{ once: true, margin: "-100px" }}
    >
      <GlobalCaseStudyGrid
        currentSlug={normalizedCurrentSlug}
        title={caseStudyTitle}
        limit={caseStudyLimit}
        sourcePageType={pathname?.startsWith("/blog/") ? "blog" : "project"}
        sourceSlug={normalizedCurrentSlug || ""}
      />
    </InView>
  );

  const articleSection = showArticles && availableData.hasArticles && (
    <InView
      key="articles"
      variants={{
        hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" },
      }}
      transition={{
        duration: 0.4,
        delay: renderCaseStudiesFirst ? animationDelay + 0.2 : animationDelay,
      }}
      viewOptions={{ once: true, margin: "-100px" }}
    >
      <GlobalArticleGrid
        currentSlug={normalizedCurrentSlug}
        title={articleTitle}
        limit={articleLimit}
        sourcePageType={pathname?.startsWith("/blog/") ? "blog" : "project"}
        sourceSlug={normalizedCurrentSlug || ""}
      />
    </InView>
  );

  return (
    <section
      className={cn(spacing, className)}
      data-testid="global-recommendations-container"
      aria-labelledby="recommendations-title"
    >
      {/* Hidden title for accessibility */}
      <h2 id="recommendations-title" className="sr-only">
        Related Content Recommendations
      </h2>

      {/* Render sections in priority order */}
      {renderCaseStudiesFirst ? (
        <>
          {caseStudySection}
          {articleSection}
        </>
      ) : (
        <>
          {articleSection}
          {caseStudySection}
        </>
      )}
    </section>
  );
}
