"use client";

import {
  CaseStudyTemplate,
  type LedgerRow,
  type RecordLink,
} from "@/components/case-study/case-study-template";
import {
  CaseStudyDiagramSection,
  diagramTocExtra,
} from "@/components/case-study/diagrams";
import { PROJECTS } from "@/lib/data/projects";

const project = PROJECTS.find((p) => p.id === "nagarro-design-leadership")!;

/**
 * Nagarro is the one case study whose rows carry their own outcome, so it runs
 * the three-column form: the lever I had, the instrument I used in place of
 * authority I did not have, and what it produced. Every figure below appears
 * exactly once on the page, attached to the work that produced it.
 */
const SPAN: readonly LedgerRow[] = [
  {
    problem: "Fifteen designers, reporting directly.",
    response:
      "A mentor-coaching program built on capability development rather than task management.",
    result: "+40% junior designer retention",
  },
  {
    problem:
      "Eighteen thousand more across 36 countries, and authority over none of them.",
    response:
      "The Digital Accessibility Strategy 2023, written as a framework teams could adopt rather than a gate they had to pass.",
    result: "+25% lead generation, on accessibility as differentiation",
  },
  {
    problem: "A design function read as an operational cost.",
    response:
      "Design positioned as a business driver, argued in public rather than enforced through process.",
    result: "50% brand recognition growth, 100+ qualified leads",
  },
  {
    problem: "No external voice for the practice.",
    response:
      "Fifteen-plus published articles and a keynote on inclusive design and global collaboration.",
    result: "10K+ subscribers, +40% website traffic",
  },
  {
    problem:
      "An accessibility framework with nothing outside the company to test it against.",
    response:
      "A partnership with ADT Health on eldercare accessibility, run as a real engagement.",
    result:
      "Validation in the field, and entry into healthcare and government work",
  },
];

/** Published work from the period. Every link resolves to a real document. */
const RECORD: readonly RecordLink[] = [
  {
    title: "Digital Accessibility Strategy 2023",
    url: "https://www.scribd.com/document/608106646/Nagarro-Digital-Accessibility-Strategy#fullscreen=1",
    description:
      "The enterprise accessibility framework itself, as it was circulated.",
  },
  {
    title: "Inclusive Design Keynote",
    url: "https://www.scribd.com/document/608112855/Inclusive-Design-Keynote#fullscreen=1",
    description:
      "The talk on designing across cultures with globally distributed teams.",
  },
  {
    title: "ADT Health Partnership",
    url: "https://www.scribd.com/document/640248976/Adt-Health#fullscreen=1",
    description:
      "The eldercare accessibility collaboration that tested the framework outside the company.",
  },
  {
    title: "Articles and writing",
    url: "https://medium.com/@randyellis",
    description:
      "Published pieces on design leadership, accessibility, and healthcare UX.",
  },
];

export default function NagarroClientPage() {
  return (
    <CaseStudyTemplate
      project={project}
      title="Head of Design for 18,000 people. Fifteen reported to me."
      lead="Nagarro, March to October 2022. Eight months, a company scaling from 15,000 people to 18,000, and a global design organization to build across 36 countries."
      proofPosition="top"
      proofLabel="The shape of the post"
      proof={[
        { value: "18,000+", context: "Nagarrians in the organization" },
        { value: "36", context: "Countries it operated in" },
        { value: "15", context: "Designers who reported to me" },
        { value: "8", context: "Months in the role" },
      ]}
      proofNote="Head of Design, Nagarro, March–October 2022."
      ledgerLabel="The span of control"
      ledgerHeads={[
        "What I was given",
        "What I did with it",
        "What it produced",
      ]}
      ledger={SPAN}
      record={RECORD}
      closeHeadline="If your design org has this shape, the same problem is already waiting."
      closeBody="Bring the design decision your roadmap is currently stuck on. We will work through it on the call, and you will leave with the answer whether or not we work together."
      tocExtra={diagramTocExtra("nagarro")}
    >
      {/* The span of control above states the numbers; this states what they
          cost. It follows the ledger because it is the argument the ledger
          implies, not a second telling of it. */}
      <CaseStudyDiagramSection slug="nagarro" />
    </CaseStudyTemplate>
  );
}
