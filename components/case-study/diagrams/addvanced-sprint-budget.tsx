"use client";

/**
 * Addvance — a fixed two weeks, spent two ways.
 *
 * The decision this illustrates is "cut tracking depth to protect the network
 * feature". It is an allocation, so it is drawn as one: blocks whose widths are
 * shares of the same sprint and whose heights are how far each feature got.
 * The device that makes it an argument rather than a bar chart is the line
 * across both panels — the depth below which a prototype cannot answer the
 * question it was built to ask.
 *
 * The upper panel is what the sprint would have produced spread evenly: three
 * features, none of them over the line, and therefore nothing learned about any
 * of them. Only two are named, because only two are named in the case study;
 * the third stays blank rather than becoming an invented feature to round out
 * the picture.
 *
 * The lower panel is what shipped, including the part that did not work.
 * Tracking sits below the line on purpose, and the complaint it drew is
 * attached to it rather than left out — the cost landed exactly where the
 * decision put it, which is the strongest thing that can be said for a
 * deliberate trade.
 *
 * Inversion is spent once, on referral discovery, because clearing the line on
 * the risky feature is what the whole sprint was rearranged to buy.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function AddvancedSprintBudgetDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="addvanced-budget-title addvanced-budget-desc"
    >
      <title id="addvanced-budget-title">
        The same two weeks, spread evenly or spent on the risky half
      </title>
      <desc id="addvanced-budget-desc">
        Two panels showing the same fixed sprint allocated two ways. Width is
        the share of the two weeks a feature gets; height is how far it got. A
        dashed line runs across both panels marking the depth below which a
        prototype cannot answer the question it was built to ask. The upper
        panel, dashed because it was refused, splits the sprint evenly into
        three equal blocks — application tracking, referral discovery, and a
        third left unnamed because the case study names only two — and none of
        the three reaches the line. The lower panel is what shipped: referral
        discovery takes the larger share and is drawn inverted, clearing the
        line comfortably, while application tracking takes a narrow share and
        stops well below it. A note attached to the tracking block records what
        that cost — thin tracking was the single most common complaint in
        testing, noticed immediately and said out loud — alongside the reason it
        was accepted: tracking is table stakes that every competing product
        already does, and the differentiation lived in surfacing referral paths
        a job seeker could not see on their own.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ PANEL A — SPREAD IT EVENLY ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE SPRINT, SPREAD EVENLY
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      <line
        x1="120"
        y1="140"
        x2="900"
        y2="140"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="6,4"
      />
      <text
        x="120"
        y="132"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        DEEP ENOUGH TO ANSWER THE QUESTION IT WAS BUILT TO ASK
      </text>

      <rect
        x="120"
        y="190"
        width="244"
        height="60"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="242"
        y="226"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        Application tracking
      </text>
      <rect
        x="388"
        y="190"
        width="244"
        height="60"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="510"
        y="226"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        Referral discovery
      </text>
      <rect
        x="656"
        y="190"
        width="244"
        height="60"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="778"
        y="226"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        UNNAMED — THE CASE STUDY NAMES TWO
      </text>

      <line
        x1="120"
        y1="250"
        x2="900"
        y2="250"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="120"
        y="272"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        TEN WORKING DAYS · THE WHOLE WIDTH, EITHER WAY
      </text>
      <text x="120" y="298" fill="var(--dg-prose)" fontSize="11">
        Three features, none of them over the line — which means the sprint ends
        without an answer about any of them.
      </text>

      {/* ============ PANEL B — WHAT SHIPPED ============ */}
      <line
        x1="40"
        y1="330"
        x2="920"
        y2="330"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="360"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED · ONE THING FAR ENOUGH TO TEST
      </text>

      <line
        x1="120"
        y1="410"
        x2="900"
        y2="410"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="6,4"
      />
      <text
        x="900"
        y="402"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
        letterSpacing="0.16em"
      >
        THE SAME LINE
      </text>

      <rect x="120" y="370" width="512" height="150" fill="var(--dg-ink)" />
      <text
        x="376"
        y="440"
        fill="var(--dg-paper)"
        fontSize="13"
        textAnchor="middle"
      >
        Referral discovery
      </text>
      <text
        x="376"
        y="462"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        opacity="0.85"
      >
        THE PART NOBODY ELSE WAS DOING
      </text>

      {/* The line continues across the block that clears it — drawn in paper so
          it stays visible against the ink. */}
      <line
        x1="120"
        y1="410"
        x2="632"
        y2="410"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        strokeDasharray="6,4"
        opacity="0.55"
      />
      <rect
        x="656"
        y="480"
        width="244"
        height="40"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="778"
        y="505"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="middle"
      >
        Application tracking
      </text>

      <line
        x1="120"
        y1="520"
        x2="900"
        y2="520"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      <path
        d="M 778,530 V 542"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="900"
        y="556"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
        letterSpacing="0.16em"
      >
        THE COST, WHERE IT WAS PUT
      </text>
      <text
        x="900"
        y="578"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="end"
      >
        The single most common complaint in testing.
      </text>

      <text x="120" y="556" fill="var(--dg-ink)" fontSize="11">
        Tracking is table stakes: every competitor already
      </text>
      <text x="120" y="574" fill="var(--dg-ink)" fontSize="11">
        has it, and doing it slightly better changes nobody&apos;s
      </text>
      <text x="120" y="592" fill="var(--dg-ink)" fontSize="11">
        mind. The risky half was the half worth testing.
      </text>
    </svg>
  );
}
