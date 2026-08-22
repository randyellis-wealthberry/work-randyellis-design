"use client";

import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
} from "@/components/motion-primitives/disclosure";

export type Decision = {
  title: string;
  decision: string;
  rationale: string;
  outcome?: string;
};

type DecisionCalloutProps = {
  decision: Decision;
  /** 1-based position, used only to build a unique heading id. */
  index: number;
  /** Section id this callout belongs to, used to build unique heading ids. */
  sectionId: string;
  /**
   * The figure that draws this decision, if one exists. It renders last, after
   * the outcome, because a drawing argues a claim the reader has already been
   * given — it is evidence, not an illustration of the heading.
   */
  figure?: React.ReactNode;
};

/**
 * One design decision with its fork made explicit.
 *
 * Not a card and not a tinted callout: the decisions are a list before they are
 * essays, so each is a hairline-separated entry whose long half — the rationale
 * — opens on demand. The outcome stays visible, because what a decision cost is
 * the part a reader came for.
 */
export function DecisionCallout({
  decision,
  index,
  sectionId,
  figure,
}: DecisionCalloutProps) {
  const headingId = `${sectionId}-decision-${index}-heading`;

  return (
    <article
      aria-labelledby={headingId}
      className="border-t border-zinc-200 py-8 first:border-t-0 first:pt-0 dark:border-zinc-800"
    >
      <h3
        id={headingId}
        className="text-lg font-medium text-zinc-900 dark:text-white"
      >
        {decision.title}
      </h3>
      <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
        {decision.decision}
      </p>
      <Disclosure className="mt-4">
        <DisclosureTrigger>
          <button
            type="button"
            className="min-h-[44px] cursor-pointer text-sm font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
          >
            Why
          </button>
        </DisclosureTrigger>
        <DisclosureContent>
          <p className="max-w-[62ch] pb-2 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {decision.rationale}
          </p>
        </DisclosureContent>
      </Disclosure>
      {decision.outcome && (
        <p className="mt-4 max-w-[62ch] text-base leading-relaxed font-medium text-zinc-900 tabular-nums dark:text-white">
          {decision.outcome}
        </p>
      )}
      {figure}
    </article>
  );
}
