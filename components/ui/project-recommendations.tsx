"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

/**
 * Where to go next, as a list rather than a card grid. This sits at the foot of
 * a case study that has already spent its imagery on the work itself, so the
 * rows carry the argument: what the project is, in one line, one hairline apart.
 */
export function ProjectRecommendations({
  currentProjectId,
  projects,
  maxRecommendations = 3,
}: ProjectRecommendationsProps) {
  const currentProject = projects.find((p) => p.id === currentProjectId);

  // Same category first, then whatever order the record is in.
  const recommendations = projects
    .filter((p) => p.id !== currentProjectId)
    .sort((a, b) => {
      const aCategory = a.category === currentProject?.category ? 1 : 0;
      const bCategory = b.category === currentProject?.category ? 1 : 0;
      return bCategory - aCategory;
    })
    .slice(0, maxRecommendations);

  if (recommendations.length === 0) return null;

  return (
    <ul>
      {recommendations.map((project) => (
        <li
          key={project.id}
          className="border-t border-zinc-200 dark:border-zinc-800"
        >
          <Link
            href={`/projects/${project.slug}`}
            className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,22rem)_1fr] dark:focus-visible:ring-white"
          >
            <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 sm:pr-8 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
              {project.name}
              <ArrowRight
                aria-hidden="true"
                className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
              />
            </span>
            <span className="mt-2 max-w-[62ch] text-base text-zinc-500 sm:mt-0 dark:text-zinc-400">
              {project.description}
            </span>
          </Link>
        </li>
      ))}
      <li className="border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/projects"
          className="group inline-flex min-h-[44px] items-center gap-1.5 py-5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
        >
          All {projects.length} case studies
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
          />
        </Link>
      </li>
    </ul>
  );
}
