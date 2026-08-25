"use client";

/**
 * GrowIt! — the radius that widens rather than let a feed go empty.
 *
 * The decision this illustrates is "widening the radius instead of shipping an
 * empty feed": location-scoped discovery expanded its own radius when local
 * density could not fill a feed. Drawn as a loop rather than a pipeline,
 * because the mechanism is a re-query — the feed request comes back through
 * the same door at a wider scope until it clears. The branch that was refused
 * is drawn dashed and terminal, since a blank screen is where strict scoping
 * actually ends.
 *
 * The right panel exists because the cost of the rule is the argument. Volume
 * and climate fit run in opposite directions with every step out, which is a
 * shape rather than a number — the bars are marked directional so they are not
 * read as measurements.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function GrowItRadiusDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 900 540"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="growit-radius-title growit-radius-desc"
    >
      <title id="growit-radius-title">
        Scope loosens so the feed never empties
      </title>
      <desc id="growit-radius-desc">
        Two panels. On the left, a feed request scoped to the user&apos;s
        location runs a density check: if there are not enough nearby posts to
        fill a feed, the shipped path — the highlighted step — widens the radius
        one step and re-queries, looping until the feed clears and renders, so a
        blank screen never ships. The branch that was refused, drawn dashed and
        going nowhere, is a strictly scoped empty feed. On the right, three
        nested-ring steps — home, wider, widest — carry two counter-running
        bars: feed volume rises and climate fit falls with every step out. The
        bars show direction only, not measured values.
      </desc>
      <defs>
        <marker
          id="gi-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="gi-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ PANEL HEADERS ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHEN A LOCAL FEED COMES UP SHORT
      </text>
      <text
        x="500"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT EACH STEP OUT COSTS
      </text>
      <line
        x1="40"
        y1="64"
        x2="860"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="486"
        y1="64"
        x2="486"
        y2="436"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ ARROWS (drawn before boxes) ============ */}
      {/* request enters the density check */}
      <line
        x1="124"
        y1="168"
        x2="124"
        y2="208"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gi-arrow)"
      />
      {/* short: the shipped branch goes to the widen rule */}
      <line
        x1="208"
        y1="248"
        x2="276"
        y2="248"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gi-arrow)"
      />
      {/* short: the branch that was refused, forking off the same condition */}
      <path
        d="M 242,248 V 364 Q 242,372 250,372 H 272"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gi-arrow-quiet)"
      />
      {/* the loop: same request, one step wider */}
      <path
        d="M 364,212 V 140 Q 364,132 356,132 H 216"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gi-arrow)"
      />
      {/* clears: the feed renders */}
      <line
        x1="124"
        y1="284"
        x2="124"
        y2="332"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gi-arrow)"
      />

      {/* Arrow labels — plated, 8–10px clear of their own stroke */}
      <rect
        x="238"
        y="110"
        width="92"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="284"
        y="120"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        RE-QUERY, WIDER
      </text>

      <rect
        x="213"
        y="226"
        width="58"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="242"
        y="236"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        BELOW FILL
      </text>

      <rect
        x="134"
        y="290"
        width="62"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="138"
        y="300"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        CLEARS FILL
      </text>

      {/* ============ LEFT PANEL — THE RULE ============ */}
      <rect
        x="40"
        y="96"
        width="168"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="124"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Feed Request
      </text>
      <text
        x="124"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        scoped to where you are
      </text>

      <rect
        x="40"
        y="212"
        width="168"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="124"
        y="244"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Density Check
      </text>
      <text
        x="124"
        y="262"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        enough nearby to fill?
      </text>

      <rect
        x="40"
        y="336"
        width="168"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="124"
        y="368"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Feed Renders
      </text>
      <text
        x="124"
        y="386"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        never a blank screen
      </text>

      {/* FOCAL: the rule the decision turns on — solid ink, paper text */}
      <rect
        x="280"
        y="212"
        width="168"
        height="72"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="364"
        y="240"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Widen One Step
      </text>
      <text
        x="364"
        y="257"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        automatic · no prompt
      </text>
      <text
        x="364"
        y="272"
        fill="var(--dg-paper)"
        opacity="0.58"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        relevance spent for reach
      </text>

      {/* The branch that was refused */}
      <rect
        x="280"
        y="336"
        width="168"
        height="72"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="364"
        y="368"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Empty Feed
      </text>
      <text
        x="364"
        y="386"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        strict scope · not shipped
      </text>

      {/* ============ RIGHT PANEL — WHAT THE STEP COSTS ============ */}
      <text
        x="554"
        y="96"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        R1 · HOME
      </text>
      <text
        x="680"
        y="96"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        R2 · WIDER
      </text>
      <text
        x="806"
        y="96"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        R3 · WIDEST
      </text>

      {/* R1 — one ring */}
      <circle
        cx="554"
        cy="170"
        r="18"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <circle cx="554" cy="170" r="2.5" fill="var(--dg-ink)" />

      {/* R2 — the first radius is now a passed ring */}
      <circle
        cx="680"
        cy="170"
        r="18"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <circle
        cx="680"
        cy="170"
        r="32"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <circle cx="680" cy="170" r="2.5" fill="var(--dg-ink)" />

      {/* R3 — two passed rings */}
      <circle
        cx="806"
        cy="170"
        r="18"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <circle
        cx="806"
        cy="170"
        r="32"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <circle
        cx="806"
        cy="170"
        r="46"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <circle cx="806" cy="170" r="2.5" fill="var(--dg-ink)" />

      {/* Feed volume — rises with every step out */}
      <text
        x="500"
        y="248"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        FEED VOLUME
      </text>
      <rect
        x="500"
        y="256"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="500"
        y="256"
        width="26"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />
      <rect
        x="626"
        y="256"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="626"
        y="256"
        width="62"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />
      <rect
        x="752"
        y="256"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="752"
        y="256"
        width="100"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />

      {/* Climate fit — falls the same distance */}
      <text
        x="500"
        y="302"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        CLIMATE FIT
      </text>
      <rect
        x="500"
        y="310"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="500"
        y="310"
        width="100"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />
      <rect
        x="626"
        y="310"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="626"
        y="310"
        width="62"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />
      <rect
        x="752"
        y="310"
        width="108"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="752"
        y="310"
        width="26"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />

      <text
        x="500"
        y="346"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        DIRECTION ONLY, NOT MEASURED
      </text>
      <text
        x="500"
        y="372"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Volume rises and fit falls with every step out.
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="40"
        y1="452"
        x2="860"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="482"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="120"
        y="472"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="138"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Step in the shipped path
      </text>

      <rect
        x="290"
        y="472"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="308"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the rule that fires
      </text>

      <rect
        x="470"
        y="472"
        width="12"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="488"
        y="482"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The alternative, not shipped
      </text>

      <line
        x1="120"
        y1="502"
        x2="142"
        y2="502"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gi-arrow)"
      />
      <text
        x="152"
        y="506"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Flow, and the loop back
      </text>

      <line
        x1="290"
        y1="502"
        x2="312"
        y2="502"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gi-arrow-quiet)"
      />
      <text
        x="322"
        y="506"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The branch not taken
      </text>

      <circle
        cx="450"
        cy="502"
        r="5"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <circle
        cx="450"
        cy="502"
        r="10"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="468"
        y="506"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Outer ring is the current radius
      </text>

      <rect
        x="650"
        y="497"
        width="40"
        height="10"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <rect
        x="650"
        y="497"
        width="14"
        height="10"
        rx="2"
        fill="var(--dg-prose)"
      />
      <text
        x="698"
        y="506"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Bar length is directional
      </text>
    </svg>
  );
}
