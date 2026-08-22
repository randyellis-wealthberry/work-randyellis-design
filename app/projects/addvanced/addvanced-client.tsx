"use client";

import {
  CaseStudyTemplate,
  SectionLabel,
  SECTION,
  ROW,
} from "@/components/case-study/case-study-template";
import {
  CaseStudyDiagramSection,
  diagramTocExtra,
} from "@/components/case-study/diagrams";
import { WireframesSection } from "@/components/ui/wireframes-section";
import { PROJECT_MEDIA } from "@/lib/data/project-media";
import { PROJECTS } from "@/lib/data/projects";

const project = PROJECTS.find((p) => p.id === "addvanced")!;

/**
 * The IDI read of the field, kept as three axes rather than three cards: each
 * axis is a list of what was already there and how it scored.
 */
const IDI = [
  {
    axis: "Innovation",
    question: "Who was actually doing something new?",
    rows: [
      { subject: "Trello, used as a tracker", reading: "Low" },
      { subject: "Huntr CRM, the direct competitor", reading: "Medium" },
      { subject: "Addvance, as proposed", reading: "High" },
    ],
  },
  {
    axis: "Disruption",
    question: "What did nobody in the category offer?",
    rows: [
      { subject: "Social intelligence", reading: "New to the category" },
      { subject: "Real-time tracking", reading: "New to the category" },
      { subject: "Network mapping", reading: "New to the category" },
    ],
  },
  {
    axis: "Integration",
    question: "What would the product have to speak to?",
    rows: [
      { subject: "LinkedIn API", reading: "In the integration plan" },
      { subject: "Indeed API", reading: "In the integration plan" },
      { subject: "Google OAuth", reading: "In the integration plan" },
    ],
  },
] as const;

/** The four research tracks, each with what it looked at. */
const RESEARCH = [
  {
    title: "Competitive analysis",
    body: "Huntr CRM as the direct competitor and Trello as the indirect one, with Apple Notes and LinkedIn read as aspirational benchmarks — Notes for how little interface a daily tool can get away with, LinkedIn for social intelligence.",
  },
  {
    title: "User research",
    body: "Interviews with job seekers in and out of tech: professionals mid-career, career changers coming from outside the sector, and recent graduates.",
  },
  {
    title: "Behavioral analysis",
    body: "Where the search actually happens — social media usage patterns, professional networking habits, and how much of the work gets done on a phone.",
  },
  {
    title: "Design goals",
    body: "Reachability, so every function sits in a thumb-friendly zone. Heuristic compliance against Nielsen's principles. Direct navigation, meaning the fewest steps to a core task. And purposeful tasks — every interaction serving career advancement rather than record-keeping.",
  },
] as const;

/** What the research concluded, in the order it changed the design. */
const INSIGHTS = [
  "Job seekers wanted always-on career intelligence, not another place to log what they had already done.",
  "Social networking integration was the route to warm introductions, which meant relationship mapping had to be a first-class feature rather than a contact list.",
  "The search happens on a phone between other obligations, so mobile-first was a constraint rather than a preference.",
  "Comparison was missing everywhere — compensation, perks, and timeline sat in the user's head, not in any tool.",
] as const;

/** Usability testing, run in Maze with moderated sessions alongside. */
const TEST_SETUP = [
  {
    term: "14 participants",
    value: "Moderated usability testing in an open lab environment.",
  },
  {
    term: "4 task scenarios",
    value: "The core user journeys, run unmoderated through Maze.",
  },
  {
    term: "Cross-platform",
    value: "MAC and PC devices, on virtual desktop and laptop sessions.",
  },
  {
    term: "No time limits",
    value:
      "Participants worked at their own pace, so hesitation showed up as hesitation rather than as a failed task.",
  },
] as const;

const TASK_RESULTS = [
  { task: "Import a job post", success: "50%", usability: "74" },
  { task: "View your resume", success: "64%", usability: "82" },
  { task: "View your network", success: "86%", usability: "93" },
  { task: "View social activity", success: "86%", usability: "93" },
] as const;

const WHAT_BROKE = [
  "Half the testers left the expected path on job import.",
  "Seven testers were fully lost inside task one.",
  "60% of missions went unfinished on the flows that were failing.",
] as const;

const WHAT_HELD = [
  "The optimized paths tested eight times better than the ones they replaced.",
  "86% and above on the networking features.",
  "93 and above on usability for social intelligence.",
] as const;

/** What the sprint established beyond the prototype itself. */
const DESIGN_IMPACT = [
  {
    term: "Career intelligence, not job tracking",
    value:
      "The sprint established the category distinction the product was built on: insight about what to do next, rather than a record of what was already done.",
  },
  {
    term: "Social networking as core, not adjacent",
    value:
      "Referral discovery moved from a feature idea to the spine of the product, which is what the testing responded to most strongly.",
  },
  {
    term: "Mobile-first, validated",
    value:
      "A professional tool built phone-first held up under testing, against a category still shipping desktop-first interfaces.",
  },
  {
    term: "Level AA as the floor",
    value:
      "Accessibility standards were set at Level AA for an enterprise career tool rather than negotiated at the end.",
  },
] as const;

