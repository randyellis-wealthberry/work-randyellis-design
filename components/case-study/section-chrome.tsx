"use client";

import { ScrambleSectionTitle } from "@/components/ui/scramble-section-title";

/**
 * How a section opens, defined once.
 *
 * Every case-study section — the template's own and the ones a page brings with
 * it — uses these, so a rule weight or a label colour cannot drift between the
 * shared surface and a bespoke one.
 */

/**
 * Opens a section: one rule at full Ink/Paper contrast. The scroll margin is
 * for the contents line — an anchored section that lands with its rule flush
 * against the viewport edge reads as a page cut off mid-sentence.
 */
export const SECTION =
  "mt-20 scroll-mt-10 border-t border-zinc-900 pt-10 dark:border-zinc-100";

/** The section label voice: Label size, subordinate tone. */
export const LABEL =
  "text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400";

/** A hairline row: the term sized to the term, never to half the container. */
export const ROW =
  "grid grid-cols-1 border-t border-zinc-200 py-5 sm:grid-cols-[minmax(0,18rem)_1fr] dark:border-zinc-800";

/** Section heading: scrambles once on entry, then holds. */
export function SectionLabel({
  children,
  id,
}: {
  children: string;
  id?: string;
}) {
  return (
    <ScrambleSectionTitle as="h2" id={id} className={LABEL}>
      {children}
    </ScrambleSectionTitle>
  );
}
