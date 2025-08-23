"use client";

import { motion } from "motion/react";
import Link from "next/link";
// import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InView } from "@/components/motion-primitives/in-view";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { cn } from "@/lib/utils";
import { useMemo, useCallback } from "react";
import {
  trackRecommendationCaseStudyClick,
  trackRecommendationCardHover,
} from "@/lib/analytics";

// Animation variants matching existing project-detail-client.tsx patterns
const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_ITEM = {
  duration: 0.4,
};

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

  return (
    <section
      className={cn("space-y-6", className)}
      data-testid="case-study-grid-container"
    >
      {/* Section Title */}
      <TextEffect as="h2" className="text-2xl font-bold" preset="fade-in-blur">
        {title}
      </TextEffect>

      {/* Grid */}
      <div
        className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2"
        data-testid="case-study-grid"
      >
        {filteredProjects.map((project: Project, index: number) => (
          <Card
            key={project.id}
            className="h-full"
            data-testid="case-study-card"
          >
            <div className="group">
              <InView
                variants={VARIANTS_ITEM}
                transition={{ ...TRANSITION_ITEM, delay: index * 0.1 }}
                viewOptions={{ once: true }}
              >
                <Magnetic>
                  <motion.div
                    className="group h-full transition-all duration-300 hover:shadow-lg"
                    data-testid="case-study-card-inner"
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      aria-label={`View ${project.name} case study`}
                      onClick={() => handleProjectClick(project, index)}
                      onMouseEnter={() => handleProjectHover(project, index)}
                      className="block h-full"
                    >
                      {/* Media Container */}
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        {project.video &&
                        project.id !== "featured-project-2" ? (
                          <div
                            className="group relative aspect-video overflow-hidden"
                            data-testid="video-container"
                          >
                            <video
                              src={project.video}
                              poster={project.thumbnail}
                              autoPlay
                              loop
                              muted
                              playsInline
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              data-testid="lazy-video"
                            />
                          </div>
                        ) : project.thumbnail ? (
                          <div className="group relative aspect-video overflow-hidden">
                            <img
                              src={project.thumbnail}
                              alt={`${project.name} preview`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        ) : (
                          <div className="bg-muted flex aspect-video items-center justify-center">
                            <span className="text-muted-foreground">
                              No preview available
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <CardHeader className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="line-clamp-2 transition-colors group-hover:text-blue-600">
                            {project.name}
                          </CardTitle>
                          {project.featured && (
                            <Badge variant="secondary" className="shrink-0">
                              Featured
                            </Badge>
                          )}
                        </div>

                        {project.subtitle && (
                          <p className="text-muted-foreground line-clamp-2 text-sm">
                            {project.subtitle}
                          </p>
                        )}
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Description (if enabled) */}
                        {showDescription && project.description && (
                          <p className="text-muted-foreground line-clamp-3 text-sm">
                            {project.description}
                          </p>
                        )}

                        {/* Category Badge */}
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">{project.category}</Badge>
                          {project.categories &&
                            project.categories.length > 1 && (
                              <Badge variant="outline">
                                +{project.categories.length - 1} more
                              </Badge>
                            )}
                        </div>

                        {/* Timeline */}
                        <div className="text-muted-foreground text-xs">
                          {project.timeline}
                        </div>
                      </CardContent>
                    </Link>
                  </motion.div>
                </Magnetic>
              </InView>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
