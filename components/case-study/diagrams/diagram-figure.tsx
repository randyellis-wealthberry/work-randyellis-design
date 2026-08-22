"use client";

/**
 * The frame every case-study diagram sits in.
 *
 * Two jobs. First, a diagram is a figure, not decoration: it gets `<figure>` /
 * `<figcaption>` so the caption is bound to the image rather than floating
 * after it, and the SVG itself carries `role="img"` with a `<title>`/`<desc>`
 * pair for anyone who never sees it.
 *
 * Second, a diagram has a width below which it stops being legible. Rather
 * than let it squeeze to illegibility on a phone, it holds `minWidth` and
 * scrolls inside its own container — the page body never scrolls sideways.
 *
 * That scroll costs something a mouse hides: browsers leave a plain
 * `overflow-x` div out of the tab order, so a keyboard-only reader would get
 * whatever fits and no way to reach the rest. The container is therefore a
 * named, focusable group, which is what makes arrow-key scrolling possible.
 * It stays focusable at every width on purpose — whether a figure scrolls is a
 * function of viewport *and* zoom, and a reader at 400% meets the same wall on
 * a desktop that a phone hits at 375px.
 */
export function DiagramFigure({
  caption,
  label,
  minWidth,
  children,
}: {
  /** The claim the diagram makes, in the page's voice. Not a restatement of it. */
  caption: string;
  /** Names the scrollable region for anyone who reaches it by keyboard. */
  label: string;
  /** Width below which the figure scrolls instead of shrinking, in px. */
  minWidth: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="diagram-figure mt-6">
      <div
        tabIndex={0}
        role="group"
        aria-label={label}
        className="overflow-x-auto rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-zinc-900 dark:focus-visible:outline-zinc-100"
      >
        <div style={{ minWidth }}>{children}</div>
      </div>
      <figcaption className="mt-5 max-w-[68ch] text-base text-zinc-500 dark:text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  );
}
