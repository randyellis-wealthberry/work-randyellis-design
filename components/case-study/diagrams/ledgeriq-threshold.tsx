"use client";

/**
 * LedgerIQ — moving the line, or moving what the line sits between.
 *
 * The decision this illustrates is "fixing false positives with context, not
 * thresholds". It is an argument about overlap, so it is drawn as overlap:
 * two distributions on one axis, ordinary payroll variation and actual fraud,
 * with a cut somewhere between them. Nothing else states the trade as
 * economically — wherever the cut goes, one of the two errors grows.
 *
 * The upper panel is the fast fix. The cut slides, and the two brackets under
 * the axis grow and shrink against each other. The lower panel is what shipped:
 * bonus cycles, commission structures and seasonal overtime stop reading as
 * anomalies once the model knows what month it is, so ordinary variation
 * tightens and the two shapes pull apart. The cut has somewhere to go that is
 * not a compromise, and both brackets shrink at once.
 *
 * The curves are schematic and the figure says so. No measured distribution
 * exists in the case study, and drawing one with plausible-looking tails would
 * be inventing the exact evidence the decision claims to have.
 *
 * Inversion is spent once, on the gap the context opens up, because that gap is
 * the whole product of the slower fix.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
const bell = (cx: number, halfWidth: number, height: number, base: number) =>
  `M ${cx - halfWidth},${base} C ${cx - halfWidth / 2},${base} ${cx - halfWidth / 2},${base - height} ${cx},${base - height} C ${cx + halfWidth / 2},${base - height} ${cx + halfWidth / 2},${base} ${cx + halfWidth},${base}`;

export function LedgerIqThresholdDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 640"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="ledgeriq-threshold-title ledgeriq-threshold-desc"
    >
      <title id="ledgeriq-threshold-title">
        Two ways to separate ordinary payroll from fraud
      </title>
      <desc id="ledgeriq-threshold-desc">
        Two panels, each showing the same pair of schematic distributions on one
        axis: a large one for ordinary payroll variation and a smaller one for
        actual fraud, with a vertical cut between them marking where the system
        raises a flag. The curves are labelled as shapes rather than
        measurements, because no measured distribution appears in the case
        study. In the upper panel, the fast fix, the two shapes overlap heavily
        and the cut can only slide: pushed right, fraud passes underneath it;
        pushed left, honest employees are flagged. Two brackets under the axis
        name those errors, and arrows show that shrinking one grows the other.
        In the lower panel, what shipped, the model has been taught the shape of
        normal payroll — bonus cycles, commission structures and seasonal
        overtime, annotated as feeding the ordinary-variation curve — so that
        curve tightens and the two shapes pull apart, opening a gap. The cut
        sits in the gap and both brackets shrink at once. A note records the
        cost: teaching a model what normal looks like is far slower than moving
        a number, and it is the only version that improves both errors together.
      </desc>
      <defs>
        <marker
          id="lt-arrow-quiet"
          markerWidth="7"
          markerHeight="6"
          refX="6"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 7 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ PANEL A — MOVE THE LINE ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE FAST FIX · MOVE THE THRESHOLD
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      <path
        d={bell(380, 250, 130, 240)}
        fill="var(--dg-quiet)"
        fillOpacity="0.16"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <path
        d={bell(590, 170, 76, 240)}
        fill="var(--dg-quiet)"
        fillOpacity="0.16"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <line
        x1="130"
        y1="240"
        x2="860"
        y2="240"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      <text
        x="380"
        y="132"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        Ordinary payroll variation
      </text>
      <text
        x="640"
        y="176"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        Actual fraud
      </text>

      {/* the cut */}
      <line
        x1="500"
        y1="98"
        x2="500"
        y2="252"
        stroke="var(--dg-quiet)"
        strokeWidth="1.4"
      />
      <text
        x="500"
        y="90"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        THE CUT
      </text>
      <line
        x1="466"
        y1="112"
        x2="440"
        y2="112"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        markerEnd="url(#lt-arrow-quiet)"
      />
      <line
        x1="534"
        y1="112"
        x2="560"
        y2="112"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        markerEnd="url(#lt-arrow-quiet)"
      />

      {/* the two errors, as brackets rather than shaded areas */}
      <path
        d="M 420,258 V 266 H 500 V 258"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="460"
        y="282"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        HONEST WORK, FLAGGED
      </text>
      <path
        d="M 500,258 V 266 H 610 V 258"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="555"
        y="296"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        FRAUD, MISSED
      </text>
      <text x="40" y="282" fill="var(--dg-prose)" fontSize="11">
        Shrink one and
      </text>
      <text x="40" y="300" fill="var(--dg-prose)" fontSize="11">
        the other grows.
      </text>
      <text x="40" y="322" fill="var(--dg-quiet)" fontSize="11">
        In payroll, neither
      </text>
      <text x="40" y="340" fill="var(--dg-quiet)" fontSize="11">
        error is survivable.
      </text>

      {/* ============ PANEL B — MOVE THE DISTRIBUTION ============ */}
      <line
        x1="40"
        y1="362"
        x2="920"
        y2="362"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="392"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED · TEACH IT THE SHAPE OF NORMAL PAYROLL
      </text>

      <path
        d={bell(360, 150, 150, 520)}
        fill="var(--dg-ink)"
        fillOpacity="0.1"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <path
        d={bell(700, 140, 76, 520)}
        fill="var(--dg-quiet)"
        fillOpacity="0.16"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <line
        x1="130"
        y1="520"
        x2="880"
        y2="520"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      <text
        x="222"
        y="440"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        BONUS CYCLES
      </text>
      <text
        x="222"
        y="456"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        COMMISSION STRUCTURES
      </text>
      <text
        x="222"
        y="472"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        SEASONAL OVERTIME
      </text>
      <path
        d="M 232,456 H 280"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="360"
        y="460"
        fill="var(--dg-ink)"
        fontSize="11"
        textAnchor="middle"
      >
        Ordinary payroll variation, explained
      </text>
      <text
        x="740"
        y="424"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        Actual fraud
      </text>

      {/* the gap */}
      <rect
        x="510"
        y="486"
        width="140"
        height="18"
        rx="3"
        fill="var(--dg-ink)"
      />
      <text
        x="580"
        y="499"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        A GAP TO CUT IN
      </text>
      <line
        x1="580"
        y1="504"
        x2="580"
        y2="532"
        stroke="var(--dg-ink)"
        strokeWidth="1.4"
      />
      <path
        d="M 548,538 V 546 H 612 V 538"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="580"
        y="562"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        BOTH ERRORS SMALLER AT ONCE
      </text>

      <text x="40" y="580" fill="var(--dg-quiet)" fontSize="11">
        Curves are shapes, not measurements.
      </text>
      <text x="40" y="598" fill="var(--dg-quiet)" fontSize="11">
        Far slower than moving a number, and the only
      </text>
      <text x="40" y="616" fill="var(--dg-quiet)" fontSize="11">
        version that improves both errors together.
      </text>
    </svg>
  );
}
