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
 */
export function DiagramFigure({
  caption,
  minWidth,
  children,
}: {
  /** The claim the diagram makes, in the page's voice. Not a restatement of it. */
  caption: string;
  /** Width below which the figure scrolls instead of shrinking, in px. */
  minWidth: number;
  children: React.ReactNode;
}) {
  return (
    <figure className="diagram-figure mt-6">
      <div className="overflow-x-auto">
        <div style={{ minWidth }}>{children}</div>
      </div>
      <figcaption className="mt-5 max-w-[68ch] text-base text-zinc-500 dark:text-zinc-400">
        {caption}
      </figcaption>
    </figure>
  );
}
