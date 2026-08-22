"use client";

/**
 * LedgerIQ — where the machine stops.
 *
 * Two decisions in one figure. The focal hand-off (ink, 1.2px, the only
 * labelled arrow) is the claim that the system ranks and a person decides.
 * The dashed, unconnected "Behavior Data" cell is the other one: employee
 * behaviour signals were reachable at ingest and deliberately not built, so
 * the scope limit is drawn as a first-class part of the system rather than
 * left to prose.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function LedgerIqScopeDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 728 376"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="ledgeriq-scope-title ledgeriq-scope-desc"
    >
      <title id="ledgeriq-scope-title">
        Where the machine stops and the auditor starts
      </title>
      <desc id="ledgeriq-scope-desc">
        Role-scoped data flow for a payroll anomaly detection system: payroll
        feeds enter a context baseline and hybrid scoring stage, ranked cases
        hand off to a human auditor who decides, and the auditor&apos;s
        false-positive marks return as training labels. Employee behavior data
        sits alongside the pipeline in a dashed outline, marked reachable but
        deliberately not built.
      </desc>
      <defs>
        <marker
          id="lq-arr-muted"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="lq-arr-accent"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--dg-ink)" />
        </marker>
      </defs>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />
      {/* Engine lane tint — the machine's territory */}
      <rect
        x="0"
        y="116"
        width="728"
        height="80"
        fill="var(--dg-ink)"
        opacity="0.018"
      />

      {/* ============ STEP HEADER ============ */}
      <rect
        x="180"
        y="6"
        width="32"
        height="16"
        rx="8"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="196"
        y="14"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        01
      </text>
      <text
        x="196"
        y="29"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        INGEST
      </text>

      <rect
        x="292"
        y="6"
        width="32"
        height="16"
        rx="8"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="308"
        y="14"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        02
      </text>
      <text
        x="308"
        y="29"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        BASELINE
      </text>

      <rect
        x="404"
        y="6"
        width="32"
        height="16"
        rx="8"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="420"
        y="14"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        03
      </text>
      <text
        x="420"
        y="29"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        SCORE
      </text>

      {/* FOCAL step */}
      <rect x="516" y="6" width="32" height="16" rx="8" fill="var(--dg-ink)" />
      <text
        x="532"
        y="14"
        fill="var(--dg-paper)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        04
      </text>
      <text
        x="532"
        y="29"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        TRIAGE
      </text>

      <rect
        x="628"
        y="6"
        width="32"
        height="16"
        rx="8"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="644"
        y="14"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        05
      </text>
      <text
        x="644"
        y="29"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        RETRAIN
      </text>

      {/* ============ LANE STRUCTURE ============ */}
      <line
        x1="0"
        y1="36"
        x2="728"
        y2="36"
        stroke="var(--dg-ink)"
        strokeWidth="0.8"
        opacity="0.12"
      />
      <line
        x1="0"
        y1="116"
        x2="728"
        y2="116"
        stroke="var(--dg-ink)"
        strokeWidth="0.8"
        opacity="0.12"
      />
      <line
        x1="0"
        y1="196"
        x2="728"
        y2="196"
        stroke="var(--dg-ink)"
        strokeWidth="0.8"
        opacity="0.12"
      />
      <line
        x1="0"
        y1="276"
        x2="728"
        y2="276"
        stroke="var(--dg-ink)"
        strokeWidth="0.8"
        opacity="0.12"
      />
      <line
        x1="140"
        y1="36"
        x2="140"
        y2="276"
        stroke="var(--dg-ink)"
        strokeWidth="0.8"
        opacity="0.12"
      />

      {/* Lane labels */}
      <text
        x="70"
        y="72"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PAYROLL
      </text>
      <text
        x="70"
        y="84"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        SOURCES
      </text>
      <text
        x="70"
        y="152"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        DETECTION
      </text>
      <text
        x="70"
        y="164"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        ENGINE
      </text>
      <text
        x="70"
        y="232"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        PAYROLL
      </text>
      <text
        x="70"
        y="244"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        AUDITOR
      </text>

      {/* ============ ARROWS (before all node rects) ============ */}
      <path
        d="M 246,76 H 300 Q 308,76 308,84 V 124"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#lq-arr-muted)"
      />
      <line
        x1="358"
        y1="156"
        x2="370"
        y2="156"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#lq-arr-muted)"
      />
      {/* FOCAL cross-role hand-off: the machine ranks, the human decides */}
      <path
        d="M 470,156 H 524 Q 532,156 532,164 V 204"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#lq-arr-accent)"
      />
      <path
        d="M 582,236 H 636 Q 644,236 644,228 V 188"
        fill="none"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#lq-arr-muted)"
      />

      {/* Focal arrow label — 6px clear of the stroke, in the empty step-04 engine cell */}
      <rect
        x="478"
        y="136"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <rect
        x="478"
        y="136"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-ink)"
        opacity="0.018"
      />
      <text
        x="516"
        y="146"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        RANKED CASES
      </text>

      {/* ============ NODES ============ */}

      {/* SRC / 01 INGEST */}
      <rect
        x="146"
        y="44"
        width="100"
        height="64"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
        opacity="1"
      />
      <rect
        x="150"
        y="48"
        width="18"
        height="10"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="159"
        y="55"
        fill="var(--dg-prose)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        SRC
      </text>
      <text
        x="196"
        y="67"
        fill="var(--dg-ink)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Payroll Feed
      </text>
      <text
        x="196"
        y="79"
        fill="var(--dg-prose)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        punches · pay runs
      </text>
      <text
        x="196"
        y="91"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        stream + batch
      </text>
      <rect
        x="226"
        y="98"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="234"
        y="104"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        LS
      </text>

      {/* ENG / 01 INGEST — the scope limit, drawn as the thing it is */}
      <rect
        x="146"
        y="124"
        width="100"
        height="64"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="196"
        y="147"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Behavior Data
      </text>
      <text
        x="196"
        y="159"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        messages · location
      </text>
      <text
        x="196"
        y="171"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        reachable · not built
      </text>

      {/* ENG / 02 BASELINE */}
      <rect
        x="258"
        y="124"
        width="100"
        height="64"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <rect
        x="262"
        y="128"
        width="18"
        height="10"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="271"
        y="135"
        fill="var(--dg-prose)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        ENG
      </text>
      <text
        x="308"
        y="147"
        fill="var(--dg-ink)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Context Baseline
      </text>
      <text
        x="308"
        y="159"
        fill="var(--dg-prose)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        OT · bonus · season
      </text>
      <text
        x="308"
        y="171"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        per-employee normal
      </text>
      <rect
        x="262"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="270"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        LS
      </text>
      <rect
        x="338"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="346"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>

      {/* ENG / 03 SCORE */}
      <rect
        x="370"
        y="124"
        width="100"
        height="64"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <rect
        x="374"
        y="128"
        width="18"
        height="10"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="383"
        y="135"
        fill="var(--dg-prose)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        ENG
      </text>
      <text
        x="420"
        y="147"
        fill="var(--dg-ink)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Hybrid Scoring
      </text>
      <text
        x="420"
        y="159"
        fill="var(--dg-prose)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        iso-forest + autoenc
      </text>
      <text
        x="420"
        y="171"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        + supervised class.
      </text>
      <rect
        x="374"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="382"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>
      <rect
        x="450"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="458"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>

      {/* AUD / 04 TRIAGE — FOCAL: solid ink, paper text */}
      <rect
        x="482"
        y="204"
        width="100"
        height="64"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <rect
        x="486"
        y="208"
        width="18"
        height="10"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="495"
        y="215"
        fill="var(--dg-paper)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        AUD
      </text>
      <text
        x="532"
        y="227"
        fill="var(--dg-paper)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Triage Queue
      </text>
      <text
        x="532"
        y="239"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        ranked · critical first
      </text>
      <text
        x="532"
        y="251"
        fill="var(--dg-paper)"
        opacity="0.58"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        3–4 hrs, was 10
      </text>
      <rect
        x="486"
        y="258"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="494"
        y="264"
        fill="var(--dg-paper)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>
      <rect
        x="566"
        y="258"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="574"
        y="264"
        fill="var(--dg-paper)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        FL
      </text>

      {/* ENG / 05 RETRAIN */}
      <rect
        x="594"
        y="124"
        width="100"
        height="64"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <rect
        x="598"
        y="128"
        width="18"
        height="10"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="607"
        y="135"
        fill="var(--dg-prose)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        ENG
      </text>
      <text
        x="644"
        y="147"
        fill="var(--dg-ink)"
        fontSize="9"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Retrain
      </text>
      <text
        x="644"
        y="159"
        fill="var(--dg-prose)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        marked false pos.
      </text>
      <text
        x="644"
        y="171"
        fill="var(--dg-quiet)"
        fontSize="6.5"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        become labels
      </text>
      <rect
        x="598"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="606"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        FL
      </text>
      <rect
        x="674"
        y="178"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="682"
        y="184"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>

      {/* ============ LEGEND — 4 rows ============ */}
      <text
        x="144"
        y="292"
        fill="var(--dg-quiet)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        STEPS
      </text>
      <rect
        x="196"
        y="284"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="206"
        y="291"
        fill="var(--dg-ink)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        01
      </text>
      <text
        x="220"
        y="292"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        INGEST
      </text>
      <rect
        x="300"
        y="284"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="310"
        y="291"
        fill="var(--dg-ink)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        02
      </text>
      <text
        x="324"
        y="292"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        BASELINE
      </text>
      <rect
        x="404"
        y="284"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="414"
        y="291"
        fill="var(--dg-ink)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        03
      </text>
      <text
        x="428"
        y="292"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        SCORE
      </text>
      <rect
        x="508"
        y="284"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
      />
      <text
        x="518"
        y="291"
        fill="var(--dg-paper)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        04
      </text>
      <text
        x="532"
        y="292"
        fill="var(--dg-ink)"
        fontSize="7"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        TRIAGE
      </text>
      <rect
        x="612"
        y="284"
        width="20"
        height="10"
        rx="5"
        fill="var(--dg-ink)"
        opacity="0.12"
      />
      <text
        x="622"
        y="291"
        fill="var(--dg-ink)"
        fontSize="6"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        05
      </text>
      <text
        x="636"
        y="292"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        RETRAIN
      </text>

      <text
        x="144"
        y="313"
        fill="var(--dg-quiet)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        DATA TYPE
      </text>
      <rect
        x="212"
        y="306"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="220"
        y="312"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        LS
      </text>
      <text
        x="232"
        y="313"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        stream
      </text>
      <rect
        x="280"
        y="306"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="288"
        y="312"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        TB
      </text>
      <text
        x="300"
        y="313"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        table
      </text>
      <rect
        x="340"
        y="306"
        width="16"
        height="8"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />
      <text
        x="348"
        y="312"
        fill="var(--dg-ink)"
        fontSize="5"
        fontWeight="700"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        FL
      </text>
      <text
        x="360"
        y="313"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        report
      </text>
      <text
        x="408"
        y="313"
        fill="var(--dg-quiet)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        left chip = input · right chip = output
      </text>

      <text
        x="144"
        y="334"
        fill="var(--dg-quiet)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        SCOPE
      </text>
      <rect
        x="196"
        y="326"
        width="20"
        height="10"
        rx="3"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="224"
        y="334"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Reachable, deliberately not built
      </text>

      <text
        x="144"
        y="355"
        fill="var(--dg-quiet)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        FLOW
      </text>
      <line
        x1="196"
        y1="352"
        x2="214"
        y2="352"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#lq-arr-muted)"
      />
      <text
        x="224"
        y="355"
        fill="var(--dg-prose)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        hand-off
      </text>
      <line
        x1="300"
        y1="352"
        x2="318"
        y2="352"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#lq-arr-accent)"
      />
      <text
        x="328"
        y="355"
        fill="var(--dg-ink)"
        fontSize="7"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        machine ranks, human decides
      </text>
    </svg>
  );
}
