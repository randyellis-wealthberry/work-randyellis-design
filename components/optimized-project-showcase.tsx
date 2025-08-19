/**
 * Optimized project showcase component with fast lazy loading
 * Replaces slow loading videos and images with performance-optimized versions
 */
"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  OptimizedLazyImage,
  OptimizedLazyVideo,
} from "@/components/performance/lazy-components";
import { trackProjectHover, trackProjectView } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface Project {
  slug: string;
  title: string;
  company: string;
  summary: string;
  thumbnail: string;
  video?: string;
  featured?: boolean;
}

interface OptimizedProjectShowcaseProps {
  projects: Project[];
  className?: string;
}

function OptimizedProjectCard({
  project,
  index,
  priority = "medium",
}: {
  project: Project;
  index: number;
  priority?: "high" | "medium" | "low";
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = useCallback(() => {
    setIsHovered(true);
    trackProjectHover(project.slug);
  }, [project.slug]);

  const handleLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    trackProjectView(project.slug);
  }, [project.slug]);

  // Determine if we should show video based on conditions
  const shouldShowVideo = useMemo(() => {
    return (
      project.video &&
      project.video.includes(".mp4") &&
      project.video.startsWith("/")
    );
  }, [project.video]);

  // Determine preload distance based on priority and position
  const preloadDistance = useMemo(() => {
    if (priority === "high") return 500;
    if (index <= 2) return 300; // First 3 items get medium preload
    return 150; // Rest get smaller preload distance
  }, [priority, index]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onHoverStart={handleHover}
      onHoverEnd={handleLeave}
    >
      <Link
        href={`/projects/${project.slug}`}
        onClick={handleClick}
        className="group block"
      >
        <div className="relative overflow-hidden rounded-lg">
          {/* Video thumbnail for supported projects */}
          {shouldShowVideo ? (
            <div className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90">
              <OptimizedLazyVideo
                src={project.video!}
                poster={project.thumbnail}
                priority={priority}
                preloadDistance={preloadDistance}
                autoPlay={isHovered} // Only autoplay on hover
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                enableAdaptiveQuality={true}
                className="h-full w-full object-cover"
                containerClassName="h-full w-full"
              />
            </div>
          ) : (
            /* Static image for other projects */
            <div className="aspect-video max-h-48 w-full cursor-pointer overflow-hidden rounded-lg transition-opacity duration-200 hover:opacity-90">
              <OptimizedLazyImage
                src={project.thumbnail}
                alt={`${project.title} - ${project.company}`}
                width={400}
                height={225}
                priority={priority}
                preloadDistance={preloadDistance}
                enableWebP={true}
                quality={priority === "high" ? 90 : 85}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                placeholder="skeleton"
              />
            </div>
          )}

          {/* Project info overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div className="absolute right-0 bottom-0 left-0 translate-y-2 transform p-4 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <h3 className="mb-1 text-lg font-semibold">{project.title}</h3>
            <p className="mb-2 text-sm text-white/90">{project.company}</p>
            <p className="line-clamp-2 text-xs text-white/80">
              {project.summary}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function OptimizedProjectShowcase({
  projects,
  className,
}: OptimizedProjectShowcaseProps) {
  // Prioritize projects based on featured status and position
  const prioritizedProjects = useMemo(() => {
    return projects.map((project, index) => ({
      ...project,
      priority:
        project.featured || index === 0
          ? ("high" as const)
          : index <= 2
            ? ("medium" as const)
            : ("low" as const),
    }));
  }, [projects]);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {prioritizedProjects.map((project, index) => (
        <OptimizedProjectCard
          key={project.slug}
          project={project}
          index={index}
          priority={project.priority}
        />
      ))}
    </div>
  );
}

export default OptimizedProjectShowcase;
