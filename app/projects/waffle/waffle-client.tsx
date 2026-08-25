"use client";

import {
  CaseStudyTemplate,
  SectionLabel,
  SECTION,
  ROW,
  type Exhibit,
  type LedgerRow,
  type PageAction,
} from "@/components/case-study/case-study-template";
import {
  CaseStudyDiagramSection,
  diagramTocExtra,
} from "@/components/case-study/diagrams";
import { PROJECT_MEDIA } from "@/lib/data/project-media";
import { PROJECTS } from "@/lib/data/projects";
import { trackEvent } from "@/lib/analytics";

const project = PROJECTS.find((p) => p.id === "waffle")!;

const CATEGORY = "waffle_product_page";
const LIVE_URL = "https://waffle.cards";
const SIGNUP_URL = "https://app.waffle.cards/sign-up";

/**
 * Waffle is the one surface here selling something other than a conversation,
 * so the product carries the primary action and the booking call steps aside.
 */
const ACTIONS: readonly PageAction[] = [
  {
    label: "View the live product",
    href: LIVE_URL,
    external: true,
    onClick: () =>
      trackEvent("waffle_view_live", CATEGORY, "View live product CTA"),
  },
  {
    label: "Try it free",
    href: SIGNUP_URL,
    external: true,
    onClick: () => trackEvent("waffle_try_free", CATEGORY, "Try free CTA"),
  },
];

const SITUATION =
  "Most hiring teams either write an interview scorecard by hand the night before the panel meets, or run the interview without one. The first costs an afternoon per role. The second costs consistency — five interviewers scoring five different things, and no defensible record of why a candidate was turned down. The tools that already existed assumed a recruiter who arrives with a competency model in hand; the recruiters I tested with did not have one.";

/** Every shipped capability, stated as the problem it answers. */
const LEDGER: readonly LedgerRow[] = [
  {
    problem:
      "A rubric has to exist before the panel meets, and nobody has an afternoon to write one.",
    response:
      "A chat flow that takes the job description as its only required input and returns weighted competencies, behavioral questions, and scoring rubrics in two to four minutes.",
  },
  {
    problem:
      "Every other AI tool streams text into a textarea and calls the job done.",
    response:
      "Generative UI on AI SDK 6: each competency arrives as an interactive React component that builds live, so the rubric is a working document from the first token rather than a transcript to clean up.",
  },
  {
    problem:
      "Hiring managers think in problems and constraints, not in form fields.",
    response:
      "A conversational input instead of a structured form, with requirements extracted mid-conversation — so nuance that a five-field form would have dropped survives into the scorecard.",
  },
  {
    problem:
      "Generated interview questions carry bias that somebody has to catch downstream.",
    response:
      "EEOC-compliant, bias-reducing guardrails written into the generation prompts, running on Claude — picked over GPT-4 after testing both across twenty job descriptions.",
  },
  {
    problem: "A scorecard is worth nothing if it stays inside the tool.",
    response:
      "Print-ready PDF export, plus transcript ingestion from Granola, Otter, Fathom, Fireflies, Gong, and twenty-five more note-taking tools.",
  },
  {
    problem:
      "Hiring is a team sport, and a single-user tool forces screenshots and email threads.",
    response:
      "Multi-tenant organizations with role-based access and a shared scorecard library, built into the first version instead of retrofitted after the first team asked for it.",
  },
];

const PROOF: readonly Exhibit[] = [
  { value: "2–4 min", context: "From job description to a complete scorecard" },
  {
    value: "6.2",
    context:
      "Average competencies per scorecard from the chat flow, against 4.1 from the form prototype",
  },
  {
    value: "11:1",
    context: "Recruiters who preferred the chat flow to a form, in testing",
  },
  {
    value: "+23%",
    context:
      "Conversion after removing prompt editing and hardening the guardrails instead",
  },
];

const PROOF_NOTE =
  "Figures from the product's own instrumentation and from pre-launch testing with twelve recruiters, 2025. Waffle is live and paid; revenue and customer counts are not published here.";

/** The sequence is the product, so the steps keep their order and their count. */
const STEPS = [
  {
    title: "Paste the job description",
    description:
      "The role's own posting is the only required input. Waffle reads it for the competencies that actually separate candidates.",
  },
  {
    title: "Watch the scorecard build",
    description:
      "Weighted competencies, behavioral questions, and scoring rubrics stream in as interactive components while you read them.",
  },
  {
    title: "Export it, or hand it to the panel",
    description:
      "Export a print-ready PDF for the ATS record, or share the scorecard inside Waffle with everyone interviewing.",
  },
] as const;

export default function WaffleClientPage() {
  return (
    <CaseStudyTemplate
      project={project}
      title="Interview scorecards, written before the panel meets."
      lead="Waffle, 2025 to now — a live, paid AI product I designed and built end to end: research, product, interface, frontend, backend, payments, and the support inbox. Paste a job description and the rubric streams back in two to four minutes."
      actions={ACTIONS}
      situation={SITUATION}
      ledger={LEDGER}
      ledgerLabel="What the product had to answer"
      proof={PROOF}
      proofNote={PROOF_NOTE}
      media={PROJECT_MEDIA.waffle}
      mediaLabel="The product"
      technologiesLabel="Built with"
      reflectionLabel="Looking back"
      closeHeadline="The fastest way to judge it is to point it at a role you are actually hiring for."
      closeBody="Paste a job description at waffle.cards and watch the scorecard build itself. Free tier, no credit card."
      closeActions={ACTIONS}
      tocExtra={[
        { id: "how-it-runs", label: "How it runs" },
        ...diagramTocExtra("waffle"),
      ]}
    >
      <section
        id="how-it-runs"
        aria-labelledby="how-it-runs-heading"
        className={SECTION}
      >
        <SectionLabel id="how-it-runs-heading">How it runs</SectionLabel>
        <ol className="mt-8">
          {STEPS.map((step, index) => (
            <li key={step.title} className={ROW}>
              <h3 className="flex gap-4 text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                <span
                  aria-hidden="true"
                  className="text-zinc-400 tabular-nums dark:text-zinc-500"
                >
                  {index + 1}
                </span>
                {step.title}
              </h3>
              <p className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* The steps above say what happens; this says when, which is the whole
          case for streaming typed parts instead of text. */}
      <CaseStudyDiagramSection slug="waffle" />
    </CaseStudyTemplate>
  );
}
