"use client";

export type TocItem = {
  /** Must match the target section's `id`. */
  id: string;
  label: string;
};

type CaseStudyTOCProps = {
  items: TocItem[];
  /** Section id for this nav, used to build its heading id (D-12). */
  sectionId?: string;
};

/**
 * In-page anchor nav for a long case study.
 *
 * Plain anchors, no scroll-spy: the scroll listener a spy needs would run on
 * every frame for a purely decorative highlight, and native anchors already
 * give keyboard and screen-reader users the jump targets that matter. The page
 * also carries one scroll-linked element already — the margin rail — and a
 * second would break The One Crank Rule.
 *
 * Reads as a contents line rather than a boxed widget: a hairline above, the
 * labels in the subordinate voice, and the section names verbatim so the nav
 * and the headings it points at never drift apart.
 */
export function CaseStudyTOC({
  items,
  sectionId = "case-study-toc",
}: CaseStudyTOCProps) {
  if (items.length === 0) return null;

  const headingId = `${sectionId}-heading`;

  return (
    <nav
      id={sectionId}
      aria-labelledby={headingId}
      className="border-t border-zinc-200 pt-5 dark:border-zinc-800"
    >
      <h2
        id={headingId}
        className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400"
      >
        On this page
      </h2>
      <ul className="mt-2 flex flex-wrap gap-x-6">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="-my-2 inline-flex min-h-[44px] items-center text-base text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
