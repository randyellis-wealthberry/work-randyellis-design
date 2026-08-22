"use client";

import { SECTION, SectionLabel } from "@/components/case-study/section-chrome";
import type { TocItem } from "@/components/case-study/case-study-toc";

import { AddvancedConsentPathDiagram } from "./addvanced-consent-path";
import { GrowItProgressiveDisclosureDiagram } from "./growit-progressive-disclosure";
import { GrowItRankedCandidatesDiagram } from "./growit-ranked-candidates";
import { GrowItRatingVolumeDiagram } from "./growit-rating-volume";
import { GrowItWinterCycleDiagram } from "./growit-winter-cycle";
import { DiagramFigure } from "./diagram-figure";
import { EchoDriveHandoffDiagram } from "./echodrive-handoff";
import { GrowItRadiusDiagram } from "./growit-radius";
import { LedgerIqScopeDiagram } from "./ledgeriq-scope";
import { NagarroAuthorityDiagram } from "./nagarro-authority";
import { OhPlaysForkDiagram } from "./ohplays-fork";
import { RambisTwoLayersDiagram } from "./rambis-two-layers";
import { WaffleStreamDiagram } from "./waffle-generative-stream";

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
  ohplays: {
    id: "diagram",
    label: "Settling the argument",
    caption:
      "Gesture editing versus a conventional timeline was a matter of taste until both were actually built. The same fifteen students ran the same task on both, in hallways and libraries between class periods — and the session, not the meeting, is what closed the question. Paying to build a prototype that would be thrown away is what bought the right to commit to sports presets and never re-argue them.",
    minWidth: 840,
    Diagram: OhPlaysForkDiagram,
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
  addvanced: {
    id: "diagram",
    label: "One result, two screens",
    caption:
      "The impressive version of this feature and the shipped one return the same person. They differ only in whether the product can answer how it knew — and that answer is the entire product. Naming every hop costs the demo its magic moment and buys the thing a career tool actually runs on: nobody in testing called the feature invasive once the path was visible.",
    minWidth: 860,
    Diagram: AddvancedConsentPathDiagram,
  },
  nagarro: {
    id: "diagram",
    label: "The line a mandate could not cross",
    caption:
      "Head of Design for 18,000 people, direct authority over 15. A mandate crosses that line as paper and lands as compliance theatre, because nothing on the far side is mine to enforce. An argument crosses because teams pull it across themselves — slower, with no completion date and nothing clean to report against, and the only lever that compounds, since the adoption it wins is what funds the next round of it.",
    minWidth: 820,
    Diagram: NagarroAuthorityDiagram,
  },
  "rambis-ui": {
    id: "diagram",
    label: "The layer underneath",
    caption:
      "The two-layer API worked exactly as designed and still failed the test that mattered. At the edge of a default, developers went sideways to ask rather than down a layer to compose. The escape hatch was there the whole time and almost nobody found it — which makes this a documentation failure rather than an argument against the architecture, and mine to fix either way.",
    minWidth: 840,
    Diagram: RambisTwoLayersDiagram,
  },
  waffle: {
    id: "diagram",
    label: "When it becomes usable",
    caption:
      "A claim about streaming is a claim about time, so the argument here is a left edge rather than a pipeline. Plain text is unusable until the last token lands and the parse gate clears; typed UI parts hand back a working rubric the moment the first one arrives, and usable area accumulates from there. The ticks mark order, not milliseconds — no latency was measured, and the figure says so instead of implying a benchmark that never ran.",
    minWidth: 820,
    Diagram: WaffleStreamDiagram,
  },
};

/**
 * Figures that belong to one named decision rather than to the page.
 *
 * Keyed by slug, then by the decision's exact `title` from `lib/data/projects`.
 * These render inside the decision they draw — under its outcome, where the
 * reader already has the claim the figure argues — so they need no anchor of
 * their own and never appear in the contents line.
 *
 * The bar is the same one the section-level figures clear: a figure earns its
 * place only when it shows a mechanism the prose asserts, and it may chart only
 * numbers the page already shows. Statistics that live in the data file but
 * never reach a rendered surface stay out, because a chart makes any number
 * look measured.
 */
type DecisionFigure = {
  /** The claim the figure makes. Not a restatement of the decision above it. */
  caption: string;
  /** Width below which the figure scrolls rather than shrinking, in px. */
  minWidth: number;
  Diagram: () => React.ReactElement;
};

const DECISION_FIGURES: Record<string, Record<string, DecisionFigure>> = {
  growit: {
    "One interface for novices and experts, not two": {
      caption:
        "Two modes is the tidier answer on a whiteboard and it asks its question at the worst possible moment — before anyone has used the thing they are being asked to classify themselves against. One surface with depth that surfaces on demonstrated competence removes the question entirely, and hands the bill to the experienced gardener instead.",
      minWidth: 860,
      Diagram: GrowItProgressiveDisclosureDiagram,
    },
    "Ranked candidates over a single confident answer": {
      caption:
        "The model returns a ranked set whether or not the product shows one, so the only real question is who gets to see it. Keeping the top row and asserting it is the better first-run moment, right up against the six per cent where identification is wrong and the consequence is a watering schedule for a living thing. Making the user pick costs a tap on every identification and is what gives community verification an act to rest on.",
      minWidth: 860,
      Diagram: GrowItRankedCandidatesDiagram,
    },
    "A rating mechanic designed for volume, not depth": {
      caption:
        "Height is what one contribution tells you; width is how many contributions you get. A written review wins on height and loses the argument, because the people who would write one are a rounding error against the people who will tap. Ten ratings per photo is the exchange working exactly as designed — worse signal per interaction, and vastly more of it.",
      minWidth: 900,
      Diagram: GrowItRatingVolumeDiagram,
    },
    "Treating winter as planning season, not dead season": {
      caption:
        "A seasonal app has no winter state — it has a gap, and a return edge that runs through re-acquisition every spring. Giving winter something to be, rather than something to wait out, closes the same loop inside the product. It made the trough shallower rather than flat, which is why the figure draws a state machine and not an engagement curve nobody measured.",
      minWidth: 880,
      Diagram: GrowItWinterCycleDiagram,
    },
  },
};

/** The figure that draws one named decision, already framed. Or nothing. */
export function decisionFigure(
  slug: string,
  decisionTitle: string,
): React.ReactElement | null {
  const entry = DECISION_FIGURES[slug]?.[decisionTitle];
  if (!entry) return null;

  const { caption, minWidth, Diagram } = entry;

  return (
    <DiagramFigure caption={caption} label={decisionTitle} minWidth={minWidth}>
      <Diagram />
    </DiagramFigure>
  );
}

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
      <DiagramFigure caption={caption} label={label} minWidth={minWidth}>
        <Diagram />
      </DiagramFigure>
    </section>
  );
}
