"use client";

import { Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CalButton } from "@/components/booking/cal-embed";
import { CaseStudyTOC } from "@/components/case-study/case-study-toc";
import {
  SECTION,
  ROW,
  SectionLabel,
} from "@/components/case-study/section-chrome";
import { CoreFile, type CoreFileFacts } from "@/components/skill/core-file";
import { ModuleEntry } from "@/components/skill/module-entry";
import { BuyButton } from "@/components/skill/buy-button";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/button-styles";
import { SKILL_BUNDLE, SKILL_MODULES } from "@/lib/data/skill-catalog";
import { trackContactIntent } from "@/lib/analytics";
import { BOOKING_URL } from "@/lib/constants";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

// Visible At Zero: the hidden state is fully painted and only settles 10px.
const VARIANTS_SECTION = {
  hidden: { opacity: 1, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION_SECTION = { duration: 0.3 };

const TEXT_LINK =
  "-my-3 inline-flex min-h-[44px] w-fit items-center gap-1.5 py-3 font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white";

/**
 * The sections, in render order. The contents line is built from this same
 * list, so a section added here appears in the nav or it does not appear.
 */
const SECTIONS = [
  { id: "file", label: "The free file" },
  { id: "premise", label: "What it changes" },
  { id: "modules", label: "À la carte modules" },
  { id: "ladder", label: "How they fit together" },
  { id: "engagement", label: "For your product" },
  { id: "terms", label: "Terms" },
] as const;

/**
 * The argument, as a ledger. Left is what an agent does when nobody has told
 * it otherwise; right is what the file makes it do instead. Quiet against
 * Ink, per the Weight Ledger Rule.
 */
const LEDGER: ReadonlyArray<{ without: string; with: string }> = [
  {
    without: "Says it chose X because X is better",
    with: "Names Y at its strongest, and what X cost",
  },
  {
    without: "Lets every number drift toward whoever is telling the story",
    with: "Claims only what you did, and says which bucket each figure is in",
  },
  {
    without: "Writes an outcome with no downside in it",
    with: "Reports the part that cut against you",
  },
  {
    without: "Optimises the build",
    with: "Prices the adoption, which is where the work dies",
  },
  {
    without: "Asserts one confident answer",
    with: "Shows ranked candidates the user confirms",
  },
  {
    without: "Leads with the biggest number",
    with: "Leads with the metric that maps to intent",
  },
];

const LADDER: ReadonlyArray<{
  rung: string;
  who: string;
  what: string;
  cost: string;
}> = [
  {
    rung: "The free file",
    who: "Anyone with an agent",
    what: "The rules, the decision framework, and the review format. Enough to stop shipping preferences dressed as decisions.",
    cost: "Free, MIT",
  },
  {
    rung: "The modules",
    who: "A team doing the work itself",
    what: "One lens each, going deeper than the core: research, strategy, visual direction, a room that has to disagree, a full audit, the figures.",
    cost: "Per module, or all six",
  },
  {
    rung: "The engagement",
    who: "A founder who needs it applied",
    what: "Randy in the room for two weeks, and a SKILL.md written for your product at the end of it, so what he learned is what your agents run.",
    cost: "The diagnostic, credited to month one",
  },
];

type Term = { label: string; value: string; pending?: boolean };

const TERMS: ReadonlyArray<Term> = [
  {
    label: "The free file",
    value: "MIT. Fork it, ship it, edit it, keep the attribution line.",
  },
  {
    label: "The modules",
    value:
      "Licensed to you, or to the team you bought it for. Install in any project, edit to fit, do not republish or resell.",
  },
  {
    label: "Team size",
    value: "One buyer covers a team of up to ten",
    pending: true,
  },
  {
    label: "Delivery",
    value:
      "A download page the moment payment clears, and a receipt email with the same links. Come back to either for a fresh copy.",
  },
  {
    label: "Updates",
    value:
      "Published to the same download page. The free file updates in place at /skill.md.",
  },
  { label: "Refunds", value: "Fourteen days, no questions", pending: true },
  {
    label: "Payment",
    value: "Stripe. Card, Apple Pay, Google Pay, Link.",
  },
];

function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span data-placeholder="true" className="text-zinc-500 dark:text-zinc-400">
      {children}
      <span className="ml-2 align-[0.1em] text-xs font-normal text-zinc-500 dark:text-zinc-400">
        to confirm
      </span>
    </span>
  );
}

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

/**
 * The checkout route sends a form post back here with `?checkout=unavailable`
 * when there is nothing to redirect to. Said in words, next to the modules,
 * rather than as a JSON body on a blank tab.
 */
function CheckoutNotice() {
  const params = useSearchParams();
  if (params.get("checkout") !== "unavailable") return null;
  return (
    <p
      role="status"
      className="mt-6 max-w-[62ch] border-l-2 border-zinc-300 pl-5 text-base text-zinc-700 dark:border-zinc-600 dark:text-zinc-300"
    >
      Checkout for that module is not open yet. Nothing was charged. The free
      file above is the same method at the core; the module will be here when
      its price is set.
    </p>
  );
}

