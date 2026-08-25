/**
 * The button vocabulary, defined once.
 *
 * DESIGN.md → Buttons: 8px radius, 44px minimum height, 12px/24px padding,
 * 1rem `font-medium`; `transition-colors` only — no lift, no shadow, no scale
 * on hover; focus is a 2px ring in Ink (Paper in dark) offset 2px against the
 * page ground; press is `active:scale-[0.98]`.
 *
 * These strings were typed out three times — `app/page.tsx`,
 * `app/services/services-client.tsx`, and `components/ui/cta-section.tsx` —
 * and had not yet drifted, which is the only reason they are still one
 * vocabulary. "Don't re-type section chrome inline on a page; import it, or
 * the next rule weight will drift" is the rule; a button is chrome by the same
 * argument.
 *
 * Plain strings rather than a component: these are handed to `CalButton`, to
 * `next/link`, and to bare `<a>` and `<button>` elements, and a wrapper that
 * has to forward every one of those is a worse abstraction than a constant.
 * Compose with `cn()` at the call site to add or override.
 */
export const BUTTON_BASE =
  "inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none active:scale-[0.98] dark:focus-visible:ring-offset-zinc-950";

/** Ink fill, Paper label; inverted in dark. One primary per surface. */
export const PRIMARY_BUTTON = `${BUTTON_BASE} bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:ring-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-white`;

/** Transparent with a 1px Edge stroke; hover darkens the stroke and fills Wash. */
export const SECONDARY_BUTTON = `${BUTTON_BASE} border border-zinc-300 text-zinc-900 hover:border-zinc-400 hover:bg-zinc-100 focus-visible:ring-zinc-400 dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-500`;

/**
 * The secondary with room for a trailing `ArrowUpRight`. The Departure Marking
 * Rule puts a 16px arrow after an outbound label, and the gap is the only
 * difference between this and `SECONDARY_BUTTON` — spelled out here rather
 * than appended at one call site, so the next outbound action matches it.
 */
export const SECONDARY_BUTTON_OUTBOUND = `${SECONDARY_BUTTON} gap-1.5`;
