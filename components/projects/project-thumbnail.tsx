"use client";

import Image from "next/image";
import {
  isVideoUrl,
  isUnicornStudioId,
  extractUnicornStudioId,
} from "@/lib/video-utils";
import { UnicornStudioEmbed } from "@/components/ui/unicorn-studio-embed";
import { HoverIframe } from "@/components/ui/hover-iframe";
import { HoverVideo } from "@/components/ui/hover-video";
import type { Project } from "@/lib/data/types";

/**
 * The project card thumbnail used on the /projects grid and in Related
 * Projects. One component so every surface picks the same media for a
 * project — UnicornStudio embed, hover video, external iframe, or a static
 * image — with the same fallbacks.
 */
const PLACEHOLDER_THUMBNAIL = "/images/projects/placeholder-thumbnail.jpg";

export function ProjectThumbnail({ project }: { project: Project }) {
  // Special handling for Nagarro project - always show the logo
  if (
    project.slug === "nagarro" &&
    project.thumbnail?.includes("nagarro-logo.png")
  ) {
    return (
      <div className="aspect-video overflow-hidden">
        <Image
          src={project.thumbnail}
          alt={`${project.name} - ${project.subtitle || project.description} showcasing ${project.technologies.slice(0, 3).join(", ")} implementation`}
          width={500}
          height={300}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Check for UnicornStudio content first (highest priority)
  const unicornVideoId = isUnicornStudioId(project.video)
    ? extractUnicornStudioId(project.video)
    : null;
  const unicornThumbnailId = isUnicornStudioId(project.thumbnail || "")
    ? extractUnicornStudioId(project.thumbnail || "")
    : null;
  const unicornId = unicornVideoId || unicornThumbnailId;

  // Check for local MP4 files (second priority)
  const isLocalMp4Video =
    project.video &&
    project.video.includes(".mp4") &&
    project.video.startsWith("/");
  const isLocalMp4Thumbnail =
    project.thumbnail &&
    project.thumbnail.includes(".mp4") &&
    project.thumbnail.startsWith("/");

  // Check for external video URLs (third priority)
  const videoSrc = isVideoUrl(project.video) ? project.video : null;
  const thumbnailSrc = isVideoUrl(project.thumbnail || "")
    ? project.thumbnail
    : null;

  const staticThumbnail =
    !isVideoUrl(project.thumbnail || "") &&
    !isUnicornStudioId(project.thumbnail || "") &&
    !isLocalMp4Thumbnail &&
    project.thumbnail
      ? project.thumbnail
      : PLACEHOLDER_THUMBNAIL;

  // Priority: UnicornStudio > Local MP4 > External Video > Static thumbnail
  if (unicornId) {
    return (
      <div className="aspect-video overflow-hidden">
        <UnicornStudioEmbed
          projectId={unicornId}
          width={1920}
          height={1080}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  // Handle local MP4 files with HoverVideo
  const localMp4Src = isLocalMp4Thumbnail
    ? project.thumbnail
    : isLocalMp4Video
      ? project.video
      : null;
  if (localMp4Src) {
    return (
      <div className="aspect-video overflow-hidden">
        <HoverVideo
          src={localMp4Src}
          poster={
            staticThumbnail !== PLACEHOLDER_THUMBNAIL
              ? staticThumbnail
              : undefined
          }
          alt={`${project.name} - ${project.subtitle || project.description} showcasing ${project.technologies.slice(0, 3).join(", ")} implementation`}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
          resetOnLeave={true}
          projectName={project.name}
        />
      </div>
    );
  }

  // Handle external video URLs with HoverIframe
  const displaySrc = videoSrc || thumbnailSrc;
  if (displaySrc) {
    return (
      <div className="aspect-video overflow-hidden">
        <HoverIframe
          src={displaySrc}
          title={project.name}
          className="h-full w-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden">
      <Image
        src={staticThumbnail}
        alt={`${project.name} - ${project.subtitle || project.description} showcasing ${project.technologies.slice(0, 3).join(", ")} implementation`}
        width={500}
        height={300}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}
