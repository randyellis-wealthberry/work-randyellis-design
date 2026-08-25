"use client";

/**
 * GrowIt! — what a contribution mechanic buys, and what it spends.
 *
 * The decision this illustrates is "a rating mechanic designed for volume, not
 * depth". It is an exchange, not a flow, so nothing here is a box joined by an
 * arrow: it is two rectangles on one pair of axes, where height is how much
 * signal a single interaction yields and width is how many interactions a
 * design can expect. Area is total signal, and the whole argument is that the
 * short wide rectangle encloses more of it than the tall narrow one.
 *
 * Both rectangles are anchored at the same origin because they are alternatives
 * for the same slot, not sequential states. They overlap near it, which is
 * correct: the first stretch of contributors would have written a review under
 * either design.
 *
 * Only the shipped rectangle carries numbers. The written-review alternative
 * was never built, so its dimensions are drawn as a direction and labelled
 * unmeasured rather than given a fabricated width — a chart is the easiest
 * place in the world to imply a measurement that never happened.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function GrowItRatingVolumeDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="growit-rating-title growit-rating-desc"
    >
      <title id="growit-rating-title">
        Signal per interaction against the number of interactions
      </title>
      <desc id="growit-rating-desc">
        Two rectangles sharing one pair of axes. The vertical axis is how much
        signal a single contribution yields; the horizontal axis is how many
        contributions the design can expect. Area is therefore total signal.
        Anchored at the origin is a tall, narrow, dashed rectangle: the written
        review — stars, tags and commentary — which yields far more per
        interaction and would have come from very few people. Its width is
        marked unmeasured, because that alternative was never built and giving
        it a number would imply a measurement that never happened. Anchored at
        the same origin is a short, very wide rectangle drawn in solid ink: the
        single low-effort tap that shipped. It yields little per interaction and
        runs almost the full width of the chart, carrying the figures the page
        reports — 3.4 million photo ratings against 350,000 uploads, roughly ten
        ratings for every photo contributed. The two overlap near the origin,
        which is correct: the people who would have written a review still tap.
        The note beneath states the exchange plainly — the signal per
        interaction is worse, and there is enormously more of it.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ AXES ============ */}
      <line
        x1="150"
        y1="96"
        x2="150"
        y2="392"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <line
        x1="150"
        y1="392"
        x2="912"
        y2="392"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="-244"
        y="72"
        transform="rotate(-90)"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        SIGNAL PER INTERACTION
      </text>
      <text
        x="531"
        y="422"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        NUMBER OF INTERACTIONS
      </text>
      <text
        x="150"
        y="452"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        area is total signal · neither axis is to scale · the tap&apos;s counts
        are measured, the review&apos;s are not
      </text>

      {/* ============ THE RECTANGLE THAT SHIPPED (FOCAL) ============ */}
      <rect
        x="150"
        y="316"
        width="700"
        height="76"
        fill="var(--dg-wash)"
        stroke="var(--dg-ink)"
        strokeWidth="1.4"
      />
      <text
        x="560"
        y="348"
        fill="var(--dg-ink)"
        fontSize="13"
        textAnchor="middle"
      >
        One tap — no writing, almost no thought
      </text>
      <text
        x="560"
        y="370"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        3.4M RATINGS · 350K UPLOADS · ROUGHLY TEN RATINGS PER PHOTO
      </text>

      {/* ============ THE RECTANGLE NOT BUILT ============ */}
      <rect
        x="150"
        y="120"
        width="120"
        height="272"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="210"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        A written
      </text>
      <text
        x="210"
        y="168"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        review
      </text>
      <text
        x="210"
        y="192"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        stars · tags
      </text>
      <text
        x="210"
        y="206"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        commentary
      </text>

      {/* width call-out on the unbuilt rectangle */}
      <line
        x1="150"
        y1="106"
        x2="270"
        y2="106"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <line
        x1="150"
        y1="100"
        x2="150"
        y2="112"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <line
        x1="270"
        y1="100"
        x2="270"
        y2="112"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="286"
        y="110"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        WIDTH UNMEASURED — THIS VERSION WAS NEVER BUILT
      </text>

      {/* ============ ANNOTATIONS ============ */}
      <text
        x="456"
        y="176"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE EXCHANGE
      </text>
      <text x="456" y="200" fill="var(--dg-prose)" fontSize="11">
        Better data per contribution, from the few people
      </text>
      <text x="456" y="218" fill="var(--dg-prose)" fontSize="11">
        who would ever write one — against worse data per
      </text>
      <text x="456" y="236" fill="var(--dg-prose)" fontSize="11">
        contribution from very nearly everybody.
      </text>
      <text x="456" y="268" fill="var(--dg-ink)" fontSize="11">
        The ratio is the mechanic working, not traffic.
      </text>

      {/* overlap note */}
      <path
        d="M 210,316 V 296 H 286"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="292"
        y="299"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        THE OVERLAP — A REVIEWER STILL TAPS
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="472"
        x2="920"
        y2="472"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="500"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        LEGEND
      </text>
      <rect
        x="140"
        y="490"
        width="24"
        height="12"
        fill="var(--dg-wash)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="174"
        y="500"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the mechanic that shipped
      </text>
      <rect
        x="452"
        y="490"
        width="24"
        height="12"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="486"
        y="500"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The richer mechanic, never built
      </text>
    </svg>
  );
}
