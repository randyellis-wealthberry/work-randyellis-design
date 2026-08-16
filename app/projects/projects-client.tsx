"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
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
import { Separator } from "@/components/ui/separator";
import { PROJECTS } from "@/lib/data/projects";
import { ProjectThumbnail } from "@/components/projects/project-thumbnail";
import { cn } from "@/lib/utils";

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

export default function ProjectsClient() {
  return (
    <motion.main
      className="space-y-6 sm:space-y-8"
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
        <motion.div
          className="projects-grid-pattern"
          variants={VARIANTS_CONTAINER}
          initial="hidden"
          animate="visible"
        >
          {PROJECTS.map((project) => (
            <motion.div
              key={project.id}
              variants={VARIANTS_ITEM}
              className={cn(
                "h-full",
                project.isLiveProduct && "projects-grid-item-wide",
              )}
            >
              <Card className="group relative flex h-full flex-col gap-0 overflow-hidden p-0 shadow-lg">
                <Link href={`/projects/${project.slug}`} className="block">
                  <ProjectThumbnail project={project} />
                </Link>
                {/* Single slot so status badges stack instead of overlapping */}
                {(project.isLiveProduct || project.isComposite) && (
                  <div className="pointer-events-none absolute top-3 right-3 z-10 flex flex-col items-end gap-1.5">
                    {project.isLiveProduct && (
                      <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
                        Live Product
                      </Badge>
                    )}
                    {project.isComposite && (
                      <Badge
                        variant="secondary"
                        className="text-xs font-semibold"
                      >
                        Composite
                      </Badge>
                    )}
                  </div>
                )}
                <CardHeader className="px-4 pt-4 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="transition-colors group-hover:text-blue-600">
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
                <CardContent className="flex flex-1 flex-col px-4 pt-0 pb-4">
                  <div className="flex-1 space-y-3">
                    {/* Project Metrics */}
                    {project.metrics && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-3 text-center">
                          {project.metrics.slice(0, 3).map((metric, index) => (
                            <div
                              key={index}
                              className="flex h-14 flex-col justify-between p-2"
                            >
                              <div className="text-lg leading-tight font-semibold text-zinc-900 dark:text-zinc-100">
                                {metric.value}
                              </div>
                              <div className="text-xs leading-tight break-words text-zinc-500">
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
                                  className="flex h-14 flex-col justify-between p-2"
                                >
                                  <div className="text-lg leading-tight font-semibold text-zinc-900 dark:text-zinc-100">
                                    {metric.value}
                                  </div>
                                  <div className="text-xs leading-tight break-words text-zinc-500">
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
                          className="px-2 py-0.5 text-xs"
                        >
                          {tech}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <Badge
                          variant="outline"
                          className="px-2 py-0.5 text-xs"
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
                      className="flex-1 border border-zinc-200 transition-all duration-200 hover:bg-zinc-900 hover:text-white dark:border-zinc-700 dark:hover:bg-zinc-100 dark:hover:text-zinc-900"
                    >
                      <Link href={`/projects/${project.slug}`}>
                        View Details
                      </Link>
                    </Button>
                    {project.link && (
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${project.name} live project`}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
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
      </motion.section>
    </motion.main>
  );
}
