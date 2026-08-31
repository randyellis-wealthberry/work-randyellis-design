"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { useMemo, useCallback } from "react";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import {
  trackRecommendationCaseStudyClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";
import { throttled } from "@/lib/analytics-guard";
import { HIGH_FREQUENCY_WINDOW_MS } from "@/lib/analytics-events";

interface GlobalCaseStudyGridProps {
  excludeCurrentSlug?: string;
  currentSlug?: string; // Alternative prop name from tests
  title?: string;
  className?: string;
  maxItems?: number;
  limit?: number; // Alternative prop name from tests
  showDescription?: boolean;
  sourcePageType?: "project" | "blog";
  sourceSlug?: string;
}

/** A stable id for `aria-labelledby`, derived from the section's own title. */
function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function GlobalCaseStudyGrid({
  excludeCurrentSlug,
  currentSlug,
  title = "Featured Case Studies",
  className,
  maxItems = 2,
  limit,
  showDescription = false,
  sourcePageType = "project",
  sourceSlug = "",
}: GlobalCaseStudyGridProps) {
  // Normalize the exclude slug prop (tests use both names)
  const excludeSlug = excludeCurrentSlug || currentSlug;

  // Normalize the max items prop (tests use both names)
  const itemLimit = limit !== undefined ? limit : maxItems;

  // Memoize the filtered and sorted projects for performance
  const filteredProjects = useMemo(() => {
    const availableProjects = PROJECTS.filter((project: Project) => {
      // Filter out malformed data
      if (!project?.name || !project?.slug) return false;

      // Filter out excluded project
      if (excludeSlug && project.slug === excludeSlug) return false;

      // Filter out archived projects
      if (project.archived) return false;

      return true;
    });

    // Sort by featured status first, then by views (if available), then by timeline
    availableProjects.sort((a: Project, b: Project) => {
      // Featured projects come first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // If both have same featured status, sort by views if available
      const aViews = (a as Project & { views?: number }).views || 0;
      const bViews = (b as Project & { views?: number }).views || 0;
      if (aViews !== bViews) {
        return bViews - aViews; // Higher views first
      }

      // If views are equal or not available, sort by timeline (most recent first)
      const getYearFromTimeline = (timeline: string): number => {
        const yearMatch = timeline.match(/\d{4}/g);
        return yearMatch ? parseInt(yearMatch[yearMatch.length - 1]) : 0;
      };

      const yearA = getYearFromTimeline(a.timeline);
      const yearB = getYearFromTimeline(b.timeline);

      return yearB - yearA;
    });

    // Return exactly the number of items requested
    return availableProjects.slice(0, itemLimit);
  }, [excludeSlug, itemLimit]);

  // Handle analytics tracking
  const handleProjectClick = useCallback(
    (project: Project, position: number) => {
      trackRecommendationCaseStudyClick(
        sourcePageType,
        sourceSlug,
        project.slug,
        project.name,
        position,
        `${sourcePageType}_page`,
      );
    },
    [sourcePageType, sourceSlug],
  );

  // Handle hover analytics tracking
  const handleProjectHover = useCallback(
    (project: Project, position: number) => {
      // Per-card key: hovering one card must not suppress the signal for
      // the others, only repeat re-entries of the same card within the window.
      if (
        !throttled(
          `recommendation_card_hover:case_study:${project.slug}`,
          HIGH_FREQUENCY_WINDOW_MS,
        )
      ) {
        return;
      }

      trackRecommendationCardHover(
        "case_study",
        sourcePageType,
        project.slug,
        project.name,
        position,
      );
    },
    [sourcePageType],
  );

  // Don't render if no projects available
  if (filteredProjects.length === 0) {
    return null;
  }

  const headingId = `${slugifyTitle(title)}-heading`;

  return (
    // The Recommendations List (DESIGN.md), same as /projects and the "More
    // Articles" list: hairline rows, no cards. The shadcn `Card` that stood
    // here carried `hover:shadow-lg` and an auto-playing 16:9 video per card —
    // two things the Hairline-First Rule and the One Crank Rule both rule out
    // at the foot of a page. "The page has already spent its imagery on the
    // work itself."
    <section
      className={cn(SECTION, className)}
      aria-labelledby={headingId}
      data-testid="case-study-list-container"
    >
      <SectionLabel id={headingId}>{title}</SectionLabel>

      <ul
        className="mt-6 border-b border-zinc-200 dark:border-zinc-800"
        data-testid="case-study-list"
      >
        {filteredProjects.map((project: Project, index: number) => (
          <li
            key={project.id}
            className="border-t border-zinc-200 dark:border-zinc-800"
            data-testid="case-study-row"
          >
            <Link
              href={`/projects/${project.slug}`}
              aria-label={`View ${project.name} case study`}
              onClick={() => handleProjectClick(project, index)}
              onMouseEnter={() => handleProjectHover(project, index)}
              className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,18rem)_1fr] dark:focus-visible:ring-white"
            >
              <span className="flex flex-col gap-2 sm:pr-8">
                <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
                  {project.name}
                  <ArrowRight
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
                  />
                </span>

                <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                  <span>{project.category}</span>
                  {project.categories && project.categories.length > 1 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">
                        +{project.categories.length - 1} more
                      </span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{project.timeline}</span>
                </span>
              </span>

              <span className="mt-3 flex flex-col gap-2 sm:mt-0">
                {project.subtitle && (
                  <span className="max-w-[62ch] text-base text-zinc-500 dark:text-zinc-400">
                    {project.subtitle}
                  </span>
                )}
                {showDescription && project.description && (
                  <span className="max-w-[62ch] text-sm text-zinc-500 dark:text-zinc-400">
                    {project.description}
                  </span>
                )}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
