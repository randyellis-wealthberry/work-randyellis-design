"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  thumbnail?: string;
  video?: string;
  status: "completed" | "in-progress" | "concept";
}

interface ProjectRecommendationsProps {
  currentProjectId: string;
  projects: Project[];
  maxRecommendations?: number;
}

export function ProjectRecommendations({
  currentProjectId,
  projects,
  maxRecommendations = 3,
}: ProjectRecommendationsProps) {
  const currentProject = projects.find((p) => p.id === currentProjectId);

  // Filter out current project and get recommendations
  // Prioritize same category, then featured projects
  const recommendations = projects
    .filter((p) => p.id !== currentProjectId)
    .sort((a, b) => {
      // Same category gets priority
      const aCategory = a.category === currentProject?.category ? 1 : 0;
      const bCategory = b.category === currentProject?.category ? 1 : 0;
      return bCategory - aCategory;
    })
    .slice(0, maxRecommendations);

  if (recommendations.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-16 border-t border-zinc-200 pt-16 dark:border-zinc-800"
    >
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            Related Projects
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Explore more work in similar domains
          </p>
        </div>
        <Link
          href="/projects"
          className="group flex items-center gap-1 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          View all projects ({projects.length})
          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recommendations.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="group h-full transition-all duration-300 hover:shadow-lg">
              <Link href={`/projects/${project.slug}`}>
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <Image
                    src={
                      project.thumbnail ||
                      "/images/projects/placeholder-thumbnail.jpg"
                    }
                    alt={project.name}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                  <Badge
                    variant={
                      project.status === "completed" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                </div>
                <Link
                  href={`/projects/${project.slug}`}
                  className="transition-colors group-hover:text-blue-600"
                >
                  <h4 className="mb-2 line-clamp-1 font-medium text-zinc-900 dark:text-zinc-100">
                    {project.name}
                  </h4>
                </Link>
                <p className="line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