/** The lab the sprint ran inside, which set its pace. */
const LAB = [
  {
    term: "Where",
    value: "Alight Solutions Innovation Lab, at 1871 in Chicago, Illinois.",
  },
  {
    term: "Lab mission",
    value:
      "Tip of the spear for B2C and B2B digital product creation, using lean startup and UX methodologies.",
  },
  {
    term: "Approach",
    value: "Fast movers: collect data, synthesize, take action.",
  },
  {
    term: "Team structure",
    value:
      "Cross-functional, with daily standups and rapid iteration cycles across ten working days.",
  },
] as const;

/** The toolkit, stated as what each tool was doing in the sprint. */
const TOOLS = [
  {
    term: "InVision",
    value:
      "High-fidelity prototyping, straight past wireframing: interactive mobile-first prototypes, OAuth mockups, and social intelligence demos, built for stakeholder validation and user testing.",
  },
  {
    term: "Miro",
    value:
      "Wireframing and cross-functional collaboration — user flow mapping, the IDI framework visualization, and the brainstorming sessions that produced both.",
  },
  {
    term: "Maze",
    value:
      "Unmoderated usability testing across four core scenarios, with heatmap analysis and user paths behind the success-rate numbers above.",
  },
  {
    term: "Whiteboard and Sharpie",
    value:
      "Initial conceptualization: Fitts's Law interaction zones, mobile interface sketching, and the alignment sessions that made the rest go fast.",
  },
] as const;

