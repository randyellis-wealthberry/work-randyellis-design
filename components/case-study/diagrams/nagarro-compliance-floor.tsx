"use client";

/**
 * Nagarro — where the ruler stops.
 *
 * The decision this illustrates is "aiming past the compliance floor". It is an
 * argument about measurement, so the figure is a scale: a vertical axis with
 * tick marks up to the conformance line and no tick marks at all above it. That
 * blank upper region is the whole point — the target the strategy actually aims
 * at sits in the part of the scale that cannot be scored, which is exactly why
 * it is the harder thing to fund and the first thing to be cut.
 *
 * Two aims are drawn against the same scale. One stops at the line, where the
 * audit is, and is labelled with what it buys: a number, a defensible story,
 * something anyone can check. The other continues into the unruled region and
 * is labelled with what it costs.
 *
 * The gap between them carries the sentence the whole decision rests on: it is
 * entirely possible to pass and still ship something a disabled person cannot
 * use.
 *
 * Inversion is spent once, on the target above the line.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function NagarroComplianceFloorDiagram() {
  const ticks = [0, 1, 2, 3, 4, 5, 6];

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="nagarro-floor-title nagarro-floor-desc"
    >
      <title id="nagarro-floor-title">
        The part of accessibility that can be scored, and the part above it
      </title>
      <desc id="nagarro-floor-desc">
        A vertical scale. The lower portion carries evenly spaced tick marks and
        is labelled as the measurable region, ending at a solid line: WCAG
        conformance, the part anyone can audit. Above that line the scale
        continues but has no tick marks at all, and is labelled &ldquo;genuinely
        usable by a disabled person — no score exists here&rdquo;. Two aims are
        drawn against it. The first, quiet, stops exactly at the line and is
        annotated with what stopping there buys: a number to report, a
        defensible story, a goal that is easy to fund. The second, drawn in
        solid ink, continues up into the unruled region and is annotated with
        what it costs: no score to report against, and the standing risk that in
        an IT consultancy an unmeasurable goal is the first one cut. Between
        them, in the gap above the line, sits the sentence the decision rests on
        — that it is entirely possible to pass an audit and still ship something
        a disabled user cannot actually use. A closing note records that the
        conformance line stayed in the strategy as the minimum rather than the
        target.
      </desc>
      <defs>
        <marker
          id="nf-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="nf-arrow-focal"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-ink)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        ONE SCALE, AND THE POINT WHERE IT STOPS HAVING MARKS
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ THE SCALE ============ */}
      <line
        x1="300"
        y1="96"
        x2="300"
        y2="452"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      {/* measurable region: ticks */}
      {ticks.map((tick) => {
        const y = 452 - tick * 22;

        return (
          <line
            key={tick}
            x1="292"
            y1={y}
            x2="308"
            y2={y}
            stroke="var(--dg-edge)"
            strokeWidth="1"
          />
        );
      })}
      <text
        x="276"
        y="392"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
        letterSpacing="0.16em"
      >
        MEASURABLE
      </text>
      <text
        x="276"
        y="408"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        auditable · scoreable · fundable
      </text>

      {/* the conformance line */}
      <line
        x1="180"
        y1="320"
        x2="880"
        y2="320"
        stroke="var(--dg-ink)"
        strokeWidth="1.4"
      />
      <text
        x="880"
        y="312"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
        letterSpacing="0.16em"
      >
        WCAG CONFORMANCE · THE PART ANYONE CAN AUDIT
      </text>

      {/* unruled region above */}
      <rect
        x="180"
        y="112"
        width="700"
        height="204"
        rx="4"
        fill="var(--dg-wash)"
        fillOpacity="0.5"
      />
      <text
        x="276"
        y="176"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
        letterSpacing="0.16em"
      >
        NO MARKS HERE
      </text>
      <text
        x="276"
        y="192"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        nothing to score against
      </text>
      <text
        x="530"
        y="150"
        fill="var(--dg-ink)"
        fontSize="14"
        textAnchor="middle"
      >
        Genuinely usable by a disabled person
      </text>

      {/* the sentence that lives in the gap */}
      <text
        x="530"
        y="248"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="middle"
      >
        It is entirely possible to pass the audit and ship
      </text>
      <text
        x="530"
        y="266"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="middle"
      >
        something a disabled user cannot actually use.
      </text>
      <text
        x="530"
        y="290"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        THIS GAP IS WHAT THE DECISION IS ABOUT
      </text>

      {/* ============ THE TWO AIMS ============ */}
      <line
        x1="400"
        y1="440"
        x2="400"
        y2="330"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#nf-arrow-quiet)"
      />
      <text
        x="400"
        y="470"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        AIM AT THE LINE
      </text>
      <text
        x="400"
        y="492"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        A number to report. A defensible
      </text>
      <text
        x="400"
        y="510"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        story. Easy to fund.
      </text>

      <line
        x1="680"
        y1="440"
        x2="680"
        y2="164"
        stroke="var(--dg-ink)"
        strokeWidth="1.4"
        markerEnd="url(#nf-arrow-focal)"
      />
      <text
        x="680"
        y="470"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        AIM ABOVE IT
      </text>
      <text
        x="680"
        y="492"
        fill="var(--dg-ink)"
        fontSize="11"
        textAnchor="middle"
      >
        No score to report against — and in an IT
      </text>
      <text
        x="680"
        y="510"
        fill="var(--dg-ink)"
        fontSize="11"
        textAnchor="middle"
      >
        consultancy, unmeasurable goals get cut first.
      </text>

      <line
        x1="40"
        y1="530"
        x2="920"
        y2="530"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text x="40" y="552" fill="var(--dg-prose)" fontSize="11">
        The line stayed in the strategy — as the minimum, not the target. What
        it cost was the simpler story.
      </text>
    </svg>
  );
}