export default function SkillClient({ core }: { core: CoreFileFacts }) {
  return (
    <motion.main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.header
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <p className="mb-3 text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
          Skill.md · Free core · Paid modules
        </p>
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          Install my judgment before you hire it.
        </h1>
        <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-400">
          One file that makes an agent decide the way I do, free. Six modules
          that go deeper, bought one at a time. And when it has to be me in the
          room, the diagnostic ends with a SKILL.md written for your product.
        </p>
        <div className="mt-10">
          <CaseStudyTOC items={[...SECTIONS]} sectionId="skill-toc" />
        </div>
      </motion.header>

      <Section id="file" label="The free file">
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          A skill is a markdown file an agent reads before it works. This one
          encodes how I make and defend a product design decision: the
          alternative named at its strongest, the cost stated, the claim limited
          to what was actually done, the outcome reported including the part
          that cut against me. It installs into any of the agents below and it
          is the same file whichever way you fetch it.
        </p>
        <div className="mt-8">
          <CoreFile core={core} />
        </div>
      </Section>

      <Section id="premise" label="What it changes">
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Agents are good at producing design rationale that sounds right. They
          are worse at producing rationale that is true. Left alone, one will
          write you a case study in which every decision was correct, every
          number is yours, and nothing was traded away. Installed, it does this
          instead.
        </p>
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <h3 className="pb-4 text-sm font-medium tracking-[0.02em] text-zinc-500 sm:pr-8 dark:text-zinc-400">
              <span className="sm:hidden">
                What an agent does unprompted, and what the file makes it do
              </span>
              <span className="hidden sm:inline">
                What an agent does unprompted
              </span>
            </h3>
            <h3 className="hidden pb-4 text-sm font-medium tracking-[0.02em] text-zinc-900 sm:block sm:pl-8 dark:text-white">
              What the file makes it do
            </h3>
            {LEDGER.map((row) => (
              <div key={row.without} className="contents">
                <p className="border-t border-zinc-200 pt-5 pb-2 text-base text-zinc-500 sm:pr-8 sm:pb-5 dark:border-zinc-800 dark:text-zinc-400">
                  {row.without}
                </p>
                <p className="pb-5 text-base font-medium text-zinc-900 sm:border-t sm:border-zinc-200 sm:pt-5 sm:pl-8 dark:text-white dark:sm:border-zinc-800">
                  {row.with}
                </p>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The file is held to its own standard, which is why several of its
          examples argue against its author. The open-source collection it was
          consolidated from, with every worked decision in full, is one page
          over.
        </p>
        <div className="mt-6">
          <Link href="/skills" className={TEXT_LINK}>
            The open-source collection
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </Section>

      <Section id="modules" label="À la carte modules">
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The free file is how I decide. The modules are how I work: one lens
          each, with its own procedure, output format, and review checklist, and
          each one hands off to the others and back to the core. Buy the one you
          need. Every module opens with a preview and a sample of what it
          produces, so you are judging the file, not the pitch.
        </p>
        <Suspense fallback={null}>
          <CheckoutNotice />
        </Suspense>
        <div className="mt-10">
          {SKILL_MODULES.map((module, index) => (
            <ModuleEntry
              key={module.id}
              module={module}
              index={index + 1}
              sectionId="modules"
            />
          ))}
        </div>
        <div className="mt-4 border-t border-zinc-900 pt-8 dark:border-zinc-100">
          <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div>
              <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
                {SKILL_BUNDLE.name}
              </h3>
              <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {SKILL_BUNDLE.summary}
              </p>
            </div>
            <div className="sm:pt-1">
              <BuyButton entry={SKILL_BUNDLE} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="ladder" label="How they fit together">
        <div className="mt-6">
          {LADDER.map((row) => (
            <div key={row.rung} className={ROW}>
              <div className="sm:pr-8">
                <p className="text-base font-medium text-zinc-900 dark:text-white">
                  {row.rung}
                </p>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {row.who}
                </p>
              </div>
              <div className="mt-3 sm:mt-0">
                <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {row.what}
                </p>
                <p className="mt-2 text-base font-medium text-zinc-900 tabular-nums dark:text-white">
                  {row.cost}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="engagement" label="For your product">
        <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The modules encode my method. They do not know your product, your
          constraints, or the decision your roadmap is stuck on. The engagement
          starts where the files stop: two weeks in the room, and at the end of
          it a SKILL.md written for your product and installed in your agents,
          so the judgment stays after I leave.
        </p>
        <dl className="mt-8">
          {(
            [
              {
                label: "Start with",
                value: "A two-week diagnostic, $4,000, credited to month one",
              },
              {
                label: "Ends with",
                value:
                  "A SKILL.md written for your product, installed in your agents",
              },
              {
                label: "Then, if it fits",
                value: "The retainer: 20 hours a month, guaranteed",
              },
            ] as ReadonlyArray<Term>
          ).map((term) => (
            <div key={term.label} className={ROW}>
              <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                {term.label}
              </dt>
              <dd className="mt-1 text-base font-medium text-zinc-900 tabular-nums sm:mt-0 dark:text-white">
                {term.value}
              </dd>
            </div>
          ))}
        </dl>
        <div className="mt-6">
          <Link href="/services" className={TEXT_LINK}>
            The retainer, in full
            <ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </Section>

      <Section id="terms" label="Terms">
        <dl className="mt-6">
          {TERMS.map((term) => (
            <div key={term.label} className={ROW}>
              <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                {term.label}
              </dt>
              <dd className="mt-1 max-w-[62ch] text-base font-medium text-zinc-900 sm:mt-0 dark:text-white">
                {term.pending ? <Pending>{term.value}</Pending> : term.value}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      <motion.div
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
        className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100"
      >
        <h2 className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white">
          Try the file first. Then decide whether you need me.
        </h2>
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Install the free core, run your next decision through it, and see
          whether the version it hands back is one you can defend. If it is, you
          may not need a call. If it is smaller than the one you wanted to
          write, that is the conversation.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CalButton
            onClick={() =>
              trackContactIntent("booking", BOOKING_URL, "skill_page")
            }
            className={PRIMARY_BUTTON}
          >
            Book the diagnostic
          </CalButton>
          <a href="#file" className={SECONDARY_BUTTON}>
            Install the free file
          </a>
        </div>
      </motion.div>
    </motion.main>
  );
}
