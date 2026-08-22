"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { AnimatedMetricValue } from "@/components/ui/animated-metric-value";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AnimatedAsset } from "@/components/ui/animated-asset";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { ProjectRecommendations } from "@/components/ui/project-recommendations";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { BorderTrail } from "@/components/motion-primitives/border-trail";
import { InView } from "@/components/motion-primitives/in-view";
import { CalButton } from "@/components/booking/cal-embed";
import { CaseStudyTOC, type TocItem } from "./case-study-toc";
import { DecisionCallout } from "./decision-callout";
import { decisionFigure } from "./diagrams";
import { ReflectionBlock } from "./reflection-block";
import { RoleNarrativeSection } from "./role-narrative-section";
import { SectionLabel, SECTION, LABEL, ROW } from "./section-chrome";
import { trackContactIntent } from "@/lib/analytics";
import { PROJECTS } from "@/lib/data/projects";
import type { Project } from "@/lib/data/types";

const BOOKING_URL = "https://cal.com/randyellis/30min";

export type LedgerRow = {
  /** The condition being answered. Renders in the subordinate voice. */
  problem: string;
  /** What was done about it. Renders as the assertion. */
  response: string;
  /** Optional third column; only Nagarro carries a per-row outcome today. */
  result?: string;
};

export type Exhibit = { value: string; context: string };

export type MediaItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind?: "image" | "video";
  poster?: string;
  caption?: string;
  /**
   * How the asset meets its frame. Evidence — product screens, boards,
   * whiteboards — is contained at its own proportions, which is the default.
   * `cover` is for photography, where the subject survives a crop.
   */
  fit?: "contain" | "cover";
};

export type RecordLink = { title: string; url: string; description?: string };

export type Capability = { title: string; description: string };

/**
 * A link the page asks the reader to take. The first in a list is the primary
 * and the rest are secondary, so a surface cannot accidentally ship two
 * primaries. Live products carry their own analytics through `onClick`.
 */
export type PageAction = {
  label: string;
  href: string;
  /** Opens in a new tab and states so for screen readers. */
  external?: boolean;
  onClick?: () => void;
};

export type CaseStudyTemplateProps = {
  project: Project;
  title: string;
  lead: string;
  /** Shown under the lead. For a live product, the product is the action. */
  actions?: readonly PageAction[];
  /** Replaces the booking pair in the close when the surface sells something else. */
  closeActions?: readonly PageAction[];
  /** Defaults to the project's own background paragraph. */
  situation?: string;
  situationLabel?: string;
  /** Defaults to the project's roleNarrative, shown above the ledger. */
  intro?: string;
  ledgerLabel?: string;
  ledgerHeads?: readonly string[];
  /** Defaults to challenges zipped against solutions by index. */
  ledger?: readonly LedgerRow[];
  /** Defaults to the first four metrics. */
  proof?: readonly Exhibit[];
  proofLabel?: string;
  proofNote?: string;
  /** Nagarro states the scope of the post before the argument rather than after. */
  proofPosition?: "top" | "after-ledger";
  media?: readonly MediaItem[];
  mediaLabel?: string;
  capabilities?: readonly Capability[];
  capabilitiesLabel?: string;
  record?: readonly RecordLink[];
  deliverablesLabel?: string;
  /** "Methods" on a research engagement; the stack on a product that shipped. */
  technologiesLabel?: string;
  /** Pass null when a page renders its own reflection section. */
  reflection?: string | null;
  reflectionLabel?: string;
  closeHeadline?: string;
  closeBody?: string;
  /** Extra sections a single case study owns, rendered before the close. */
  children?: React.ReactNode;
  /**
   * Anchors for the sections `children` brings, so a page's own sections appear
   * in the contents line. Each id must match that section's `id`.
   */
  tocExtra?: readonly TocItem[];
};

// Re-exported so a page can keep importing its section chrome from the
// template it renders through; the definitions live in section-chrome.
export { SectionLabel, SECTION, LABEL, ROW };
export type { TocItem };

/**
 * The frame every piece of evidence sits in: a full hairline on a Wash ground,
 * matching the wireframe figures. One vocabulary for a screen, not two.
 */
const MEDIA_FRAME =
  "rounded-xl border border-zinc-200 bg-zinc-100 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900";

