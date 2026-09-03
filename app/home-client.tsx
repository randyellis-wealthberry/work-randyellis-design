"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ChevronUp } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/core/accordion";
import {
  SectionLabel,
  SECTION,
  ROW,
} from "@/components/case-study/section-chrome";
import { ProjectThumbnail } from "@/components/ui/project-thumbnail";
import { ClientLogos } from "@/components/client-logos";
import { CalButton } from "@/components/booking/cal-embed";
import { FeatureFlagDemo } from "@/components/feature-flag-demo";
import { PROJECTS } from "@/lib/data/projects";
import { projectThumbnail } from "@/lib/data/project-thumbnails";
import { SOCIAL_LINKS } from "@/lib/data";
import { testimonials } from "@/lib/data/testimonials";
import { RETAINER_LEDGER, PROOF_EXHIBITS } from "@/lib/data/retainer";
import { trackContactIntent } from "@/lib/analytics";
import { BOOKING_URL } from "@/lib/constants";
import { FAQS } from "@/lib/data/faqs";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/button-styles";

// Visible At Zero: the hidden state paints the content and only settles the
// y-offset, so the page is complete in server HTML.
const VARIANTS_CONTAINER = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 1, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION_SECTION = { duration: 0.3 };

const TEXT_LINK =
  "-my-3 inline-flex min-h-[44px] w-fit items-center gap-1.5 py-3 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white";

/**
 * The three case studies the homepage argues from: a product a reader can open
 * today, an enterprise engagement, and one that reached consumer scale. The
 * rest are one link away.
 */
const FEATURED_SLUGS = ["waffle", "echo", "growit"];

// FAQ content lives in lib/data/faqs.ts — one source for both the visible
// accordion below and the FAQPage JSON-LD app/page.tsx mounts (Phase 13 T-02).

function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={SECTION}
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
    >
      <SectionLabel id={`${id}-heading`}>{label}</SectionLabel>
      {children}
    </motion.section>
  );
}

