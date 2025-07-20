"use client";

import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
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
import { AnimatedWebGL } from "@/components/ui/animated-webgl";
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

function getWebGLSceneType(
  category: string,
  name: string,
): "organic" | "neural" | "geometric" | "unicorn" {
  if (category === "Mobile App" && name.toLowerCase().includes("grow")) {
    return "unicorn";
  }
  if (category === "AI/ML" || name.toLowerCase().includes("ai")) {
    return "neural";
  }
  return "geometric";
}

function getProjectColor(category: string): string {
  switch (category) {
    case "Mobile App":
      return "#22c55e"; // Green for mobile/growth
    case "AI/ML":
      return "#3b82f6"; // Blue for AI/tech
    default:
      return "#8b5cf6"; // Purple for general projects
  }
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
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Projects
          </h1>
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
                  <Card className="group relative overflow-hidden h-full flex flex-col">
                    <Link href={`/projects/${project.slug}`} className="block">
                      <div className="aspect-video overflow-hidden">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <AnimatedWebGL
                            sceneType={getWebGLSceneType(
                              project.category,
                              project.name,
                            )}
                            fallbackSrc={project.video}
                            color={getProjectColor(project.category)}
                            speed={1.0}
                            intensity={0.7}
                            className="h-full w-full transition-transform duration-300 group-hover:scale-105"
                            hoverScale={1.02}
                            disableZoom={true}
                          />
                        )}
                      </div>
                    </Link>

                    <CardHeader>
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

                    <CardContent className="flex-1 flex flex-col">
                      <div className="space-y-4 flex-1">
                        {/* Project Metrics */}
                        {project.metrics && (
                          <div className="grid grid-cols-3 gap-2 text-center">
                            {project.metrics.map((metric, index) => (
                              <div key={index} className="space-y-1">
                                <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                                  {metric.value}
                                </div>
                                <div className="text-xs text-zinc-500">
                                  {metric.label}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {project.metrics && <Separator />}

                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-zinc-500" />
                            <span className="text-zinc-600 dark:text-zinc-400">
                              {project.timeline}
                            </span>
                          </div>
                          {project.teamSize && (
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-zinc-500" />
                              <span className="text-zinc-600 dark:text-zinc-400">
                                {project.teamSize} people
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 4).map((tech) => (
                            <Badge
                              key={tech}
                              variant="outline"
                              className="text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons - Always at bottom */}
                      <div className="flex gap-2 pt-4">
                        <Button asChild size="sm" className="flex-1">
                          <Link href={`/projects/${project.slug}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button asChild variant="outline" size="sm">
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
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
