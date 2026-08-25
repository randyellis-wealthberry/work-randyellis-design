"use client";

/**
 * Rambis UI — the layer underneath, and who found it.
 *
 * The decision this illustrates is "opinionated defaults with an escape hatch
 * underneath": one obvious call for the common case, composable primitives a
 * layer down for everything else. Drawn as three lanes because the argument is
 * about depth — the developer on top, the defaults they call, and the
 * primitives below those. The mechanism is a fork at the edge case: the
 * architecture provides a descent into layer 02, and what developers actually
 * did was stay in their own lane and ask. That is why the route into the focal
 * box is the dashed one and the route that never leaves the top lane is solid.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark. Nothing
 * here is a fixed hex.
 */
export function RambisTwoLayersDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="rambis-two-layers-title rambis-two-layers-desc"
    >
      <title id="rambis-two-layers-title">
        The layer underneath, and who found it
      </title>
      <desc id="rambis-two-layers-desc">
        Three lanes stacked by depth: the developer on top, the opinionated
        default components below them, and the composable primitives below
        those. In the common case the developer makes one call into the defaults
        and stops. At an edge case the default runs out, and the route the
        architecture provides drops one layer down into the primitives, where
        the case can be composed and shipped. That descent is drawn as a dashed
        line because few developers found it unprompted; the solid route runs
        sideways along the top lane instead, from the edge case straight to
        asking the maintainer, never crossing into the lower layer.
      </desc>
      <defs>
        <marker
          id="rb-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="rb-arrow-quiet"
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

      {/* ============ STAGE HEADERS ============ */}
      <text
        x="278"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        01 · COMMON CASE
      </text>
      <text
        x="550"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        02 · THE EDGE
      </text>
      <text
        x="822"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        03 · WHERE IT LANDS
      </text>

      {/* ============ LANE STRUCTURE ============ */}
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="200"
        x2="920"
        y2="200"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="336"
        x2="920"
        y2="336"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <line
        x1="40"
        y1="472"
        x2="920"
        y2="472"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <line
        x1="168"
        y1="64"
        x2="168"
        y2="472"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* Lane labels */}
      <text
        x="104"
        y="126"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        DEVELOPER
      </text>
      <text
        x="104"
        y="140"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        USING RAMBIS
      </text>
      <text
        x="104"
        y="262"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        LAYER 01
      </text>
      <text
        x="104"
        y="276"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        DEFAULTS
      </text>
      <text
        x="104"
        y="398"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        LAYER 02
      </text>
      <text
        x="104"
        y="412"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PRIMITIVES
      </text>

      {/* ============ ARROWS (drawn before boxes) ============ */}
      {/* 1. common case: one call into the defaults, and it is done */}
      <line
        x1="278"
        y1="168"
        x2="278"
        y2="232"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#rb-arrow)"
      />
      {/* 2. edge case reaches the default and finds its end */}
      <line
        x1="550"
        y1="168"
        x2="550"
        y2="232"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#rb-arrow)"
      />
      {/* 3. the descent the architecture provides — largely not taken */}
      <line
        x1="550"
        y1="304"
        x2="550"
        y2="368"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#rb-arrow-quiet)"
      />
      {/* 4. composed in layer 02, shipped from layer 02 */}
      <line
        x1="648"
        y1="404"
        x2="724"
        y2="404"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#rb-arrow-quiet)"
      />
      {/* 5. the route actually taken: sideways, never down */}
      <line
        x1="648"
        y1="132"
        x2="724"
        y2="132"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#rb-arrow)"
      />

      {/* Arrow labels: 10px clear of their stroke, plated where they cross a rule */}
      <rect
        x="288"
        y="193"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="326"
        y="203"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        ONE CALL
      </text>
      <rect
        x="560"
        y="329"
        width="80"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="600"
        y="339"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        DROP ONE LAYER
      </text>

      {/* ============ LANE 0 — DEVELOPER (actor: paper box, ink border) ============ */}
      <rect
        x="180"
        y="96"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="278"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Standard Control
      </text>
      <text
        x="278"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        80% of props unused
      </text>

      <rect
        x="452"
        y="96"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="550"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Case Not Covered
      </text>
      <text
        x="550"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no prop bends this
      </text>

      <rect
        x="724"
        y="96"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="822"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Asks the Maintainer
      </text>
      <text
        x="822"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        what actually happened
      </text>

      {/* ============ LANE 1 — LAYER 01, DEFAULTS (API surface: wash, soft border) ============ */}
      <rect
        x="180"
        y="232"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="278"
        y="264"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        One Obvious Call
      </text>
      <text
        x="278"
        y="282"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one call · no assembly
      </text>

      <rect
        x="452"
        y="232"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="550"
        y="264"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Default Stops Here
      </text>
      <text
        x="550"
        y="282"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        the anticipated set ends
      </text>

      {/* ============ LANE 2 — LAYER 02, PRIMITIVES ============ */}
      {/* FOCAL: solid ink fill, paper text — the layer the decision turns on */}
      <rect
        x="452"
        y="368"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="550"
        y="400"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Composable Primitives
      </text>
      <text
        x="550"
        y="418"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        assemble any case yourself
      </text>

      <rect
        x="724"
        y="368"
        width="196"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="822"
        y="400"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Case Composed
      </text>
      <text
        x="822"
        y="418"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        the intended landing
      </text>

      {/* The honest note, in the open lane space under the focal box */}
      <text
        x="452"
        y="456"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        few found this layer unprompted
      </text>

      {/* ============ LEGEND (horizontal bottom strip) ============ */}
      <line
        x1="40"
        y1="512"
        x2="920"
        y2="512"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="542"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="140"
        y="532"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="158"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Developer step
      </text>

      <rect
        x="245"
        y="532"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="263"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        API surface
      </text>

      <rect
        x="336"
        y="532"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="354"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the lower layer
      </text>

      <line
        x1="485"
        y1="538"
        x2="507"
        y2="538"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#rb-arrow)"
      />
      <text
        x="517"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Route taken
      </text>

      <line
        x1="590"
        y1="538"
        x2="612"
        y2="538"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#rb-arrow-quiet)"
      />
      <text
        x="622"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Route provided, not found
      </text>
    </svg>
  );
}
