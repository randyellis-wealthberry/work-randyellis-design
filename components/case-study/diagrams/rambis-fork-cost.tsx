"use client";

/**
 * Rambis UI — a cost paid once against a cost paid by everyone.
 *
 * The decision this illustrates is "forking Chakra UI instead of starting from
 * a clean sheet". Both routes cost something; the argument is that they cost
 * something with different shapes, and shape is what a figure can show that a
 * sentence cannot.
 *
 * So the horizontal axis is adopters, not time. A clean sheet charges every
 * developer who ever picks the system up the same relearning fee — the bars
 * repeat, and the total has no ceiling because there is always another adopter.
 * A fork charges almost nothing per adopter, because the API is already in
 * their hands, and instead carries one block at the origin that never goes
 * away: the foundation someone else designed, inherited whole.
 *
 * Nothing here is measured and the figure says so. The case study reports no
 * onboarding times, and putting hours on these bars would turn an argument
 * about shape into a fabricated benchmark.
 *
 * Inversion is spent once, on the inherited foundation, because that block is
 * what the decision actually bought — the good parts and the awkward ones, now
 * permanently his.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function RambisForkCostDiagram() {
  const adopters = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="rambis-cost-title rambis-cost-desc"
    >
      <title id="rambis-cost-title">
        A relearning fee charged per adopter, against a foundation inherited
        once
      </title>
      <desc id="rambis-cost-desc">
        Two rows sharing one horizontal axis, where the axis is adopters rather
        than time — the first developer to pick the system up, the second, and
        so on, with the row continuing past the edge of the figure because there
        is always another. The upper row, dashed because it was refused, is a
        clean-sheet system: an identical relearning cost is charged at every
        adopter, so the bars repeat forever and the total has no ceiling. The
        lower row is the fork: the per-adopter bars are almost nothing, because
        the component API is one people already have in their hands. In its
        place, at the origin, sits a single solid block that never goes away —
        the foundation inherited wholesale from Chakra UI, its good decisions
        and its awkward ones together, now permanently the maintainer&apos;s to
        carry. A note states that neither row is measured: no onboarding times
        appear in the case study, and the bars show the shape of each cost
        rather than its size.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE AXIS IS ADOPTERS, NOT TIME — THERE IS ALWAYS ANOTHER ONE
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ CLEAN SHEET — A FEE AT EVERY ADOPTER ============ */}
      <text x="40" y="110" fill="var(--dg-quiet)" fontSize="13">
        A clean sheet
      </text>
      <text
        x="40"
        y="128"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        A NEW API TO LEARN
      </text>

      {adopters.map((index) => (
        <rect
          key={index}
          x={220 + index * 88}
          y="96"
          width="56"
          height="96"
          fill="none"
          stroke="var(--dg-quiet)"
          strokeWidth="1"
          strokeDasharray="4,4"
        />
      ))}
      <text
        x="916"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="20"
        textAnchor="end"
      >
        …
      </text>
      <line
        x1="220"
        y1="192"
        x2="920"
        y2="192"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="220"
        y="214"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE SAME FEE, CHARGED AGAIN, EVERY TIME SOMEONE PICKS IT UP
      </text>
      <text x="220" y="240" fill="var(--dg-prose)" fontSize="11">
        Paid by every user of the system, forever, and it never gets cheaper.
      </text>

      {/* ============ THE FORK — ONE BLOCK, THEN ALMOST NOTHING ============ */}
      <line
        x1="40"
        y1="276"
        x2="920"
        y2="276"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text x="40" y="322" fill="var(--dg-ink)" fontSize="13">
        The fork
      </text>
      <text
        x="40"
        y="340"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        AN API THEY ALREADY HAVE
      </text>

      <rect x="220" y="308" width="56" height="152" fill="var(--dg-ink)" />
      <text
        x="248"
        y="356"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        PAID
      </text>
      <text
        x="248"
        y="372"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        ONCE
      </text>

      {adopters.slice(1).map((index) => (
        <rect
          key={index}
          x={220 + index * 88}
          y="444"
          width="56"
          height="16"
          fill="var(--dg-quiet)"
          opacity="0.5"
        />
      ))}
      <text
        x="916"
        y="458"
        fill="var(--dg-quiet)"
        fontSize="20"
        textAnchor="end"
      >
        …
      </text>
      <line
        x1="220"
        y1="460"
        x2="920"
        y2="460"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      <path
        d="M 248,300 V 288 H 420"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="428"
        y="292"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE FOUNDATION, INHERITED WHOLE — GOOD DECISIONS AND AWKWARD ONES
        TOGETHER
      </text>

      <text
        x="320"
        y="484"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        NEARLY NOTHING PER ADOPTER — THE API IS ALREADY IN THEIR HANDS
      </text>

      <line
        x1="40"
        y1="506"
        x2="920"
        y2="506"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text x="40" y="530" fill="var(--dg-ink)" fontSize="11">
        Adoption is the hard part of a design system, not construction — so the
        cost worth minimising is the recurring one.
      </text>
      <text x="40" y="550" fill="var(--dg-quiet)" fontSize="11">
        Neither row is measured. No onboarding times appear in the case study,
        and these bars are shapes rather than sizes.
      </text>
    </svg>
  );
}
