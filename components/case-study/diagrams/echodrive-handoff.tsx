"use client";

/**
 * EchoDrive — the handoff, drawn.
 *
 * The decision this illustrates is "designing the handoff, not two separate
 * apps": the driver app and the dispatch console never address each other.
 * Both write to and read from one shipment record, and the record is the only
 * thing in the middle lane. That is why the middle lane holds state objects
 * while the outer lanes hold actions — two actors, one object.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark. Nothing
 * here is a fixed hex.
 */
export function EchoDriveHandoffDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 600"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="echodrive-handoff-title echodrive-handoff-desc"
    >
      <title id="echodrive-handoff-title">One shipment, two operators</title>
      <desc id="echodrive-handoff-desc">
        Swimlane showing a dispatch web console and a driver mobile app that
        never talk to each other directly: both write to and read from a single
        shared shipment record, across the tender, transit, and exception
        stages.
      </desc>
      <defs>
        <marker
          id="ed-arrow"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-prose)" />
        </marker>
        <marker
          id="ed-arrow-focal"
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

      {/* ============ STAGE HEADER ============ */}
      <text
        x="284"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        01 · TENDER
      </text>
      <text
        x="548"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        02 · TRANSIT
      </text>
      <text
        x="812"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.18em"
      >
        03 · EXCEPTION
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
        DISPATCH
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
        WEB CONSOLE
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
        SHIPMENT
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
        RECORD
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
        DRIVER
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
        MOBILE
      </text>

      {/* ============ ARROWS (drawn before boxes) ============ */}
      {/* 1. dispatch writes the tender */}
      <line
        x1="236"
        y1="168"
        x2="236"
        y2="232"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 2. driver reads the assignment */}
      <line
        x1="236"
        y1="304"
        x2="236"
        y2="368"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 3+6. shipment lifecycle advances along the shared lane */}
      <line
        x1="388"
        y1="268"
        x2="444"
        y2="268"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      <line
        x1="652"
        y1="268"
        x2="708"
        y2="268"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 4. FOCAL: the write that created dispatch visibility */}
      <line
        x1="548"
        y1="368"
        x2="548"
        y2="304"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#ed-arrow-focal)"
      />
      {/* 5. dispatch reads live truth instead of phoning for it */}
      <line
        x1="548"
        y1="232"
        x2="548"
        y2="168"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 7. driver raises an exception */}
      <line
        x1="780"
        y1="368"
        x2="780"
        y2="304"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 8. dispatch reads it */}
      <line
        x1="780"
        y1="232"
        x2="780"
        y2="168"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      {/* 9. dispatch writes the resolution back (offset rail, 64px clear of #8) */}
      <line
        x1="844"
        y1="168"
        x2="844"
        y2="232"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />

      {/* Arrow labels: 10px clear of the stroke, centred in open corridor, clear of every divider */}
      <rect
        x="558"
        y="308"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="596"
        y="318"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        STATUS + HOURS
      </text>
      <rect
        x="558"
        y="172"
        width="76"
        height="14"
        rx="2"
        fill="var(--dg-paper)"
      />
      <text
        x="596"
        y="182"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        LIVE POSITION
      </text>

      {/* ============ LANE 0 — DISPATCH (actor: white box, ink border) ============ */}
      <rect
        x="180"
        y="96"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="284"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Tender Load
      </text>
      <text
        x="284"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        rate · lane · window
      </text>

      <rect
        x="444"
        y="96"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="548"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Load Board
      </text>
      <text
        x="548"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        was: phone the driver
      </text>

      <rect
        x="708"
        y="96"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="812"
        y="128"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Resolve
      </text>
      <text
        x="812"
        y="146"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        reassign · notify shipper
      </text>

      {/* ============ LANE 1 — SHARED STATE (filled box, soft border) ============ */}
      <rect
        x="180"
        y="232"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="284"
        y="264"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Assigned
      </text>
      <text
        x="284"
        y="282"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        tender · rate · window
      </text>

      {/* FOCAL: solid ink fill, paper text — the object that did not exist before */}
      <rect
        x="444"
        y="232"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="548"
        y="264"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        In Transit + ELD
      </text>
      <text
        x="548"
        y="282"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        position · status · hours
      </text>

      <rect
        x="708"
        y="232"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="812"
        y="264"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Exception
      </text>
      <text
        x="812"
        y="282"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        reason code · photo
      </text>

      {/* ============ LANE 2 — DRIVER ============ */}
      <rect
        x="180"
        y="368"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="284"
        y="400"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Accept
      </text>
      <text
        x="284"
        y="418"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        one tap · gloves on
      </text>

      <rect
        x="444"
        y="368"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="548"
        y="400"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Set Status
      </text>
      <text
        x="548"
        y="418"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        offline queue · auto-log
      </text>

      <rect
        x="708"
        y="368"
        width="208"
        height="72"
        rx="6"
        fill="var(--dg-paper)"
        stroke="var(--dg-ink)"
        strokeWidth="1"
      />
      <text
        x="812"
        y="400"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
        textAnchor="middle"
      >
        Report Issue
      </text>
      <text
        x="812"
        y="418"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        photo · reason code
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
        Actor step
      </text>

      <rect
        x="300"
        y="532"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="318"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Shared state
      </text>

      <rect
        x="470"
        y="532"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="488"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — the shared object
      </text>

      <line
        x1="730"
        y1="538"
        x2="752"
        y2="538"
        stroke="var(--dg-prose)"
        strokeWidth="1"
        markerEnd="url(#ed-arrow)"
      />
      <text
        x="762"
        y="542"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Read / write
      </text>
    </svg>
  );
}