export default function HomeClient() {
  const featured = FEATURED_SLUGS.map((slug) =>
    PROJECTS.find((project) => project.slug === slug),
  ).filter((project): project is (typeof PROJECTS)[number] => Boolean(project));

  const [recommendation] = testimonials;

  return (
    <motion.main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* The claim. One h1, carrying the words the page is actually about —
          the old page hid its h1 in sr-only and set the visible title as a
          paragraph under an eyebrow, so the document had no heading at all. */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          Design leader who ships AI products.
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
          I turn startups into design-led organizations — and write the code to
          prove it. Head of Product and Fractional Chief Design Officer, working
          with founders on AI product design, design systems, and the decisions
          a roadmap is already waiting on.
        </p>
        <p className="mt-4 max-w-[62ch] text-sm text-zinc-500 dark:text-zinc-400">
          20+ years in design · 8+ years leading teams · Ships React, Next.js
          and TypeScript
        </p>

        {/* One primary. The old page shipped three, two of them the same
            booking link with the same label. */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CalButton
            onClick={() =>
              trackContactIntent("booking", BOOKING_URL, "home_hero")
            }
            className={PRIMARY_BUTTON}
          >
            Book a 30-minute call
          </CalButton>
          <Link href="/projects" className={SECONDARY_BUTTON}>
            See the work
          </Link>
        </div>
      </motion.section>

      <Section id="proof" label="What the work has been worth">
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
          {PROOF_EXHIBITS.map((exhibit) => (
            <div key={exhibit.context} className="flex flex-col">
              {/* The true figure ships in the HTML. The old band counted up
                  from zero on a metric that was on screen at load. */}
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
                {exhibit.value}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                {exhibit.context}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-[62ch] text-xs text-zinc-500 dark:text-zinc-400">
          Every figure above is career to date, across roles at DigitasLBi, Leo
          Burnett, Alight, Nagarro, Chameleon Collective, and Wealthberry Labs.
        </p>
      </Section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-20"
      >
        <ClientLogos />
      </motion.section>

      <Section id="work" label="Selected work">
        <p className="mt-6 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
          AI-powered product work with figures attached: LedgerIQ&apos;s payroll
          anomaly detection cut errors 78% and saved $180K a year, EchoDrive
          carried two logistics platforms to launch on on-site driver research,
          and Nagarro&apos;s design practice reached 18,000 employees across 36
          countries.
        </p>
        <ul className="mt-8">
          {featured.map((project) => {
            const still = projectThumbnail(project.slug);

            return (
              <li
                key={project.slug}
                className="grid grid-cols-1 gap-4 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8 dark:border-zinc-800"
              >
                {/* The image is a sibling of the link, never a child of it: a
                    lightbox trigger is a button, and a button inside an anchor
                    is both invalid and ambiguous to click. Two targets, each
                    doing one thing — the picture enlarges, the words navigate. */}
                {still && <ProjectThumbnail thumbnail={still} />}
                <Link
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col gap-2 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-white"
                >
                  <span className="flex items-start gap-1.5 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
                    {project.name}
                    <ArrowRight
                      aria-hidden="true"
                      className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
                    />
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {project.category}
                  </span>
                  <span className="max-w-[62ch] text-base text-zinc-500 dark:text-zinc-400">
                    {project.description}
                  </span>
                  {project.metrics?.[0] && (
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="font-medium text-zinc-900 tabular-nums dark:text-white">
                        {project.metrics[0].value}
                      </span>{" "}
                      {project.metrics[0].label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-6 flex flex-col gap-4">
          <Link href="/projects" className={TEXT_LINK}>
            All {PROJECTS.length} case studies
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Currently building{" "}
            <Link href="/metis" className={TEXT_LINK}>
              METIS:LAYER
            </Link>{" "}
            — AI business strategy for designers, bridging design excellence and
            boardroom fluency.
          </p>
        </div>
      </Section>

      <Section id="retainer" label="How the engagement runs">
        <p className="mt-6 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
          A fractional Chief Design Officer retainer: guaranteed hours every
          month, spent on design strategy, systems, AI product surfaces, and the
          team decisions that come with them.
        </p>
        <div className="mt-8">
          {RETAINER_LEDGER.map((row) => (
            <div key={row.without} className={ROW}>
              <p className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                {row.without}
              </p>
              <p className="mt-2 text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
                {row.with}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-col gap-y-6 sm:flex-row sm:flex-wrap sm:gap-x-8">
          <Link href="/services" className={TEXT_LINK}>
            Terms, rate, and what a month looks like
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
          <Link href="/skill" className={TEXT_LINK}>
            Or install my judgment first, free
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </Section>

      {recommendation && (
        <Section
          id="recommendation"
          label="What people who have worked with me say"
        >
          <figure className={`${ROW} mt-6`}>
            <figcaption className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
              <span className="block text-zinc-900 dark:text-white">
                {recommendation.author}
              </span>
              {recommendation.role}
            </figcaption>
            <blockquote className="mt-2 max-w-[68ch] text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
              {`“${recommendation.quote}”`}
            </blockquote>
          </figure>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
            A LinkedIn recommendation, quoted in full and attributed.{" "}
            <Link href="/about" className={TEXT_LINK}>
              More on the about page
            </Link>
          </p>
        </Section>
      )}

      <Section id="questions" label="Questions founders ask">
        <Accordion
          className="mt-6 flex w-full flex-col"
          transition={{ duration: 0.2 }}
        >
          {FAQS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className="border-t border-zinc-200 dark:border-zinc-800"
            >
              <AccordionTrigger className="w-full py-5 text-left">
                <div className="flex w-full items-start justify-between gap-4">
                  <span className="text-base font-medium text-zinc-900 dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronUp
                    aria-hidden="true"
                    className="mt-1 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 group-data-expanded:-rotate-180 dark:text-zinc-500"
                  />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="max-w-[62ch] pb-5 text-base text-zinc-600 dark:text-zinc-300">
                  {faq.answer}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>

      <motion.section
        className={SECTION}
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h2 className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white">
          Thirty minutes is enough to know whether this fits.
        </h2>
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-300">
          Bring the design decision that is currently stuck. We will work
          through it on the call, and you will leave with the answer whether or
          not you take the retainer.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CalButton
            onClick={() =>
              trackContactIntent("booking", BOOKING_URL, "home_secondary_cta")
            }
            className={PRIMARY_BUTTON}
          >
            Book a 30-minute call
          </CalButton>
          <Link href="/blog" className={SECONDARY_BUTTON}>
            Read the writing
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
          {SOCIAL_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.link}
              target="_blank"
              rel="noopener noreferrer"
              className="-my-3 inline-flex items-center gap-1.5 py-3 text-sm text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
            >
              {link.label}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          ))}
        </div>
      </motion.section>

      {/* Development only. */}
      <FeatureFlagDemo />
    </motion.main>
  );
}
