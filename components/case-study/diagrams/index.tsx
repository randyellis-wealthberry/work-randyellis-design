"use client";

import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import type { TocItem } from "@/components/case-study/case-study-toc";

import { DiagramFigure } from "./diagram-figure";
import { EchoDriveHandoffDiagram } from "./echodrive-handoff";
import { GrowItRadiusDiagram } from "./growit-radius";
import { LedgerIqScopeDiagram } from "./ledgeriq-scope";

/**
 * Which case studies carry a diagram, keyed by slug.
 *
 * A diagram earns a place only when it illustrates a decision the case study
 * already makes in prose — never as a stack chart or a generic architecture
 * box. Slugs with no entry render nothing, which is why both the dedicated
 * pages and the generic `[slug]` route can call this unconditionally.
 */
type CaseStudyDiagram = {
  /** Section anchor. Must match the id the contents line points at. */
  id: string;
  /** Section heading, and the label the contents line shows. */
  label: string;
  caption: string;
  /** Width below which the figure scrolls rather than shrinking, in px. */
  minWidth: number;
  Diagram: () => React.ReactElement;
};

const DIAGRAMS: Record<string, CaseStudyDiagram> = {
  growit: {
    id: "diagram",
    label: "The widening radius",
    caption:
      "Strict location scoping is the right answer right up until it hands someone in a sparse region a blank screen. The rule refuses that trade: when local density can't fill a feed, scope steps outward on its own and re-queries until it clears. What it buys in content it spends in climate fit — the users who end up with the most feed are the ones whose feed applies to them least, and that was the cost of the decision, not a bug in it.",
    minWidth: 780,
    Diagram: GrowItRadiusDiagram,
  },
  echo: {
    id: "diagram",
    label: "The handoff",
    caption:
      "Neither app addresses the other. Dispatch writes a tender, the driver reads it and writes status and hours back, and dispatch reads live position instead of phoning for it. Designing that middle column first is what turned the integration into an early argument rather than a late discovery.",
    minWidth: 760,
    Diagram: EchoDriveHandoffDiagram,
  },
  ledgeriq: {
    id: "diagram",
    label: "The pipeline, and its ceiling",
    caption:
      "The engine ranks; the auditor decides. False positives the auditor marks return as training labels, so the loop closes forward rather than doubling back. The dashed cell is the scope limit — employee behaviour data was reachable at ingest and deliberately left out, capping on purpose what the system can catch.",
    minWidth: 660,
    Diagram: LedgerIqScopeDiagram,
  },
};

/** The contents-line entry for a slug's diagram, or nothing. */
export function diagramTocExtra(slug: string): readonly TocItem[] {
  const entry = DIAGRAMS[slug];
  return entry ? [{ id: entry.id, label: entry.label }] : [];
}

/** The diagram section for a slug, or nothing. */
export function CaseStudyDiagramSection({ slug }: { slug: string }) {
  const entry = DIAGRAMS[slug];
  if (!entry) return null;

  const { id, label, caption, minWidth, Diagram } = entry;

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={SECTION}>
      <SectionLabel id={`${id}-heading`}>{label}</SectionLabel>
      <DiagramFigure caption={caption} minWidth={minWidth}>
        <Diagram />
      </DiagramFigure>
    </section>
  );
}
