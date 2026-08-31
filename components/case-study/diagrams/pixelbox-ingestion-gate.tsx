"use client";

/**
 * Pixelbox — where the gate sits.
 *
 * The decision this draws is "consent enforced by architecture, not by policy".
 * Every platform in this space writes the same sentence on its policy page, so
 * a diagram of the promise would draw nothing: the claim only becomes checkable
 * when you ask *where* the control sits relative to the platform's own disks.
 * That is a question about position, which is why this is one boundary with two
 * routes crossing it rather than two flowcharts side by side.
 *
 * The boundary is the only vertical line in the figure and everything is
 * arranged around it. Lane A takes the ordinary route — sweep whatever is
 * reachable, put it in the corpus, filter afterwards — and its filter is drawn
 * on the far side of the line on purpose. That is the whole argument: by the
 * time the control runs, the thing it is meant to exclude is already inside.
 * The corpus carries the flagged asset as a chip so the reader can see it
 * sitting there rather than infer it.
 *
 * Lane B moves the same control onto the line. The gate is the one focal
 * element and signals it by inversion — ink fill, paper text — which in an
 * achromatic system is the loudest available move and therefore spent once.
 * The flagged work gets a real path that climbs toward the boundary and stops
 * at a bar before reaching it, with no arrowhead, because an arrowhead would
 * say it arrived somewhere.
 *
 * Two things are deliberately absent. There is no payout, buyer, or Index here
 * — they belong to the product's other claims and would turn a figure about one
 * boundary into a system chart. And lane A is not labelled with a competitor;
 * it is the shape of the category, and naming a company would make a legal
 * assertion the case study has no evidence for.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark. The two
 * routes separate by stroke weight and dash rather than hue, because this skin
 * has no accent hue to reach for.
 */