export default function AddvancedClient() {
  const { processStory } = project;

  return (
    <CaseStudyTemplate
      project={project}
      title="A benefits product, designed and validated in two weeks."
      lead="Addvance, built inside Alight's innovation lab as a two-week sprint: research, high-fidelity prototype, and usability validation, with the constraint that the sprint could not slip."
      media={PROJECT_MEDIA.addvanced}
      deliverablesLabel="What shipped"
      reflectionLabel="Design leadership reflection"
      closeHeadline="Two weeks is enough to know whether an idea survives contact with users."
      tocExtra={[
        { id: "field", label: "How the field looked" },
        { id: "research", label: "The research" },
        { id: "wireframes", label: "Wireframes" },
        { id: "testing", label: "How it was tested" },
        ...diagramTocExtra("addvanced"),
        { id: "established", label: "What it established" },
      ]}
    >
      {processStory?.methodology && (
        <section
          id="methodology"
          aria-labelledby="methodology-heading"
          className={SECTION}
        >
          <SectionLabel id="methodology-heading">
            How the ten days ran
          </SectionLabel>
          <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {processStory.methodology}
          </p>
        </section>
      )}

      <section id="field" aria-labelledby="field-heading" className={SECTION}>
        <SectionLabel id="field-heading">How the field looked</SectionLabel>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The competitive read used three axes — innovation, disruption, and
          integration — because the question was not who was winning the
          category, but which part of it nobody had claimed.
        </p>
        <div className="mt-10 space-y-10">
          {IDI.map((group) => (
            <div key={group.axis}>
              <h3 className="text-base font-medium text-zinc-900 dark:text-white">
                {group.axis}
              </h3>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                {group.question}
              </p>
              <dl className="mt-4">
                {group.rows.map((row) => (
                  <div
                    key={row.subject}
                    className="grid grid-cols-1 border-t border-zinc-200 py-4 sm:grid-cols-[minmax(0,22rem)_1fr] dark:border-zinc-800"
                  >
                    <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                      {row.subject}
                    </dt>
                    <dd className="mt-1 text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
                      {row.reading}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      <section
        id="research"
        aria-labelledby="research-heading"
        className={SECTION}
      >
        <SectionLabel id="research-heading">
          What the research looked at
        </SectionLabel>
        <dl className="mt-8">
          {RESEARCH.map((track) => (
            <div key={track.title} className={ROW}>
              <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                {track.title}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {track.body}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-12 text-base font-medium text-zinc-900 dark:text-white">
          What it concluded
        </h3>
        <ul className="mt-4">
          {INSIGHTS.map((insight) => (
            <li
              key={insight}
              className="max-w-[70ch] border-t border-zinc-200 py-4 text-base text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
            >
              {insight}
            </li>
          ))}
        </ul>
      </section>

      {/* High-fidelity wireframes from the sprint (A0, A1, A5, A17c) */}
      <WireframesSection />

      <section
        id="testing"
        aria-labelledby="testing-heading"
        className={SECTION}
      >
        <SectionLabel id="testing-heading">How it was tested</SectionLabel>
        <dl className="mt-8">
          {TEST_SETUP.map((item) => (
            <div key={item.term} className={ROW}>
              <dt className="text-base font-medium text-zinc-900 tabular-nums sm:pr-8 dark:text-white">
                {item.term}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <h3 className="mt-12 text-base font-medium text-zinc-900 dark:text-white">
          Task performance
        </h3>
        <table className="mt-4 w-full max-w-[46rem] text-base">
          <caption className="sr-only">
            Success rate and usability score for each of the four tested tasks
          </caption>
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800">
              <th
                scope="col"
                className="py-3 text-left text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
              >
                Task
              </th>
              <th
                scope="col"
                className="py-3 pl-4 text-right text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
              >
                Success
              </th>
              <th
                scope="col"
                className="py-3 pl-4 text-right text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
              >
                Usability
              </th>
            </tr>
          </thead>
          <tbody>
            {TASK_RESULTS.map((result) => (
              <tr
                key={result.task}
                className="border-b border-zinc-200 dark:border-zinc-800"
              >
                <th
                  scope="row"
                  className="py-4 pr-4 text-left text-base font-normal text-zinc-500 dark:text-zinc-400"
                >
                  {result.task}
                </th>
                <td className="py-4 pl-4 text-right font-medium text-zinc-900 tabular-nums dark:text-white">
                  {result.success}
                </td>
                <td className="py-4 pl-4 text-right font-medium text-zinc-900 tabular-nums dark:text-white">
                  {result.usability}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
          <div>
            <h3 className="text-base font-medium text-zinc-900 dark:text-white">
              Where it broke
            </h3>
            <ul className="mt-4">
              {WHAT_BROKE.map((finding) => (
                <li
                  key={finding}
                  className="border-t border-zinc-200 py-4 text-base text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {finding}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-base font-medium text-zinc-900 dark:text-white">
              Where it held
            </h3>
            <ul className="mt-4">
              {WHAT_HELD.map((finding) => (
                <li
                  key={finding}
                  className="border-t border-zinc-200 py-4 text-base text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {finding}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-10 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Heatmaps and recorded user paths are where those numbers came from:
          they showed which screens held attention and exactly where people lost
          the thread, which is what the second round of navigation changes was
          aimed at.
        </p>
      </section>

      {/* The consent decision, drawn. It sits after the testing section because
          its claim is a testing result: the same suggestion read as
          surveillance unexplained and did not once the path was visible. */}
      <CaseStudyDiagramSection slug="addvanced" />

      <section
        id="established"
        aria-labelledby="established-heading"
        className={SECTION}
      >
        <SectionLabel id="established-heading">
          What the sprint established
        </SectionLabel>
        <dl className="mt-8">
          <div className={ROW}>
            <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
              A B2C market worth entering
            </dt>
            <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
              The opportunity validated outside Alight&rsquo;s enterprise focus,
              on a consumer audience the business had not been designing for.
            </dd>
          </div>
          <div className={ROW}>
            <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
              A white-label foundation
            </dt>
            <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
              The same prototype read as a B2B offering the company could put
              its clients&rsquo; names on, which is how it was pitched onward.
            </dd>
          </div>
          {DESIGN_IMPACT.map((item) => (
            <div key={item.term} className={ROW}>
              <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                {item.term}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {processStory?.stakeholderQuotes &&
        processStory.stakeholderQuotes.length > 0 && (
          <section
            id="quotes"
            aria-labelledby="quotes-heading"
            className={SECTION}
          >
            <SectionLabel id="quotes-heading">What the room said</SectionLabel>
            <div className="mt-8">
              {processStory.stakeholderQuotes.map((quote) => (
                <figure
                  key={quote.author}
                  className="border-t border-zinc-200 py-8 dark:border-zinc-800"
                >
                  <blockquote className="max-w-[62ch] text-lg leading-relaxed text-zinc-900 dark:text-white">
                    &ldquo;{quote.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {quote.author}
                    </span>
                    {quote.role ? ` — ${quote.role}` : ""}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}

      <section id="lab" aria-labelledby="lab-heading" className={SECTION}>
        <SectionLabel id="lab-heading">The lab this ran inside</SectionLabel>
        <dl className="mt-8">
          {LAB.map((item) => (
            <div key={item.term} className={ROW}>
              <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                {item.term}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        {processStory?.keyInsights && processStory.keyInsights.length > 0 && (
          <>
            <h3 className="mt-12 text-base font-medium text-zinc-900 dark:text-white">
              What I took from it
            </h3>
            <ul className="mt-4">
              {processStory.keyInsights.map((insight) => (
                <li
                  key={insight}
                  className="max-w-[70ch] border-t border-zinc-200 py-4 text-base text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
                >
                  {insight}
                </li>
              ))}
            </ul>
          </>
        )}

        <h3 className="mt-12 text-base font-medium text-zinc-900 dark:text-white">
          What it was built with
        </h3>
        <dl className="mt-4">
          {TOOLS.map((tool) => (
            <div key={tool.term} className={ROW}>
              <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                {tool.term}
              </dt>
              <dd className="mt-2 max-w-[62ch] text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                {tool.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </CaseStudyTemplate>
  );
}
