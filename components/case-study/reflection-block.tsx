"use client";

import { SectionLabel, SECTION } from "./section-chrome";

type ReflectionBlockProps = {
  reflection: string;
  /** Overrides the default heading, e.g. "What I'd Do Differently". */
  heading?: string;
  sectionId?: string;
};

/**
 * Closing reflection — what the person took away, in their own voice.
 *
 * Held apart from `outcome` deliberately: outcome is what the project did,
 * reflection is what the person learned. Collapsing them is how case studies
 * end up restating metrics and calling it insight.
 *
 * Opens like every other section on the page — one rule at full contrast and a
 * label — rather than as a quoted callout with its own left border.
 */
export function ReflectionBlock({
  reflection,
  heading = "Looking back",
  sectionId = "reflection",
}: ReflectionBlockProps) {
  const headingId = `${sectionId}-heading`;

  return (
    <section id={sectionId} aria-labelledby={headingId} className={SECTION}>
      <SectionLabel id={headingId}>{heading}</SectionLabel>
      <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        {reflection}
      </p>
    </section>
  );
}