const BUTTON_BASE =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none active:scale-[0.98] dark:focus-visible:ring-offset-zinc-950";
const PRIMARY_BUTTON = `${BUTTON_BASE} bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-white`;
const SECONDARY_BUTTON = `${BUTTON_BASE} border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-500`;

/**
 * The page's actions. First is the primary and the rest are secondary — the
 * order is the hierarchy, so a surface cannot ship two primaries.
 */
function ActionRow({ actions }: { actions: readonly PageAction[] }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {actions.map((action, index) => {
        const className = index === 0 ? PRIMARY_BUTTON : SECONDARY_BUTTON;
        const content = (
          <>
            {action.label}
            {action.external && (
              <>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-1.5 h-4 w-4 shrink-0"
                />
                <span className="sr-only">(opens in a new tab)</span>
              </>
            )}
          </>
        );

        return (
          <Magnetic
            key={action.href}
            intensity={0.15}
            springOptions={{ bounce: 0 }}
          >
            {action.external ? (
              <a
                href={action.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={action.onClick}
                className={className}
              >
                {content}
              </a>
            ) : (
              <Link
                href={action.href}
                onClick={action.onClick}
                className={className}
              >
                {content}
              </Link>
            )}
          </Magnetic>
        );
      })}
    </div>
  );
}

/** Proof exhibits: figure over context, counted up once in view. */
function ProofBand({
  label,
  exhibits,
  note,
}: {
  label: string;
  exhibits: readonly Exhibit[];
  note?: string;
}) {
  return (
    <>
      <SectionLabel>{label}</SectionLabel>
      <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
        {exhibits.map((exhibit) => (
          <div key={exhibit.context} className="flex flex-col">
            <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
              <AnimatedMetricValue value={exhibit.value} />
            </dd>
            <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
              {exhibit.context}
            </dt>
          </div>
        ))}
      </dl>
      {note && (
        <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">{note}</p>
      )}
    </>
  );
}

