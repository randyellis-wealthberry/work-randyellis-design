"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { CTASection } from "@/components/ui/cta-section";
import { Badge } from "@/components/ui/badge";
import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";
import { filterProjectsByCategory } from "@/lib/project-utils";

// Visible At Zero (DESIGN.md): the hidden state stays fully opaque so the page
// paints complete on first byte — entrance motion only settles the y-offset.
const VARIANTS_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VARIANTS_ITEM = {
  hidden: { opacity: 1, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

/**
 * The record stores an enum; a label is authored text. Sentence case, spelled
 * out — "in-progress" is a database value, not something a reader should see.
 */
const STATUS_LABEL: Record<Project["status"], string> = {
  completed: "Completed",
  "in-progress": "In progress",
  concept: "Concept",
};

/**
 * One project as a row in a hairline list — the Recommendations List grammar
 * (DESIGN.md), applied to the index. The name is the only link in the row, its
 * description sits in the second column. The term column is 18rem, not the
 * signature's 22rem: this route keeps the narrow 768px measure, where 22rem
 * resolves to a literal half-and-half split — the case the Label-Width Rule
 * warns about — and leaves the description at roughly 45ch. The row
 * carries just the facts that help a reader choose what to read: what kind of
 * work it was, where it stands, and the one result the case study argues.
 */
function ProjectRow({ project }: { project: Project }) {
  const headline = project.metrics?.[0];

  return (
    <motion.li
      variants={VARIANTS_ITEM}
      className="border-t border-zinc-200 dark:border-zinc-800"
    >
      <Link
        href={`/projects/${project.slug}`}
        className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,18rem)_1fr] dark:focus-visible:ring-white"
      >
        <span className="flex flex-col gap-2 sm:pr-8">
          <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
            {project.name}
            <ArrowRight
              aria-hidden="true"
              className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
            />
          </span>
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <span>{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>{STATUS_LABEL[project.status]}</span>
            {/* The single hue exception in the whole system: a product a
                reader can open today is a different kind of claim, and it is
                the one place the zinc ramp cannot say what it means. */}
            {project.isLiveProduct && (
              <Badge className="border-transparent bg-amber-600 text-zinc-950 dark:bg-amber-500">
                Live Product
              </Badge>
            )}
            {/* An unlabelled composite is the thing this badge exists to
                prevent — it is a disclosure, not decoration. */}
            {project.isComposite && (
              <Badge variant="secondary">Composite</Badge>
            )}
          </span>
        </span>

        <span className="mt-3 flex flex-col gap-2 sm:mt-0">
          <span className="max-w-[62ch] text-base text-zinc-500 dark:text-zinc-400">
            {project.description}
          </span>
          {headline && (
            <span className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-900 tabular-nums dark:text-white">
                {headline.value}
              </span>{" "}
              {headline.label}
            </span>
          )}
        </span>
      </Link>
    </motion.li>
  );
}

export default function ProjectsClient() {
  // URL-driven filter backing the WebSite SearchAction (/projects?category=…) — Phase 10 D-13;
  // keep the param name in sync with lib/seo/json-ld.ts
  const searchParams = useSearchParams();
  const categoryTerm = searchParams?.get("category")?.trim() ?? "";
  const visibleProjects = filterProjectsByCategory(PROJECTS, categoryTerm);

  return (
    <motion.main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={VARIANTS_ITEM}>
        {/* BreadcrumbNav renders its own home link, so the trail starts at
            Projects — the page never ships two links to the same destination.
            It is also what the BreadcrumbList schema in page.tsx describes. */}
        <BreadcrumbNav
          className="mb-8"
          items={[{ label: "Projects", current: true }]}
        />

        <ScrambleSectionTitle
          as="h1"
          className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white"
        >
          Projects
        </ScrambleSectionTitle>

        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          A collection of projects showcasing my work in AI-powered product
          design, design systems, and innovative user experiences.
        </p>

        {categoryTerm && (
          <p
            className="mt-4 text-sm text-zinc-500 dark:text-zinc-400"
            role="status"
          >
            {visibleProjects.length === 0 ? (
              <>
                No projects match &quot;{categoryTerm}&quot;.{" "}
                <Link
                  href="/projects"
                  className="-my-3 inline-flex min-h-[44px] items-center font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
                >
                  Clear filter
                </Link>
              </>
            ) : (
              <>
                Showing {visibleProjects.length}{" "}
                {visibleProjects.length === 1 ? "project" : "projects"} matching
                &quot;{categoryTerm}&quot; ·{" "}
                <Link
                  href="/projects"
                  className="-my-3 inline-flex min-h-[44px] items-center font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
                >
                  Clear filter
                </Link>
              </>
            )}
          </p>
        )}
      </motion.div>

      <motion.section
        id="case-studies"
        aria-labelledby="case-studies-heading"
        variants={VARIANTS_ITEM}
        className={SECTION}
      >
        <SectionLabel id="case-studies-heading">Case studies</SectionLabel>
        {visibleProjects.length > 0 && (
          <motion.ul
            variants={VARIANTS_CONTAINER}
            className="mt-6 border-b border-zinc-200 dark:border-zinc-800"
          >
            {visibleProjects.map((project) => (
              <ProjectRow key={project.id} project={project} />
            ))}
          </motion.ul>
        )}
      </motion.section>

      {/* Contact CTA */}
      <CTASection />
    </motion.main>
  );
}
