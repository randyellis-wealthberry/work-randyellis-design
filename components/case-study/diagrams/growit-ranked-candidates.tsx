"use client";

/**
 * GrowIt! — the set the model always had.
 *
 * The decision this illustrates is "ranked candidates over a single confident
 * answer". The mechanism worth drawing is not the picker: it is that the model
 * produces a ranked set either way, and the only question is whether the
 * product throws the rest of it away before the user sees it. So the figure is
 * built as one source feeding two consumers — the distribution on the left,
 * drawn once, and the two things a product can do with it on the right.
 *
 * The bars carry no numbers. Per-candidate confidence is not something the case
 * study records; what it records is aggregate identification accuracy, and
 * putting invented percentages on four bars would be the exact failure the
 * decision is about. The bars show rank order and nothing more, and the figure
 * says so in its own type.
 *
 * The 94% belongs on the refused branch rather than the shipped one, because
 * the argument turns on the remainder: an assertion is only as safe as the
 * fraction of the time it is wrong, and here that fraction is somebody's
 * plant.
 *
 * Inversion is spent once, on the row the user confirms, because the act of
 * confirming is what the whole decision buys.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function GrowItRankedCandidatesDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="growit-ranked-title growit-ranked-desc"
    >
      <title id="growit-ranked-title">
        One ranked set, and the two things a product can do with it
      </title>
      <desc id="growit-ranked-desc">
        On the left, drawn once, is what the recognition model returns for every
        photo: a ranked set of four candidates as bars of decreasing length,
        showing order only — the figure notes that these are not measured
        confidence values, because the case study records aggregate accuracy
        rather than per-candidate scores. Two branches lead right from that same
        set. The upper branch, dashed because it was refused, keeps only the
        top-ranked candidate and asserts it as fact, with no alternatives and no
        uncertainty shown; it flows into a watering and light schedule built on
        that assertion, annotated with the point that identification ran at 94%
        accuracy across 15,000-plus varieties, so the remaining six per cent
        arrives here, attached to a living plant. The lower branch is what
        shipped: the same set rendered as four selectable rows, with the row the
        user confirms drawn inverted, flowing into a confirmation that has an
        act behind it and can therefore mean something to community verification
        downstream. The stated price sits at the bottom — one extra tap on every
        identification, paid every time.
      </desc>
      <defs>
        <marker
          id="gr-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="gr-arrow-focal"
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

      {/* ============ PANEL HEADERS ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT THE MODEL RETURNS, EVERY TIME
      </text>
      <text
        x="392"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        AND THE TWO THINGS A PRODUCT CAN DO WITH IT
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
        x1="354"
        y1="64"
        x2="354"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ LEFT — THE RANKED SET, DRAWN ONCE ============ */}
      <text
        x="40"
        y="108"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        RANK
      </text>

      <text
        x="40"
        y="146"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        01
      </text>
      <rect
        x="76"
        y="136"
        width="228"
        height="14"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="40"
        y="184"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        02
      </text>
      <rect
        x="76"
        y="174"
        width="164"
        height="14"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <text
        x="40"
        y="222"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        03
      </text>
      <rect
        x="76"
        y="212"
        width="104"
        height="14"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <text
        x="40"
        y="260"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        04
      </text>
      <rect
        x="76"
        y="250"
        width="62"
        height="14"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />

      <line
        x1="40"
        y1="294"
        x2="304"
        y2="294"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="316"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        rank order only
      </text>
      <text
        x="40"
        y="332"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        not measured confidence values
      </text>
      <text x="40" y="366" fill="var(--dg-prose)" fontSize="11">
        The set exists either way. The only
      </text>
      <text x="40" y="384" fill="var(--dg-prose)" fontSize="11">
        question is who gets to see it.
      </text>

      {/* ============ BRANCHES ============ */}
      <path
        d="M 312,143 H 340 Q 348,143 348,135 V 126 Q 348,118 356,118 H 384"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gr-arrow-quiet)"
      />
      {/* A bracket across the whole set: the shipped branch takes all of it,
          not the second row it happens to leave beside. */}
      <path
        d="M 312,136 H 320 V 264 H 312"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <path
        d="M 320,200 H 340 Q 348,200 348,208 V 288 Q 348,296 356,296 H 384"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#gr-arrow-focal)"
      />

      {/* ============ UPPER RIGHT — THE BETTER DEMO, REFUSED ============ */}
      <text
        x="392"
        y="102"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        KEEP THE TOP ONE
      </text>
      <rect
        x="392"
        y="112"
        width="196"
        height="76"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="490"
        y="142"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        Asserted as fact
      </text>
      <text
        x="490"
        y="164"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no set · no uncertainty · no tap
      </text>

      <line
        x1="596"
        y1="150"
        x2="656"
        y2="150"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#gr-arrow-quiet)"
      />

      <rect
        x="664"
        y="112"
        width="216"
        height="76"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="772"
        y="142"
        fill="var(--dg-quiet)"
        fontSize="13"
        textAnchor="middle"
      >
        A care schedule
      </text>
      <text
        x="772"
        y="164"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        watering and light, built on the guess
      </text>

      <text
        x="664"
        y="216"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        94% ACCURATE ACROSS 15,000+ VARIETIES
      </text>
      <text x="664" y="238" fill="var(--dg-prose)" fontSize="11">
        The other six per cent arrives
      </text>
      <text x="664" y="256" fill="var(--dg-prose)" fontSize="11">
        here, attached to a living thing.
      </text>

      {/* ============ LOWER RIGHT — WHAT SHIPPED (FOCAL) ============ */}
      <text
        x="392"
        y="280"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        SHOW THE SET, MAKE THEM CHOOSE
      </text>
      <rect
        x="392"
        y="290"
        width="196"
        height="126"
        rx="4"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <rect
        x="404"
        y="302"
        width="172"
        height="24"
        rx="3"
        fill="var(--dg-ink)"
      />
      <text
        x="416"
        y="318"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        01 · CONFIRMED BY THE USER
      </text>
      <rect
        x="404"
        y="332"
        width="172"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <rect
        x="416"
        y="341"
        width="88"
        height="5"
        rx="2"
        fill="var(--dg-edge)"
      />
      <rect
        x="404"
        y="358"
        width="172"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <rect
        x="416"
        y="367"
        width="64"
        height="5"
        rx="2"
        fill="var(--dg-edge)"
      />
      <rect
        x="404"
        y="384"
        width="172"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <rect
        x="416"
        y="393"
        width="40"
        height="5"
        rx="2"
        fill="var(--dg-edge)"
      />

      <line
        x1="596"
        y1="352"
        x2="656"
        y2="352"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#gr-arrow-focal)"
      />

      <rect
        x="664"
        y="314"
        width="216"
        height="76"
        rx="4"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="772"
        y="344"
        fill="var(--dg-ink)"
        fontSize="13"
        textAnchor="middle"
      >
        A confirmation
      </text>
      <text
        x="772"
        y="366"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        an act, so verification can rest on it
      </text>

      {/* ============ THE PRICE ============ */}
      <line
        x1="40"
        y1="452"
        x2="920"
        y2="452"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="478"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE PRICE
      </text>
      <text x="140" y="478" fill="var(--dg-prose)" fontSize="11">
        One extra tap on every identification, paid by everyone, forever.
      </text>

      <text
        x="40"
        y="514"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        LEGEND
      </text>
      <rect
        x="140"
        y="504"
        width="24"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="174"
        y="514"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the confirmed row
      </text>
      <rect
        x="392"
        y="504"
        width="24"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="426"
        y="514"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The branch refused
      </text>
      <rect
        x="640"
        y="504"
        width="24"
        height="12"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <text
        x="674"
        y="514"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        A candidate the top answer discards
      </text>
    </svg>
  );
}