export function CaseStudyTemplate({
  project,
  title,
  lead,
  actions,
  closeActions,
  situation,
  situationLabel = "What I walked into",
  intro,
  ledgerLabel = "The problems, and what answered them",
  ledgerHeads = ["The problem", "What I did about it"],
  ledger,
  proof,
  proofLabel = "What it produced",
  proofNote,
  proofPosition = "after-ledger",
  media,
  mediaLabel = "The work",
  capabilities,
  capabilitiesLabel = "What it does",
  record,
  deliverablesLabel = "What was still there when I left",
  technologiesLabel = "Methods",
  reflection: reflectionProp,
  reflectionLabel = "Looking back",
  tocExtra = [],
  closeHeadline = "If your team has this shape of problem, bring it to the call.",
  closeBody = "Thirty minutes on the design decision your roadmap is stuck on. You will leave with an answer whether or not we work together.",
  children,
}: CaseStudyTemplateProps) {
  // One page-level timeline. The rail is bound to the argument block so the
  // ink completes while the rule is still on screen.
  const ruledRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ruledRef,
    offset: ["start 0.85", "end 0.65"],
  });
  const ruleScale = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  const situationCopy = situation ?? project.processStory?.background;
  const introCopy = intro ?? project.roleNarrative;

  // Challenges and solutions are written index-aligned in the data, so a row
  // is a challenge beside the solution that answered it.
  const rows: readonly LedgerRow[] =
    ledger ??
    (project.challenges ?? []).map((problem, index) => ({
      problem,
      response: project.solutions?.[index] ?? "",
    }));

  const exhibits: readonly Exhibit[] =
    proof ??
    (project.metrics ?? [])
      .slice(0, 4)
      .map((m) => ({ value: m.value, context: m.label }));

  const columns = ledgerHeads.length === 3 ? 3 : 2;
  const gridCols =
    columns === 3
      ? "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)_minmax(0,0.85fr)]"
      : "md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]";

  const deliverables = project.overview?.deliverables ?? [];
  const reflection =
    reflectionProp === undefined
      ? project.processStory?.reflection
      : reflectionProp;

  // The contents line names the sections this page actually renders, in the
  // order it renders them, using their own labels. It appears only once a page
  // is long enough to be worth jumping around in — a six-item threshold, below
  // which the nav costs more attention than the scroll it saves.
  const tocItems: TocItem[] = [
    ...(situationCopy ? [{ id: "situation", label: situationLabel }] : []),
    ...(rows.length === 0 && introCopy
      ? [{ id: "my-role", label: "My role" }]
      : []),
    ...(rows.length > 0 ? [{ id: "problems", label: ledgerLabel }] : []),
    ...(exhibits.length > 0 ? [{ id: "proof", label: proofLabel }] : []),
    ...(media && media.length > 0 ? [{ id: "work", label: mediaLabel }] : []),
    ...(capabilities && capabilities.length > 0
      ? [{ id: "capabilities", label: capabilitiesLabel }]
      : []),
    ...(project.decisions && project.decisions.length > 0
      ? [{ id: "decisions", label: "Decisions" }]
      : []),
    ...(deliverables.length > 0
      ? [{ id: "deliverables", label: deliverablesLabel }]
      : []),
    ...(record && record.length > 0
      ? [{ id: "record", label: "The record" }]
      : []),
    ...tocExtra,
    ...(reflection ? [{ id: "reflection", label: reflectionLabel }] : []),
  ];

  return (
    <>
      {/* The One Crank Rule: the margin rail is this page's only scroll-linked
          element. A second progress widget would compete with it, and the one
          that used to sit here named four sections the page does not have. */}
      <main
        id="main-content"
        className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      >
        <BreadcrumbNav
          className="mb-8"
          // BreadcrumbNav renders its own home link, so the trail starts at
          // Projects rather than shipping two links to the same page.
          items={[
            { label: "Projects", href: "/projects" },
            { label: project.name, current: true },
          ]}
        />

        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          {title}
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-400">
          {lead}
        </p>

        {actions && actions.length > 0 && (
          <div className="mt-8">
            <ActionRow actions={actions} />
          </div>
        )}

        {tocItems.length >= 6 && (
          <div className="mt-12">
            <CaseStudyTOC items={tocItems} />
          </div>
        )}

        {proofPosition === "top" && exhibits.length > 0 && (
          <div id="proof" className="mt-16 scroll-mt-10">
            <ProofBand
              label={proofLabel}
              exhibits={exhibits}
              note={proofNote}
            />
          </div>
        )}

        {/* The argument: situation, ledger, proof. The rail runs down the
            block's left edge, lifted into the page margin at sm and above so
            no line of text can cross it. */}
        <div
          ref={ruledRef}
          className="relative mt-20 pl-4 sm:-ml-8 sm:pl-8 lg:-ml-10 lg:pl-10"
        >
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-0 w-px bg-zinc-200 dark:bg-zinc-800"
          />
          <motion.div
            aria-hidden="true"
            style={{
              scaleY: prefersReduced ? 1 : ruleScale,
              transformOrigin: "top",
            }}
            className="absolute inset-y-0 left-0 w-px bg-zinc-900 dark:bg-zinc-100"
          />

          {situationCopy && (
            <section
              id="situation"
              aria-labelledby="situation-heading"
              className="scroll-mt-10 border-t border-zinc-900 pt-10 dark:border-zinc-100"
            >
              <SectionLabel id="situation-heading">
                {situationLabel}
              </SectionLabel>
              <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {situationCopy}
              </p>
            </section>
          )}

          {/* A project with no challenge/solution pairs still has a role to
              state, so the intro gets its own section rather than vanishing
              with the table. */}
          {rows.length === 0 && introCopy && (
            <RoleNarrativeSection
              narrative={introCopy}
              role={project.role}
              teamSize={project.teamSize}
            />
          )}

          {rows.length > 0 && (
            <section
              id="problems"
              aria-labelledby="problems-heading"
              className={SECTION}
            >
              <SectionLabel id="problems-heading">{ledgerLabel}</SectionLabel>
              {introCopy && (
                <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {introCopy}
                </p>
              )}

              <div className={`mt-10 grid grid-cols-1 ${gridCols}`}>
                {ledgerHeads.map((head, i) => (
                  <h3
                    key={head}
                    className={
                      i === 0
                        ? `hidden pb-4 md:block md:pr-8 ${LABEL}`
                        : `hidden pb-4 text-sm font-medium tracking-[0.02em] text-zinc-900 md:block md:border-l md:border-zinc-200 md:pl-8 dark:text-white dark:md:border-zinc-800 ${i < ledgerHeads.length - 1 ? "md:pr-8" : ""}`
                    }
                  >
                    {head}
                  </h3>
                ))}

                {rows.map((row) => (
                  <div key={row.problem} className="contents">
                    <p className="border-t border-zinc-200 pt-5 pb-2 text-base text-zinc-500 md:pr-8 md:pb-5 dark:border-zinc-800 dark:text-zinc-400">
                      {row.problem}
                    </p>
                    <p
                      className={`pb-3 text-base font-medium text-zinc-900 md:border-t md:border-l md:border-zinc-200 md:py-5 md:pl-8 dark:text-white dark:md:border-zinc-800 ${columns === 3 ? "md:pr-8" : ""}`}
                    >
                      {row.response}
                    </p>
                    {columns === 3 && (
                      <p className="pb-5 text-base font-medium text-zinc-900 tabular-nums md:border-t md:border-l md:border-zinc-200 md:py-5 md:pl-8 dark:text-white dark:md:border-zinc-800">
                        {/* Stacked, the cells lose their column heads, so the
                            outcome names itself rather than relying on order. */}
                        <span className="mb-1 block text-xs font-normal text-zinc-500 md:hidden dark:text-zinc-400">
                          Result
                        </span>
                        {row.result}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {proofPosition === "after-ledger" && exhibits.length > 0 && (
            <section id="proof" className={SECTION}>
              <ProofBand
                label={proofLabel}
                exhibits={exhibits}
                note={proofNote}
              />
            </section>
          )}
        </div>

        {media && media.length > 0 && (
          <section id="work" aria-labelledby="work-heading" className={SECTION}>
            <SectionLabel id="work-heading">{mediaLabel}</SectionLabel>
            <div className="mt-8 space-y-12">
              {media.map((item) => {
                // A screen is contained on its ground, never cropped to a
                // uniform band: a phone screenshot sliced to 16:9 is a
                // horizontal strip of itself and proves nothing. Only
                // photography, which survives a crop, opts into `cover`.
                const contained = item.fit !== "cover";
                const portrait = item.width < item.height;
                const imageClassName = contained
                  ? portrait
                    ? "mx-auto h-auto max-h-[80vh] w-auto object-contain"
                    : "h-auto w-full object-contain"
                  : "h-full w-full object-cover";

                return (
                  <InView
                    key={item.src}
                    as="figure"
                    // The work has to be visible at progress 0: a figure that
                    // only exists after the observer fires is a blank band to
                    // anyone whose scroll never reaches it. Motion rides on
                    // position only, never on whether the content is there.
                    variants={{
                      hidden: { opacity: 1, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    viewOptions={{ margin: "0px 0px -15% 0px" }}
                  >
                    {item.kind === "video" ? (
                      <div className={MEDIA_FRAME}>
                        <video
                          className="w-full rounded-lg"
                          controls
                          preload="metadata"
                          poster={item.poster}
                          aria-label={item.alt}
                        >
                          <source src={item.src} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <AnimatedAsset
                        // Contained evidence sits in the frame the wireframe
                        // figures already use — a full hairline on a Wash
                        // ground — so the page has one vocabulary for a screen
                        // rather than two.
                        className={
                          contained ? "aspect-auto rounded-lg" : undefined
                        }
                        containerClassName={
                          contained ? `${MEDIA_FRAME} ring-0` : undefined
                        }
                        expandedChildren={
                          <Image
                            src={item.src}
                            alt={item.alt}
                            width={item.width}
                            height={item.height}
                            className="h-full w-full rounded-2xl object-contain"
                          />
                        }
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          width={item.width}
                          height={item.height}
                          sizes="(min-width: 1100px) 1040px, 100vw"
                          className={imageClassName}
                        />
                      </AnimatedAsset>
                    )}
                    {item.caption && (
                      <figcaption className="mt-3 max-w-[62ch] text-sm text-zinc-500 dark:text-zinc-400">
                        {item.caption}
                      </figcaption>
                    )}
                  </InView>
                );
              })}
            </div>
          </section>
        )}

        {capabilities && capabilities.length > 0 && (
          <section
            id="capabilities"
            aria-labelledby="capabilities-heading"
            className={SECTION}
          >
            <SectionLabel id="capabilities-heading">
              {capabilitiesLabel}
            </SectionLabel>
            <dl className="mt-6">
              {capabilities.map((capability) => (
                <div
                  key={capability.title}
                  className="grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,18rem)_1fr] dark:border-zinc-800"
                >
                  <dt className="text-base font-medium text-zinc-900 sm:pr-8 dark:text-white">
                    {capability.title}
                  </dt>
                  <dd className="mt-2 text-base text-zinc-600 sm:mt-0 dark:text-zinc-400">
                    {capability.description}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {project.decisions && project.decisions.length > 0 && (
          <section
            id="decisions"
            aria-labelledby="decisions-heading"
            className={SECTION}
          >
            <SectionLabel id="decisions-heading">
              What I decided, and what it cost
            </SectionLabel>
            <div className="mt-8">
              {project.decisions.map((decision, index) => (
                <DecisionCallout
                  key={decision.title}
                  decision={decision}
                  index={index + 1}
                  sectionId="decisions"
                  figure={decisionFigure(project.slug, decision.title)}
                />
              ))}
            </div>
          </section>
        )}

        {(deliverables.length > 0 || project.technologies?.length > 0) && (
          <section id="deliverables" className={SECTION}>
            {deliverables.length > 0 && (
              <>
                <SectionLabel id="deliverables-heading">
                  {deliverablesLabel}
                </SectionLabel>
                <div className="mt-6">
                  <AnimatedBackground
                    className="rounded-md bg-zinc-100 dark:bg-zinc-900"
                    enableHover
                    transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                  >
                    {deliverables.map((deliverable) => (
                      <div
                        key={deliverable}
                        data-id={deliverable}
                        className="border-t border-zinc-200 dark:border-zinc-800"
                      >
                        <p className="px-3 py-4 text-base text-zinc-900 dark:text-white">
                          {deliverable}
                        </p>
                      </div>
                    ))}
                  </AnimatedBackground>
                </div>
              </>
            )}
            {project.technologies?.length > 0 && (
              <dl className="mt-6 grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800">
                <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                  {technologiesLabel}
                </dt>
                <dd className="mt-1 text-base text-zinc-700 sm:mt-0 dark:text-zinc-300">
                  {project.technologies.join(" · ")}
                </dd>
              </dl>
            )}
          </section>
        )}

        {record && record.length > 0 && (
          <section
            id="record"
            aria-labelledby="record-heading"
            className={SECTION}
          >
            <SectionLabel id="record-heading">The record</SectionLabel>
            <ul className="mt-6">
              {record.map((item) => (
                <li
                  key={item.url}
                  className="grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,22rem)_1fr] dark:border-zinc-800"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group -my-2.5 inline-flex w-fit items-start gap-1.5 py-2.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:pr-8 dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
                  >
                    {item.title}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-colors group-hover:text-zinc-900 dark:text-zinc-500 dark:group-hover:text-zinc-100"
                    />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  {item.description && (
                    <p className="mt-2 text-base text-zinc-500 sm:mt-0 dark:text-zinc-400">
                      {item.description}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {children}

        {reflection && (
          <ReflectionBlock reflection={reflection} heading={reflectionLabel} />
        )}

        <section className={SECTION}>
          {/* The one place a border is allowed to move: the page's single
              primary action, and nothing else on the surface competes. */}
          <div className="relative overflow-hidden rounded-xl border border-zinc-200 p-8 dark:border-zinc-800">
            <BorderTrail
              className="bg-zinc-400 dark:bg-zinc-600"
              size={80}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            <h2 className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-3xl dark:text-white">
              {closeHeadline}
            </h2>
            <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
              {closeBody}
            </p>
            <div className="mt-8">
              {closeActions && closeActions.length > 0 ? (
                <ActionRow actions={closeActions} />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Magnetic intensity={0.15} springOptions={{ bounce: 0 }}>
                    <CalButton
                      onClick={() => trackContactIntent("booking", BOOKING_URL)}
                      className={PRIMARY_BUTTON}
                    >
                      Book a 30-minute call
                    </CalButton>
                  </Magnetic>
                  <Magnetic intensity={0.15} springOptions={{ bounce: 0 }}>
                    <Link href="/projects" className={SECONDARY_BUTTON}>
                      See the other case studies
                    </Link>
                  </Magnetic>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={SECTION}>
          <SectionLabel>Next</SectionLabel>
          <div className="mt-6">
            <ProjectRecommendations
              currentProjectId={project.id}
              projects={PROJECTS}
              maxRecommendations={3}
            />
          </div>
        </section>
      </main>
      <ScrollToTop personality="minimal" />
    </>
  );
}
