"use client";

import {
  CaseStudyTemplate,
  type RecordLink,
} from "@/components/case-study/case-study-template";
import { PROJECT_MEDIA } from "@/lib/data/project-media";
import type { Project } from "@/lib/data/types";

type ProjectDetailClientProps = {
  project: Project;
  relatedProjects?: Project[];
};

/**
 * Headlines and leads for the case studies that run on the generic route.
 * A case study's title should make a claim, so each is written rather than
 * assembled from `name` plus `subtitle`; anything without an entry falls back
 * to the project's own name and description.
 */
const COPY: Record<string, { title: string; lead: string; note?: string }> = {
  growit: {
    title: "Novice gardeners and horticultural experts, in one app.",
    lead: "GrowIt!, 2014 to 2016, as lead product designer across a 30-month engagement. The client and PM set the three-phase sequencing — community, then engagement, then deep horticultural integration — and I designed within it.",
    note: "Platform figures over the life of the product, on a Ball Horticultural Company partnership that predated my engagement.",
  },
  ohplays: {
    title: "Highlight reels, cut on a phone between classes.",
    lead: "Oh!Plays at Eight Bit Studios, 2017. On a team of six I owned the research — 15 high school students, iOS and Android, tested where they actually use their phones — and the design that came out of it.",
    note: "Research and usability figures from my engagement. The post-launch numbers — store rating, retention, total reels created — came from the product's life after I left, and are not claimed here.",
  },
  ledgeriq: {
    title: "Payroll anomalies a human auditor can actually act on.",
    lead: "LedgerIQ, 2023, as AI product lead and technical architect, covering both the product and the system design — how the detection models were structured, and how a person works alongside them.",
    note: "LedgerIQ is a composite: it draws on real payroll-fraud and applied-AI work, but it is assembled and anonymized rather than a single named engagement, and the figures should be read that way.",
  },
};

/**
 * External references, labelled for what they actually are. A link is only
 * listed when it resolves to something real.
 */
const RECORDS: Record<string, readonly RecordLink[]> = {
  growit: [
    {
      title: "GrowIt!",
      url: "https://www.growit.com/",
      description: "The product, live.",
    },
  ],
  ohplays: [
    {
      title: "Eight Bit Studios",
      url: "https://www.eightbitstudios.com/",
      description: "The studio the Oh!Plays work was delivered through.",
    },
  ],
  ledgeriq: [
    {
      title: "LedgerIQ dashboard",
      url: "https://ledgeriq-dashboard.vercel.app/",
      description: "The working dashboard.",
    },
    {
      title: "Source on GitHub",
      url: "https://github.com/randyellis-wealthberry/LedgerIQDashboard",
      description: "Implementation, including the detection pipeline.",
    },
  ],
};

export default function ProjectDetailClient({
  project,
}: ProjectDetailClientProps) {
  const copy = COPY[project.slug];
  const record = RECORDS[project.slug] ?? [];
  const fallbackNote = project.role
    ? `${project.role}, ${project.timeline}.`
    : project.timeline;

  return (
    <CaseStudyTemplate
      project={project}
      title={copy?.title ?? project.name}
      lead={copy?.lead ?? project.description}
      media={PROJECT_MEDIA[project.slug]}
      record={record}
      proofNote={copy?.note ?? fallbackNote}
      deliverablesLabel="What shipped"
    />
  );
}
