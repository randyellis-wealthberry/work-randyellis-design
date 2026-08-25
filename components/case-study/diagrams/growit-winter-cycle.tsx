"use client";

/**
 * GrowIt! — the year, drawn as a cycle that either closes or leaks.
 *
 * The decision this illustrates is "treating winter as planning season, not
 * dead season". A seasonal argument invites a twelve-month engagement curve,
 * and that is the wrong figure twice over: the case study reports no monthly
 * numbers, and a curve would make the claim about a metric when the claim is
 * about product state. So the year is drawn as a state machine instead. Four
 * states, one return edge, and the whole difference between the two readings
 * is what that edge costs.
 *
 * The refused reading has no winter state at all — it has a gap, and its return
 * edge runs through re-acquisition, which is why it is dashed: users leave and
 * have to be bought back. The shipped reading gives winter a state to be in,
 * so the same edge closes inside the product.
 *
 * The trough is not drawn as solved. The case study says plainly that the drop
 * got shallower and did not disappear, so the figure says the same in words
 * rather than quietly implying a flat line it cannot support.
 *
 * Inversion is spent once, on the winter state that shipped, because inventing
 * that state IS the decision.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function GrowItWinterCycleDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 520"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="growit-winter-title growit-winter-desc"
    >
      <title id="growit-winter-title">
        The gardening year as a cycle that closes, or one that leaks
      </title>
      <desc id="growit-winter-desc">
        The gardening year drawn twice as a four-state cycle, with the seasons
        labelled across the top: spring, summer, autumn, winter. The upper
        reading is the one that was refused. It runs sow, tend, harvest, and
        then has no winter state at all — only a dashed, empty box reading
        &ldquo;nothing to open the app for&rdquo;. Its return edge back to sow
        is dashed and labelled: users leave, and are re-acquired every spring.
        The lower reading is what shipped. The same three states run, and winter
        is a state rather than a gap: a box drawn inverted in solid ink reading
        &ldquo;Plan&rdquo;, holding planning and indoor plants. Its return edge
        is solid and labelled — the same users, still in the product when spring
        arrives. A note beneath states what the figure does not claim: the
        winter drop-off got shallower than pure seasonality would predict, but
        it did not go flat, and no monthly engagement numbers are shown because
        none were recorded.
      </desc>
      <defs>
        <marker
          id="gw-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="gw-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="gw-arrow-focal"
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

      {/* ============ SEASON HEADER ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE SAME YEAR, READ TWO WAYS
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="265"
        y="88"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        SPRING
      </text>
      <text
        x="435"
        y="88"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        SUMMER
      </text>
      <text
        x="605"
        y="88"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        AUTUMN
      </text>
      <text
        x="785"
        y="88"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
        textAnchor="middle"
      >
        WINTER
      </text>

      {/* ============ THE READING THAT WAS REFUSED ============ */}
      <text
        x="40"
        y="128"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE EASY READ
      </text>
      <text x="40" y="146" fill="var(--dg-quiet)" fontSize="11">
        a seasonal app
      </text>

      <rect
        x="190"
        y="104"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="265"
        y="140"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        Sow
      </text>
      <rect
        x="360"
        y="104"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="435"
        y="140"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        Tend
      </text>
      <rect
        x="530"
        y="104"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="605"
        y="140"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        Harvest
      </text>
      <rect
        x="700"
        y="104"
        width="170"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="785"
        y="130"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        NO STATE AT ALL
      </text>
      <text
        x="785"
        y="150"
        fill="var(--dg-quiet)"
        fontSize="11"
        textAnchor="middle"
      >
        nothing to open
      </text>

      <line
        x1="340"
        y1="134"
        x2="352"
        y2="134"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        markerEnd="url(#gw-arrow-quiet)"
      />
      <line
        x1="510"
        y1="134"
        x2="522"
        y2="134"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        markerEnd="url(#gw-arrow-quiet)"
      />
      <line
        x1="680"
        y1="134"
        x2="692"
        y2="134"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        markerEnd="url(#gw-arrow-quiet)"
      />

      <path
        d="M 785,164 V 200 Q 785,212 773,212 H 277 Q 265,212 265,200 V 172"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gw-arrow-quiet)"
      />
      <rect x="404" y="204" width="252" height="16" fill="var(--dg-paper)" />
      <text
        x="530"
        y="216"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        THEY LEAVE · RE-ACQUIRE EVERY SPRING
      </text>

      {/* ============ WHAT SHIPPED ============ */}
      <text
        x="40"
        y="334"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT SHIPPED
      </text>
      <text x="40" y="352" fill="var(--dg-prose)" fontSize="11">
        a year-round app
      </text>

      <rect
        x="190"
        y="310"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
      />
      <text
        x="265"
        y="346"
        fill="var(--dg-ink)"
        fontSize="13"
        textAnchor="middle"
      >
        Sow
      </text>
      <rect
        x="360"
        y="310"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
      />
      <text
        x="435"
        y="346"
        fill="var(--dg-ink)"
        fontSize="13"
        textAnchor="middle"
      >
        Tend
      </text>
      <rect
        x="530"
        y="310"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
      />
      <text
        x="605"
        y="346"
        fill="var(--dg-ink)"
        fontSize="13"
        textAnchor="middle"
      >
        Harvest
      </text>
      <rect
        x="700"
        y="310"
        width="170"
        height="60"
        rx="4"
        fill="var(--dg-ink)"
      />
      <text
        x="785"
        y="338"
        fill="var(--dg-paper)"
        fontSize="13"
        textAnchor="middle"
      >
        Plan
      </text>
      <text
        x="785"
        y="357"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        opacity="0.85"
      >
        PLANNING · INDOOR PLANTS
      </text>

      <line
        x1="340"
        y1="340"
        x2="352"
        y2="340"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gw-arrow)"
      />
      <line
        x1="510"
        y1="340"
        x2="522"
        y2="340"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#gw-arrow)"
      />
      <line
        x1="680"
        y1="340"
        x2="692"
        y2="340"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#gw-arrow-focal)"
      />

      <path
        d="M 785,370 V 406 Q 785,418 773,418 H 277 Q 265,418 265,406 V 378"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#gw-arrow-focal)"
      />
      <rect x="410" y="410" width="240" height="16" fill="var(--dg-paper)" />
      <text
        x="530"
        y="422"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        THE SAME USERS · STILL HERE IN SPRING
      </text>

      {/* ============ WHAT THIS FIGURE DOES NOT CLAIM ============ */}
      <line
        x1="40"
        y1="446"
        x2="920"
        y2="446"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="472"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        NOT CLAIMED
      </text>
      <text x="150" y="472" fill="var(--dg-prose)" fontSize="11">
        That the trough went away. It got shallower than pure seasonality
        predicts, and no monthly figures are drawn
      </text>
      <text x="150" y="490" fill="var(--dg-prose)" fontSize="11">
        because none were recorded. What changed is that winter became a state
        the product has, not a gap it waits out.
      </text>
    </svg>
  );
}
