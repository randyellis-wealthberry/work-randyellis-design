"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import Image from "next/image";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  isVideoUrl,
  isUnicornStudioId,
  extractUnicornStudioId,
} from "@/lib/video-utils";
import { UnicornStudioEmbed } from "@/components/ui/unicorn-studio-embed";
import { HoverIframe } from "@/components/ui/hover-iframe";
import { HoverVideo } from "@/components/ui/hover-video";
import { PROJECTS } from "@/lib/data/projects";
import { PROJECT_CATEGORIES } from "@/lib/data";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function ProjectThumbnail({ project }: { project: (typeof PROJECTS)[0] }) {
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
      : "/images/projects/placeholder-thumbnail.jpg";

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

export default function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = PROJECTS.filter((project) => {
    if (activeCategory === "All") return true;
    // Check both single category and multiple categories
    const projectCategories = project.categories || [project.category];
    return projectCategories.includes(activeCategory);
  });

  return (
    <motion.main
      className="space-y-8"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section variants={VARIANTS_ITEM}>
        <div className="space-y-4">
          <ScrambleSectionTitle
            as="h1"
            className="text-3xl font-bold text-zinc-900 dark:text-zinc-100"
          >
            Projects
          </ScrambleSectionTitle>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            A collection of projects showcasing my work in AI-powered product
            design, design systems, and innovative user experiences.
          </p>
        </div>
      </motion.section>

      <motion.section variants={VARIANTS_ITEM}>
        <Tabs
          value={activeCategory}
          onValueChange={setActiveCategory}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-1">
            {PROJECT_CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="text-xs py-2.5 px-3 min-h-[44px] sm:py-1 sm:min-h-[36px]"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-6 sm:mt-8">
            <motion.div
              className="grid gap-6 md:grid-cols-2"
              variants={VARIANTS_CONTAINER}
              initial="hidden"
              animate="visible"
            >
              {filteredProjects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={VARIANTS_ITEM}
                  className="h-full"
                >
                  <Card className="group relative overflow-hidden h-full flex flex-col gap-0 p-0 shadow-lg">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <ProjectThumbnail project={project} />
                    </Link>
                    <CardHeader className="pt-4 pb-3 px-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </CardTitle>
                          <Badge
                            variant={
                              project.status === "completed"
                                ? "default"
                                : project.status === "in-progress"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription className="w-full">
                          {project.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0 px-4 pb-4">
                      <div className="space-y-3 flex-1">
                        {/* Project Metrics */}
                        {project.metrics && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-3 text-center">
                              {project.metrics
                                .slice(0, 3)
                                .map((metric, index) => (
                                  <div
                                    key={index}
                                    className="flex flex-col justify-between h-14 p-2"
                                  >
                                    <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                                      {metric.value}
                                    </div>
                                    <div className="text-xs text-zinc-500 leading-tight break-words">
                                      {metric.label}
                                    </div>
                                  </div>
                                ))}
                            </div>
                            {project.metrics.length > 3 && (
                              <div className="grid grid-cols-3 gap-3 text-center">
                                {project.metrics
                                  .slice(3, 6)
                                  .map((metric, index) => (
                                    <div
                                      key={index + 3}
                                      className="flex flex-col justify-between h-14 p-2"
                                    >
                                      <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                                        {metric.value}
                                      </div>
                                      <div className="text-xs text-zinc-500 leading-tight break-words">
                                        {metric.label}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            )}
                          </div>
                        )}

                        {project.metrics && <Separator />}

                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {project.timeline}
                            </span>
                          </div>
                          {project.teamSize && (
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-zinc-500" />
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {project.teamSize} people
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1.5">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge
                              variant="outline"
                              className="text-xs px-2 py-0.5"
                            >
                              +{project.technologies.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Always at bottom */}
                      <div className="flex gap-2 pt-3">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="flex-1 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-900 hover:text-white dark:hover:bg-zinc-100 dark:hover:text-zinc-900 transition-all duration-200"
                        >
                          <Link href={`/projects/${project.slug}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/projects/${project.slug}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                        {project.githubLink && (
                          <Button asChild variant="outline" size="sm">
                            <a
                              href={project.githubLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="h-4 w-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.section>
    </motion.main>
  );
}
