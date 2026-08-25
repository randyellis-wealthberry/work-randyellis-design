"use client";

import {
  CaseStudyTemplate,
  SectionLabel,
  SECTION,
  ROW,
  type Capability,
} from "@/components/case-study/case-study-template";
import {
  CaseStudyDiagramSection,
  diagramTocExtra,
} from "@/components/case-study/diagrams";
import { PROJECT_MEDIA } from "@/lib/data/project-media";
import { PROJECTS } from "@/lib/data/projects";

const project = PROJECTS.find((p) => p.slug === "echo")!;

/**
 * The situation as written for this page — more specific about Echo Global's
 * scale than the shared project record is.
 */
const SITUATION =
  "The shipping industry relied on outdated coordination methods, creating communication gaps between shippers, drivers, and dispatch teams. Echo Global Logistics, with over 30 offices nationwide and 40,000+ transportation providers, struggled with operational inefficiencies, compliance challenges with new ELD regulations, and limited shipment visibility. The traditional approaches were causing stress on call centers, manual process errors, and missed opportunities for revenue growth in the competitive logistics market.";

/** What the two platforms actually do, preserved from the original page. */
const CAPABILITIES: readonly Capability[] = [
  {
    title: "ELD Mandate Compliance",
    description:
      "Electronic logging system that automatically tracks driving hours and ensures compliance with federal regulations, eliminating manual logging processes and reducing compliance violations by 100%.",
  },
  {
    title: "Real-time Shipment Tracking",
    description:
      "GPS-enabled tracking system providing live location updates and delivery status notifications, improving truckload visibility and reducing call-center stress by automating status inquiries.",
  },
  {
    title: "Mobile Driver Communication",
    description:
      "In-app messaging platform connecting drivers with dispatch teams, enabling instant issue reporting, job sharing, and seamless coordination across the entire logistics network.",
  },
  {
    title: "Interactive Driver Onboarding",
    description:
      "Comprehensive tutorial system with step-by-step guidance for new drivers, reducing training time and ensuring consistent adoption of digital tools across diverse driver demographics.",
  },
  {
    title: "Self-serve LTL Booking",
    description:
      "Streamlined Less Than Truckload shipment booking application with automated pricing and scheduling, replacing a call-center-dependent workflow.",
  },
];

/** Named once so the section heading and the contents line cannot drift. */
const QUOTES_LABEL = "What the client said";

export default function EchoClientPage() {
  const quotes = project.processStory?.stakeholderQuotes ?? [];

  return (
    <CaseStudyTemplate
      project={project}
      title="Two platforms, designed from inside the truck cab."
      lead="EchoDrive for Echo Global Logistics — a driver app and a dispatch web application, built from on-site research with the people who had to use them."
      situation={SITUATION}
      proof={[
        { value: "100%", context: "ELD compliance" },
        { value: "2", context: "Platforms designed" },
        { value: "On-site", context: "Research method" },
      ]}
      proofNote="Figures from the design engagement across alpha, beta, and launch."
      media={PROJECT_MEDIA.echo}
      capabilities={CAPABILITIES}
      capabilitiesLabel="What EchoDrive does"
      deliverablesLabel="What shipped"
      closeHeadline="Field research is the cheapest part of a logistics build, and the part most teams skip."
      tocExtra={[
        ...diagramTocExtra("echo"),
        ...(quotes.length > 0 ? [{ id: "client", label: QUOTES_LABEL }] : []),
      ]}
    >
      {/* The handoff this page argues for, drawn. It reads as the synthesis of
          the decisions above, so it opens the page's own sections. */}
      <CaseStudyDiagramSection slug="echo" />

      {quotes.length > 0 && (
        <section
          id="client"
          aria-labelledby="client-heading"
          className={SECTION}
        >
          <SectionLabel id="client-heading">{QUOTES_LABEL}</SectionLabel>
          {/* Three quotes, all readable at once. A carousel would have put two
              of the three behind a control on the one section of the page
              whose whole value is that someone else said it. */}
          <div className="mt-6">
            {quotes.map((quote) => (
              <figure key={quote.quote} className={ROW}>
                {/* The words are the assertion, so they carry the weight; the
                    attribution stays in the subordinate voice. */}
                <figcaption className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                  <span className="block text-zinc-900 dark:text-white">
                    {quote.author}
                  </span>
                  {quote.role}
                </figcaption>
                <blockquote className="mt-2 max-w-[68ch] text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
                  {`“${quote.quote}”`}
                </blockquote>
              </figure>
            ))}
          </div>
        </section>
      )}
    </CaseStudyTemplate>
  );
}
