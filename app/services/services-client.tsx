"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring, useReducedMotion } from "motion/react";
import { CalButton } from "@/components/booking/cal-embed";
import { AnimatedMetricValue } from "@/components/ui/animated-metric-value";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";
import { testimonials } from "@/lib/data/testimonials";
import { trackContactIntent } from "@/lib/analytics";

const BOOKING_URL = "https://cal.com/randyellis/30min";

const RECOMMENDATIONS_LABEL = "What people who have worked with me say";

/**
 * Paired ledger rows. Left is the state a founder arrives in; right is what
 * the retainer puts in its place. The pairing is the argument — neither
 * column reads as a claim on its own, which is why they share a row.
 */
const LEDGER: ReadonlyArray<{ without: string; with: string }> = [
  {
    without: "Design decisions made by whoever has time that week",
    with: "One accountable owner for every design decision",
  },
  {
    without: "Four design systems wearing one name",
    with: "One system — versioned, documented, enforced",
  },
  {
    without: "AI features that demo well and ship badly",
    with: "AI surfaces designed to survive real users",
  },
  {
    without: "Design reviewed at the end, when changing it is expensive",
    with: "Design in the room where the roadmap gets set",
  },
  {
    without: "A CDO search that runs a quarter, then costs equity",
    with: "Start this month — fixed hours, no equity",
  },
];

/**
 * The proof exhibits. Every row carries the same fields so the band is
 * scannable by structure before any of it is read: the quantity, then the
 * context that makes it mean something. The period is shared by all four and
 * is stated once beneath the band.
 */
const EXHIBITS: ReadonlyArray<{ value: string; context: string }> = [
  { value: "2.5M+", context: "Users reached by shipped product" },
  { value: "$50M", context: "Product value delivered" },
  { value: "800+", context: "Designers mentored" },
  { value: "4", context: "Design awards won" },
];

/** Terms of the engagement. `pending` marks a figure awaiting a real value. */
const TERMS: ReadonlyArray<{
  label: string;
  value: string;
  pending?: boolean;
}> = [
  { label: "Commitment", value: "Fixed hours each month", pending: true },
  { label: "Cadence", value: "Weekly working sessions, async access between" },
  {
    label: "Scope",
    value: "Design strategy, systems, product surfaces, team guidance",
  },
  { label: "Term", value: "Month to month", pending: true },
  { label: "Rate", value: "On request" },
];

/**
 * A figure that still needs a real number before launch. A hover-only tooltip
 * is invisible on touch and a dotted underline reads as a link, so the state is
 * carried by the value's own weight plus a visible note on the row — nobody can
 * mistake it for a confirmed term.
 */
function Pending({ children }: { children: React.ReactNode }) {
  return (
    <span data-placeholder="true" className="text-zinc-500 dark:text-zinc-400">
      {children}
      {/* The note carrying the honesty must clear the contrast floor, so it
          sits at zinc-500 / zinc-400 rather than the quieter tints. */}
      <span className="ml-2 align-[0.1em] text-xs font-normal text-zinc-500 dark:text-zinc-400">
        to confirm
      </span>
    </span>
  );
}

const BUTTON_BASE =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none active:scale-[0.98] dark:focus-visible:ring-offset-zinc-950";

const PRIMARY_BUTTON = `${BUTTON_BASE} bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-white`;

const SECONDARY_BUTTON = `${BUTTON_BASE} border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-500`;

