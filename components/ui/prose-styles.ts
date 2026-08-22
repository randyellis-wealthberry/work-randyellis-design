/**
 * The in-prose heading ladder, defined once.
 *
 * This governs any surface whose body is authored as prose rather than
 * assembled from section components — MDX blog posts and the legal documents.
 * It lived inside `app/blog/layout.tsx`, where the legal pages could not reach
 * it, so those pages fell through to `@tailwindcss/typography`'s defaults: a
 * blue-leaning gray ramp and a heading scale that has nothing to do with this
 * site's.
 *
 * The One Heading Ladder Rule allows two voices below the page title: the
 * Label that opens a section and the Subhead that names a thing inside it.
 * A Markdown heading cannot import `SectionLabel`, so the same three strings
 * are spelled as prose modifiers here.
 *
 * The deviation from the rule is at h2, and it is deliberate. A page-level
 * section is announced by a Label because a Label names a *region of the
 * page*. An article's section heading is part of the reading, and set at the
 * Label's 14px Quiet it rendered smaller and lighter than its own h3
 * subsections — which inverts the hierarchy the ladder exists to carry.
 * Headline (1.5rem / 600 / -0.03em) is already in the type scale for exactly
 * this and was going unused. The ladder then descends monotonically:
 * 48 / 24 / 16 / 14, Ink until the last step.
 *
 * `prose-zinc`, not `prose-gray`: gray is a blue-leaning family and the rest
 * of the site is one zinc ramp (The One Family Rule).
 */
export const PROSE_ARTICLE = [
  "prose prose-zinc dark:prose-invert pb-8",
  // Section opener — the SECTION rule, carrying the Headline voice.
  "prose-h2:mt-20 prose-h2:scroll-mt-10 prose-h2:border-t prose-h2:border-zinc-900 prose-h2:pt-10",
  "prose-h2:text-2xl prose-h2:leading-tight prose-h2:font-semibold prose-h2:tracking-[-0.03em] prose-h2:text-zinc-900",
  "dark:prose-h2:border-zinc-100 dark:prose-h2:text-white",
  // The named thing inside a section — Body at font-medium, in Ink. h3 takes
  // the Hairline (the second and last allowed rule weight, "for separating
  // peers inside a set") so a subsection is legible against a sub-subsection
  // without inventing a third type size the ladder does not have.
  "prose-h3:mt-12 prose-h3:border-t prose-h3:border-zinc-200 prose-h3:pt-6",
  "prose-h3:text-base prose-h3:font-medium prose-h3:text-zinc-900",
  "dark:prose-h3:border-zinc-800 dark:prose-h3:text-white",
  // Below the Subhead, the Label voice: smaller and quieter than the h3 above
  // it, so the ladder descends monotonically instead of flattening. A section
  // that wants a fourth level wants to be two sections, and the source is
  // where that gets fixed, not the CSS.
  "prose-h4:mt-8 prose-h4:text-sm prose-h4:font-medium prose-h4:tracking-[0.02em] prose-h4:text-zinc-500 dark:prose-h4:text-zinc-400",
  "prose-h5:mt-8 prose-h5:text-sm prose-h5:font-medium prose-h5:tracking-[0.02em] prose-h5:text-zinc-500 dark:prose-h5:text-zinc-400",
  "prose-h6:mt-8 prose-h6:text-sm prose-h6:font-medium prose-h6:tracking-[0.02em] prose-h6:text-zinc-500 dark:prose-h6:text-zinc-400",
  // A thematic break is the Hairline weight; and a `---` sitting directly
  // above an `##` stacks two rules of different weights, which is The
  // Two-Weight Rule's failure mode rather than its vocabulary.
  "prose-hr:border-zinc-200 dark:prose-hr:border-zinc-800 [&_hr:has(+h2)]:hidden",
  "prose-strong:font-medium",
  // Links are Ink with an Edge underline that darkens on hover — never a hue.
  "prose-a:font-medium prose-a:text-zinc-900 prose-a:decoration-zinc-300 prose-a:underline-offset-4 hover:prose-a:decoration-zinc-900",
  "dark:prose-a:text-white dark:prose-a:decoration-zinc-700 dark:hover:prose-a:decoration-zinc-100",
  // The Browser Surfaces Rule — verbatim from the case-study template's <main>.
  "caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900",
].join(" ");
