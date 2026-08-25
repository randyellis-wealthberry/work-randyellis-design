import { PROSE_ARTICLE } from "@/components/ui/prose-styles";

/**
 * The shell both legal documents render into.
 *
 * Each page had typed its own, identically, and each got three things wrong:
 *
 *   1. **No `<main>` landmark.** These were the only two routes on the site
 *      with no landmark at all — which is how the header and footer contrast
 *      bug hid from three audit passes, since the audit scoped itself to
 *      `<main>` and these pages had none to scope to.
 *   2. **A second container.** `mx-auto max-w-4xl px-4` sat *inside*
 *      `RouteContainer`, which already centres the column and already applies
 *      `px-4 / sm:px-6 / lg:px-8`. The measure was clamped to the parent's
 *      768px anyway so `max-w-4xl` did nothing, but the gutter doubled — 32px
 *      of padding on a 390px screen instead of 16px. DESIGN.md: "Do change a
 *      route's measure in `RouteContainer` so header, content, and footer move
 *      together."
 *   3. **An off-system title.** `text-3xl font-bold` — 700 is a weight the
 *      type scale does not contain, and Display is 2.25rem → 3rem at 600.
 *
 * The body inherits `PROSE_ARTICLE`, the same in-prose ladder the blog runs,
 * so a numbered clause and an article section are set the same way.
 */
export function LegalDocument({
  title,
  updated,
  updatedLabel,
  children,
}: {
  title: string;
  /** ISO date for the `<time>` element's `dateTime`. */
  updated: string;
  /** The human-readable form, e.g. "19 August 2026". */
  updatedLabel: string;
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
    >
      <div className="pt-12">
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          {title}
        </h1>
        {/* Footnote voice. The date is tabular because it is a figure a reader
            compares against the last version they read. */}
        <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
          Last updated:{" "}
          <time dateTime={updated} className="tabular-nums">
            {updatedLabel}
          </time>
        </p>
      </div>

      <div className={PROSE_ARTICLE}>{children}</div>
    </main>
  );
}