export default function ServicesClient() {
  // The timeline is bound to exactly what the rule spans — ledger plus proof
  // band — so the ink completes while the rule is still on screen rather than
  // stalling a fifth of the way down.
  const ruledRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // One shared timeline: the left rail inks itself down as you scroll, and
  // nothing else on the page animates on entrance. The whole surface is driven
  // by this single crank rather than by per-section effects.
  const { scrollYProgress } = useScroll({
    target: ruledRef,
    offset: ["start 0.85", "end 0.65"],
  });
  const ruleScale = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    // The balance sheet needs more than the site's 768px measure; this route is
    // widened for header, content, and footer together in RouteContainer. Text
    // keeps its own reading measures below. The browser's own surfaces —
    // selection and caret — are themed rather than left on their defaults.
    <main className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900">
      <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-zinc-900 sm:text-5xl dark:text-white">
        A design leader on your team, by the month.
      </h1>
      <p className="mt-5 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-400">
        A fractional Chief Design Officer retainer: fixed hours every month,
        spent on the design decisions your roadmap is already waiting on.
      </p>

      {/* The split. Two vertical devices with separate jobs: a scroll rail at
          the block's left edge carries the timeline, and a static hairline
          down the ledger's centre separates the two columns. They were one
          element until the centred rule was measured crossing the proof band's
          full-width lines — a rule that carries a timeline has to live where no
          text box can reach it. */}
      <div className="mt-16">
        {/* The scroll rail runs down the left edge of the whole ruled block —
            ledger and proof band — where no line of text can cross it. At sm+
            a negative margin lifts it into the page margin so the content keeps
            the same left edge as the heading above it. */}
        <div
          ref={ruledRef}
          className="relative pl-4 sm:-ml-8 sm:pl-8 lg:-ml-10 lg:pl-10"
        >
          {/* The rail. A static hairline always holds the structure, so it
              reads from the first pixel; the scroll timeline inks a darker rule
              down over it as you read. Hidden from assistive tech: it is
              structure, not content. One construction at every width — desktop
              and mobile differ only in whether the margin has room for it. */}
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

          {/* Column separation is a separate job from the scroll rail, so it
              gets its own static hairline scoped to the ledger — it stops
              before the proof band, where full-width text would cross it. */}
          <div className="relative grid grid-cols-1 sm:grid-cols-2">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-zinc-200 sm:block dark:bg-zinc-800"
            />
            {/* Stacked, the two columns become a gray statement answered by a
                bold one, so the mobile reader gets the pairing the desktop
                divider carries. */}
            <h2 className="pb-4 text-sm font-medium tracking-[0.02em] text-zinc-500 sm:pr-8 dark:text-zinc-400">
              <span className="sm:hidden">
                What you have now, and what the retainer puts in place
              </span>
              <span className="hidden sm:inline">What you have now</span>
            </h2>
            <h2 className="hidden pb-4 text-sm font-medium tracking-[0.02em] text-zinc-900 sm:block sm:pl-8 dark:text-white">
              What the retainer puts in place
            </h2>

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

          {/* The proof band. Every exhibit carries the same two fields —
              quantity, then what it counts — and the period they share is
              stated once for the band rather than repeated under each figure,
              where four identical lines said nothing. */}
          <div className="mt-4 border-t border-zinc-900 pt-10 dark:border-zinc-100">
            <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
              What that leadership has already produced
            </h2>
            {/* The wide centre gap is a remnant of the band once sitting
                astride a centred rule. It stays because it reads as two pairs
                rather than four loose figures. */}
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
              {EXHIBITS.map((exhibit) => (
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
            <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
              Every figure above is career to date, across roles at Nagarro,
              Chameleon Collective, and Wealthberry Labs.
            </p>
          </div>
        </div>

        {/* Terms, in the same two-column ledger grammar as the split above. */}
        <div className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100">
          <h2 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Terms of the engagement
          </h2>
          <dl className="mt-6">
            {TERMS.map((term) => (
              <div
                key={term.label}
                // The label column is sized to the label, not to half the wide
                // field: at full width the eye had to track ~500px of blank
                // between a term and its value, five rows running.
                className="grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,14rem)_1fr] dark:border-zinc-800"
              >
                <dt className="text-base text-zinc-500 sm:pr-8 dark:text-zinc-400">
                  {term.label}
                </dt>
                <dd className="mt-1 text-base font-medium text-zinc-900 tabular-nums sm:mt-0 dark:text-white">
                  {term.pending ? <Pending>{term.value}</Pending> : term.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Other people's words, placed where the reader is deciding rather than
          at the top where they read as decoration. One quote at a time, at
          reading size — the pager is the only thing asking for a click. */}
      <div className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100">
        <h2 className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
          {RECOMMENDATIONS_LABEL}
        </h2>
        <div className="mt-6">
          <TestimonialCarousel testimonials={testimonials} />
        </div>
        {/* The provenance both quotes share, stated once. */}
        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          LinkedIn recommendations, quoted in full and attributed.
        </p>
      </div>

      {/* The close: the two columns resolve into one, and the action sits
          where the rail ends. */}
      <div className="mt-20 border-t border-zinc-900 pt-10 dark:border-zinc-100">
        <h2 className="max-w-[24ch] text-2xl leading-tight font-semibold tracking-[-0.03em] text-zinc-900 sm:text-3xl dark:text-white">
          Thirty minutes is enough to know whether this fits.
        </h2>
        <p className="mt-4 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          Bring the design decision that is currently stuck. We will work
          through it on the call, and you will leave with the answer whether or
          not you take the retainer.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <CalButton
            onClick={() => trackContactIntent("booking", BOOKING_URL)}
            className={PRIMARY_BUTTON}
          >
            Book a 30-minute call
          </CalButton>
          <Link href="/projects" className={SECONDARY_BUTTON}>
            See the work first
          </Link>
        </div>
      </div>
    </main>
  );
}
