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
import { PROJECTS, PROJECT_CATEGORIES } from "../data";

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
  // Check for UnicornStudio content first (highest priority)
  const unicornVideoId = isUnicornStudioId(project.video)
    ? extractUnicornStudioId(project.video)
    : null;
  const unicornThumbnailId = isUnicornStudioId(project.thumbnail || "")
    ? extractUnicornStudioId(project.thumbnail || "")
    : null;
  const unicornId = unicornVideoId || unicornThumbnailId;

  // Check for regular video content
  const videoSrc = isVideoUrl(project.video) ? project.video : null;
  const thumbnailSrc = isVideoUrl(project.thumbnail || "")
    ? project.thumbnail
    : null;
  const staticThumbnail =
    !isVideoUrl(project.thumbnail || "") &&
    !isUnicornStudioId(project.thumbnail || "")
      ? project.thumbnail || "/images/projects/placeholder-thumbnail.jpg"
      : "/images/projects/placeholder-thumbnail.jpg";

  // Priority: UnicornStudio > Video > Static thumbnail
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

  // Prioritize video field, then thumbnail field, then static thumbnail
  const displaySrc = videoSrc || thumbnailSrc;

  if (displaySrc) {
    return (
      <div className="aspect-video overflow-hidden">
        <HoverIframe
          src={displaySrc}
          title={project.name}
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video overflow-hidden">
      <Image
        src={staticThumbnail}
        alt={project.name}
        width={500}
        height={300}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
  );
}

export default function ProjectsClient() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = PROJECTS.filter((project) =>
    activeCategory === "All" ? true : project.category === activeCategory,
  );

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
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            {PROJECT_CATEGORIES.map((category) => (
              <TabsTrigger key={category} value={category} className="text-xs">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-8">
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
                  <Card className="group relative overflow-hidden h-full flex flex-col p-0 gap-0">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <ProjectThumbnail project={project} />
                    </Link>
                    <CardHeader className="pt-4 pb-3 px-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="group-hover:text-blue-600 transition-colors">
                            {project.name}
                          </CardTitle>
                          <CardDescription>
                            {project.description}
                          </CardDescription>
                        </div>
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
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col pt-0 px-4 pb-4">
                      <div className="space-y-3 flex-1">
                        {/* Project Metrics */}
                        {project.metrics && (
                          <div className="grid grid-cols-3 gap-3 text-center">
                            {project.metrics.map((metric, index) => (
                              <div key={index}>
                                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                  {metric.value}
                                </div>
                                <div className="text-xs text-zinc-500 mt-0.5">
                                  {metric.label}
                                </div>
                              </div>
                            ))}
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