export function PixelboxIngestionGateDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 40 960 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="pixelbox-gate-title pixelbox-gate-desc"
    >
      <title id="pixelbox-gate-title">
        Where the rights gate sits relative to the platform boundary
      </title>
      <desc id="pixelbox-gate-desc">
        A single dashed vertical line divides the figure into the creator&apos;s
        own site on the left and the platform&apos;s disks on the right. Two
        routes cross it. The upper route, drawn in dashed hairlines as the
        version not taken, runs from a public portfolio into a scraper that asks
        no consent, then carries everything it can reach across the line into a
        corpus — which is shown holding a chip marked NDA work — before reaching
        a filter that sits on the far side of the boundary, after the fact. The
        lower route, what Pixelbox does, runs from the creator&apos;s own site,
        where a script they installed and can remove is the only thing that
        sends anything, into a per-asset rights gate drawn straddling the
        boundary itself and inverted in solid ink to mark it as the focal
        element, and only then into a corpus holding cleared work only. Beneath
        it, the creator&apos;s flagged NDA and client-owned work follows its own
        path toward the boundary and terminates at a stop bar short of the line,
        with no arrowhead, labelled never arrives. The difference between the
        two routes is not whether a control exists but whether it runs before or
        after the material is already on the platform&apos;s disks.
      </desc>

      <defs>
        <marker
          id="pxb-gate-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="pxb-gate-arrow-focal"
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

      {/* ============ THE BOUNDARY — the only vertical line in the figure ============ */}
      <text
        x="32"
        y="80"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        OUTSIDE · THE CREATOR&apos;S OWN SITE
      </text>
      <text
        x="576"
        y="80"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        INSIDE · THE PLATFORM&apos;S DISKS
      </text>
      <line
        x1="560"
        y1="88"
        x2="560"
        y2="520"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />

      {/* ============ LANE A — the usual shape, filtered after the fact ============ */}
      <text
        x="32"
        y="112"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        A · THE USUAL SHAPE — INGEST BROADLY, FILTER DOWNSTREAM
      </text>

      {/* A — connectors, drawn before the boxes */}
      <line
        x1="168"
        y1="164"
        x2="216"
        y2="164"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,3"
        markerEnd="url(#pxb-gate-arrow)"
      />
      <line
        x1="336"
        y1="164"
        x2="600"
        y2="164"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,3"
        markerEnd="url(#pxb-gate-arrow)"
      />
      <rect
        x="400"
        y="142"
        width="144"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="472"
        y="151"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        EVERYTHING IT CAN REACH
      </text>
      <line
        x1="744"
        y1="164"
        x2="784"
        y2="164"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,3"
        markerEnd="url(#pxb-gate-arrow)"
      />

      {/* A1 — the public portfolio */}
      <rect
        x="32"
        y="128"
        width="136"
        height="76"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="100"
        y="162"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Public portfolio
      </text>
      <text
        x="100"
        y="180"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        what a crawler reaches
      </text>

      {/* A2 — the scraper */}
      <rect
        x="216"
        y="128"
        width="120"
        height="76"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="276"
        y="162"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Scraper
      </text>
      <text
        x="276"
        y="180"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        no consent asked
      </text>

      {/* A3 — the corpus, already holding the thing that should not be here */}
      <rect
        x="600"
        y="128"
        width="144"
        height="76"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="672"
        y="156"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Corpus
      </text>
      <rect
        x="616"
        y="168"
        width="112"
        height="20"
        rx="3"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="672"
        y="182"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        NDA WORK · IN HERE
      </text>

      {/* A4 — the control, on the wrong side of the line */}
      <rect
        x="784"
        y="128"
        width="128"
        height="76"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="848"
        y="162"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Filter
      </text>
      <text
        x="848"
        y="180"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        runs after the fact
      </text>

      <text
        x="600"
        y="232"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        the asset was on the disks before the control ever ran
      </text>

      {/* ============ LANE B — FOCAL: the same control, moved onto the line ============ */}
      <text
        x="32"
        y="300"
        fill="var(--dg-ink)"
        fontSize="8"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        B · WHAT PIXELBOX DOES — GATE AT INGESTION
      </text>

      {/* B — connectors, drawn before the boxes */}
      <line
        x1="208"
        y1="352"
        x2="488"
        y2="352"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#pxb-gate-arrow-focal)"
      />
      <rect
        x="288"
        y="330"
        width="160"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="368"
        y="339"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        ONLY WHAT THE SCRIPT SENDS
      </text>
      <line
        x1="624"
        y1="352"
        x2="672"
        y2="352"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#pxb-gate-arrow-focal)"
      />

      {/* B1 — the creator's own site, and the instrument they control */}
      <rect
        x="32"
        y="316"
        width="176"
        height="72"
        rx="6"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
      />
      <text
        x="120"
        y="348"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Creator&apos;s own site
      </text>
      <text
        x="120"
        y="366"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        script they installed
      </text>

      {/* B2 — FOCAL: the gate, straddling the boundary, inverted */}
      <rect
        x="488"
        y="308"
        width="136"
        height="88"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="556"
        y="342"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Per-asset
      </text>
      <text
        x="556"
        y="358"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        rights gate
      </text>
      <text
        x="556"
        y="378"
        fill="var(--dg-paper)"
        opacity="0.62"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        ON THE LINE
      </text>

      {/* B3 — the corpus, holding only what cleared */}
      <rect
        x="672"
        y="316"
        width="144"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-prose)"
        strokeWidth="1"
      />
      <text
        x="744"
        y="348"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Corpus
      </text>
      <text
        x="744"
        y="366"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        cleared work only
      </text>

      <text
        x="672"
        y="420"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        nothing here was taken without being sent
      </text>

      {/* ============ THE BLOCKED ROUTE — flagged work, stopped short ============ */}
      <path
        d="M 432,474 H 512 Q 520,474 520,466 V 424"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1.2"
        strokeDasharray="2,4"
      />
      <line
        x1="504"
        y1="420"
        x2="536"
        y2="420"
        stroke="var(--dg-ink)"
        strokeWidth="2"
      />
      <rect
        x="436"
        y="452"
        width="76"
        height="12"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="474"
        y="461"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        NEVER ARRIVES
      </text>

      <rect
        x="232"
        y="452"
        width="200"
        height="44"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="332"
        y="472"
        fill="var(--dg-prose)"
        fontSize="11"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        NDA + client-owned work
      </text>
      <text
        x="332"
        y="487"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        FLAGGED BY THE CREATOR
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="32"
        y1="548"
        x2="928"
        y2="548"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="578"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <line
        x1="104"
        y1="574"
        x2="128"
        y2="574"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <text
        x="136"
        y="578"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Dashed — the route not taken
      </text>

      <rect
        x="320"
        y="568"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="340"
        y="578"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the gate, on the boundary
      </text>

      <line
        x1="576"
        y1="574"
        x2="596"
        y2="574"
        stroke="var(--dg-prose)"
        strokeWidth="1.2"
        strokeDasharray="2,4"
      />
      <line
        x1="600"
        y1="568"
        x2="600"
        y2="580"
        stroke="var(--dg-ink)"
        strokeWidth="2"
      />
      <text
        x="612"
        y="578"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Stop — terminates before entry
      </text>

      <line
        x1="828"
        y1="564"
        x2="828"
        y2="584"
        stroke="var(--dg-edge)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="840"
        y="578"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        The boundary
      </text>
    </svg>
  );
}
