import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { ProjectThumbnail } from "@/components/projects/project-thumbnail";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";

/**
 * Pick projects to show alongside the current one: same category first, then
 * backfill with the remaining featured projects so a page never ends on an
 * empty "Related Projects" block. Order within each tier follows PROJECTS.
 */
export function getRelatedProjects(currentId: string, count = 2): Project[] {
  const current = PROJECTS.find((p) => p.id === currentId);
  const others = PROJECTS.filter((p) => p.id !== currentId && !p.archived);
  const sameCategory = current
    ? others.filter((p) => p.category === current.category)
    : [];
  const rest = others.filter((p) => !sameCategory.includes(p));
  return [...sameCategory, ...rest].slice(0, count);
}

type RelatedProjectsProps = {
  currentId: string;
  count?: number;
  heading?: string;
  sectionId?: string;
};

/**
 * "Related Projects" — rendered at the foot of every individual project page,
 * both the shared [slug] template and the bespoke routes, so the component set
 * stays identical across all of them (Phase 9 cross-surface consistency).
 * Cards reuse ProjectThumbnail so a project's preview media is the same here
 * as on the /projects grid.
 */
export function RelatedProjects({
  currentId,
  count = 2,
  heading = "Related Projects",
  sectionId = "related-projects",
}: RelatedProjectsProps) {
  const related = getRelatedProjects(currentId, count);
  if (related.length === 0) return null;

  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      role="region"
      aria-labelledby={headingId}
      className="space-y-6"
    >
      <ScrambleSectionTitle
        as="h2"
        id={headingId}
        className="text-2xl font-bold"
      >
        {heading}
      </ScrambleSectionTitle>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {related.map((project) => (
          <Card
            key={project.id}
            className="group flex h-full flex-col gap-0 overflow-hidden p-0 transition-all duration-300 hover:shadow-lg"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="block"
              aria-label={`${project.name} case study`}
              tabIndex={-1}
            >
              <ProjectThumbnail project={project} />
            </Link>
            <CardHeader className="px-4 pt-4 pb-3">
              <CardTitle className="group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto px-4 pt-0 pb-4">
              <Button asChild className="w-full">
                <Link href={`/projects/${project.slug}`}>
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
