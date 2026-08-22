"use client";

/**
 * Addvance — the same finding, shown two ways.
 *
 * The decision this illustrates is "consent and transparency over the magic
 * moment". The discovery half of the feature is not the argument, so it gets
 * one lane and two plain boxes; everything the decision turns on happens at
 * the fork, which is why the figure is shaped as one trunk splitting into two
 * presentations of an identical result. The upper branch — an unexplained
 * suggestion — is dashed because it is the version that was cut, drawn rather
 * than described so the tradeoff is visible instead of asserted. The focal
 * branch carries the hop chain itself, because naming each hop IS the
 * mechanism: the thing that turns a surveillance moment into a consented one.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function AddvancedConsentPathDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 592"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="addvanced-consent-title addvanced-consent-desc"
    >
      <title id="addvanced-consent-title">
        One finding, two ways to show it
      </title>
      <desc id="addvanced-consent-desc">
        A decision fork. The user&apos;s imported first-degree network feeds a
        path search that looks across second- and third-degree connections for
        someone who could refer them. The single result it finds then branches
        two ways. The upper branch, drawn dashed because it was cut, is the
        unexplained version: a suggestion reading &ldquo;You have a way into
        this role&rdquo; with no source, no path and no control, which reads as
        surveillance. The lower branch is what shipped: the same result with the
        route drawn out as a chain of named hops from you, to a first-degree
        connection, to a second, to a third, with every hop named and mutable.
        Nobody in testing called that version invasive.
      </desc>
      <defs>
        <marker
          id="av-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="av-arrow-cut"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="av-arrow-focal"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-ink)" />
        </marker>
        <marker
          id="av-arrow-hop"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-paper)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ ARROWS (drawn before boxes so boxes occlude ends) ============ */}

      {/* Import feeds the search */}
      <line
        x1="216"
        y1="240"
        x2="264"
        y2="240"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#av-arrow)"
      />

      {/* The fork — one finding, two presentations. Upper: the version cut. */}
      <path
        d="M 448,240 H 496 Q 504,240 504,232 V 120 Q 504,112 512,112 H 552"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#av-arrow-cut)"
      />
      {/* Lower: FOCAL — the branch that shipped */}
      <path
        d="M 448,240 H 496 Q 504,240 504,248 V 384 Q 504,392 512,392 H 552"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#av-arrow-focal)"
      />

      {/* Branch labels — plates first, both sit on the fork stem */}
      <rect
        x="468"
        y="166"
        width="72"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="504"
        y="176"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        UNEXPLAINED
      </text>
      <rect
        x="470"
        y="306"
        width="68"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="504"
        y="316"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        PATH SHOWN
      </text>

      {/* ============ STAGE 01 — IMPORT ============ */}
      <text
        x="120"
        y="178"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        01 · IMPORT
      </text>
      <rect
        x="32"
        y="192"
        width="176"
        height="96"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="120"
        y="224"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Your network
      </text>
      <text
        x="120"
        y="246"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        1st degree, imported
      </text>
      <text
        x="120"
        y="262"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        linkedin · google
      </text>

      {/* ============ STAGE 02 — SEARCH ============ */}
      <text
        x="360"
        y="178"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        02 · SEARCH
      </text>
      <rect
        x="272"
        y="192"
        width="176"
        height="96"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="360"
        y="224"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Path search
      </text>
      <text
        x="360"
        y="246"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        2nd + 3rd degree
      </text>
      <text
        x="360"
        y="262"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        who can refer you
      </text>

      {/* ============ BRANCH A — the version cut ============ */}
      <text
        x="560"
        y="54"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE VERSION CUT
      </text>
      <rect
        x="560"
        y="64"
        width="368"
        height="96"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="744"
        y="92"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        The magic moment
      </text>
      <text
        x="744"
        y="112"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        &ldquo;You have a way into this role.&rdquo;
      </text>
      <text
        x="744"
        y="128"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no source · no path · no control
      </text>
      <text
        x="744"
        y="144"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        cut — it reads as surveillance
      </text>

      {/* ============ BRANCH B — FOCAL: solid ink fill, paper text ============ */}
      <text
        x="560"
        y="302"
        fill="var(--dg-ink)"
        fontSize="8"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED
      </text>
      <rect
        x="560"
        y="312"
        width="368"
        height="160"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="744"
        y="342"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        The path, shown
      </text>

      {/* Hop chain — connectors first, chips occlude their ends */}
      <line
        x1="636"
        y1="370"
        x2="668"
        y2="370"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.78"
        markerEnd="url(#av-arrow-hop)"
      />
      <line
        x1="728"
        y1="370"
        x2="760"
        y2="370"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.78"
        markerEnd="url(#av-arrow-hop)"
      />
      <line
        x1="820"
        y1="370"
        x2="852"
        y2="370"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.78"
        markerEnd="url(#av-arrow-hop)"
      />

      <rect
        x="580"
        y="358"
        width="52"
        height="24"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="606"
        y="373"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        YOU
      </text>
      <rect
        x="672"
        y="358"
        width="52"
        height="24"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="698"
        y="373"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        1ST
      </text>
      <rect
        x="764"
        y="358"
        width="52"
        height="24"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="790"
        y="373"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        2ND
      </text>
      <rect
        x="856"
        y="358"
        width="52"
        height="24"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="882"
        y="373"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        3RD
      </text>

      <text
        x="744"
        y="406"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        every hop named — who, and how you know them
      </text>
      <text
        x="744"
        y="424"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        mute any of them · nothing surfaced silently
      </text>
      <text
        x="744"
        y="446"
        fill="var(--dg-paper)"
        opacity="0.58"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        in testing, nobody called it invasive
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="32"
        y1="508"
        x2="928"
        y2="508"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="540"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="104"
        y="530"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="122"
        y="540"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Step in the flow
      </text>

      <rect
        x="231"
        y="530"
        width="12"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="249"
        y="540"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Dashed — the version cut
      </text>

      <rect
        x="396"
        y="530"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="414"
        y="540"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — what shipped
      </text>

      <rect
        x="542"
        y="530"
        width="26"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <rect
        x="546"
        y="533"
        width="18"
        height="6"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.24"
      />
      <text
        x="576"
        y="540"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        One named hop
      </text>

      <line
        x1="104"
        y1="562"
        x2="126"
        y2="562"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#av-arrow)"
      />
      <text
        x="136"
        y="565"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Flow
      </text>

      <line
        x1="187"
        y1="562"
        x2="209"
        y2="562"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#av-arrow-focal)"
      />
      <text
        x="219"
        y="565"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The branch taken
      </text>
    </svg>
  );
}
