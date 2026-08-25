"use client";

/**
 * Waffle — one scorecard, and how a panel gets hold of it.
 *
 * The decision this illustrates is "multi-tenant from day one instead of a
 * single-user MVP". The argument is about what happens to the artifact once
 * more than one person needs it, so the figure is drawn as containment: a box
 * that is the product, and whether the scorecard stays inside it.
 *
 * On the single-user side the scorecard leaves — as a screenshot, as an emailed
 * PDF, as something retyped by hand — and each copy is drawn thinner than the
 * last, because that is what a copy is. Three panel members end up holding
 * three different documents, none of which is the scorecard any more. On the
 * multi-tenant side nothing leaves; the arrows run inward instead, and the
 * panel reaches the one object.
 *
 * The three weeks it cost are stated rather than softened, and so is what they
 * bought: the first paying customer was a team, which is the whole reason the
 * feature existed before there was anyone to use it.
 *
 * Inversion is spent once, on the scorecard that stays put.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function WaffleMultiTenantDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 560"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="waffle-tenant-title waffle-tenant-desc"
    >
      <title id="waffle-tenant-title">
        Whether the scorecard leaves the product to reach the panel
      </title>
      <desc id="waffle-tenant-desc">
        Two boxes, each representing the product, with a hiring panel of three
        outside it. On the left, dashed because it was refused, is the
        single-user version: one scorecard sits inside the product, and three
        copies leave it — a screenshot, an emailed PDF, and a rubric retyped by
        hand. Each copy is drawn with less in it than the one before, and each
        reaches a different panel member, so the panel ends up holding three
        documents and none of them is the scorecard any more. On the right,
        drawn in solid ink, is what shipped: the scorecard stays inside the
        product and the three arrows run inward instead, the panel reaching one
        shared object through organisations, role-based access and a shared
        library. Underneath, the exchange: building it before launch added three
        weeks, and the first paying customer was a twelve-person recruiting team
        rather than an individual, with no sharing features left to retrofit
        afterwards.
      </desc>
      <defs>
        <marker
          id="wt-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="wt-arrow-focal"
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

      {/* ============ HEADERS ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        SHIP SINGLE-USER FIRST
      </text>
      <text
        x="500"
        y="52"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT SHIPPED · TEAMS FROM DAY ONE
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
        x1="470"
        y1="64"
        x2="470"
        y2="424"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      {/* ============ LEFT — THE COPIES LEAVE ============ */}
      <rect
        x="40"
        y="92"
        width="200"
        height="140"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="52"
        y="112"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE PRODUCT
      </text>
      <rect
        x="60"
        y="126"
        width="160"
        height="86"
        rx="4"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="140"
        y="152"
        fill="var(--dg-quiet)"
        fontSize="12"
        textAnchor="middle"
      >
        The scorecard
      </text>
      <rect
        x="76"
        y="164"
        width="128"
        height="8"
        rx="3"
        fill="var(--dg-edge)"
      />
      <rect
        x="76"
        y="180"
        width="104"
        height="8"
        rx="3"
        fill="var(--dg-edge)"
      />
      <rect
        x="76"
        y="196"
        width="120"
        height="8"
        rx="3"
        fill="var(--dg-edge)"
      />

      {/* three copies, each thinner than the last */}
      <line
        x1="240"
        y1="140"
        x2="276"
        y2="140"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wt-arrow-quiet)"
      />
      <line
        x1="240"
        y1="176"
        x2="276"
        y2="222"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wt-arrow-quiet)"
      />
      <line
        x1="240"
        y1="204"
        x2="276"
        y2="302"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wt-arrow-quiet)"
      />

      <rect
        x="284"
        y="112"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="296"
        y="130"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        SCREENSHOT
      </text>
      <rect
        x="296"
        y="140"
        width="106"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.5"
      />
      <rect
        x="296"
        y="154"
        width="78"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.5"
      />

      <rect
        x="284"
        y="196"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="296"
        y="214"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        EMAILED PDF
      </text>
      <rect
        x="296"
        y="224"
        width="84"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.4"
      />
      <rect
        x="296"
        y="238"
        width="52"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.4"
      />

      <rect
        x="284"
        y="280"
        width="150"
        height="60"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="296"
        y="298"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        RETYPED BY HAND
      </text>
      <rect
        x="296"
        y="308"
        width="56"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.3"
      />
      <rect
        x="296"
        y="322"
        width="34"
        height="7"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.3"
      />

      <text x="40" y="380" fill="var(--dg-prose)" fontSize="11">
        Three people, three documents, and the
      </text>
      <text x="40" y="398" fill="var(--dg-prose)" fontSize="11">
        one that was built is no longer any of them.
      </text>

      {/* ============ RIGHT — NOTHING LEAVES ============ */}
      <rect
        x="500"
        y="92"
        width="420"
        height="180"
        rx="6"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="516"
        y="112"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE PRODUCT · ORGS · ROLE-BASED ACCESS · SHARED LIBRARY
      </text>
      <rect
        x="620"
        y="132"
        width="180"
        height="112"
        rx="4"
        fill="var(--dg-ink)"
      />
      <text
        x="710"
        y="164"
        fill="var(--dg-paper)"
        fontSize="12"
        textAnchor="middle"
      >
        The scorecard
      </text>
      <text
        x="710"
        y="182"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        opacity="0.85"
      >
        ONE OF IT
      </text>
      <rect
        x="640"
        y="196"
        width="140"
        height="8"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.5"
      />
      <rect
        x="640"
        y="212"
        width="112"
        height="8"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.5"
      />
      <rect
        x="640"
        y="228"
        width="128"
        height="8"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.5"
      />

      {/* the panel reaches in */}
      <line
        x1="880"
        y1="308"
        x2="800"
        y2="256"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#wt-arrow-focal)"
      />
      <line
        x1="710"
        y1="320"
        x2="710"
        y2="256"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#wt-arrow-focal)"
      />
      <line
        x1="540"
        y1="308"
        x2="620"
        y2="256"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#wt-arrow-focal)"
      />

      <circle
        cx="540"
        cy="322"
        r="14"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
      />
      <circle
        cx="710"
        cy="334"
        r="14"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
      />
      <circle
        cx="880"
        cy="322"
        r="14"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
      />
      <text
        x="710"
        y="372"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.16em"
      >
        THE HIRING PANEL
      </text>
      <text
        x="710"
        y="398"
        fill="var(--dg-prose)"
        fontSize="11"
        textAnchor="middle"
      >
        Everyone is looking at the same object.
      </text>

      {/* ============ WHAT IT COST, WHAT IT BOUGHT ============ */}
      <line
        x1="40"
        y1="424"
        x2="920"
        y2="424"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="40"
        y="450"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        THE PRICE
      </text>
      <text x="180" y="450" fill="var(--dg-prose)" fontSize="11">
        Three weeks added before launch, spent on people who did not exist yet.
      </text>
      <text
        x="40"
        y="480"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        WHAT IT BOUGHT
      </text>
      <text x="180" y="480" fill="var(--dg-ink)" fontSize="11">
        The first paying customer was a twelve-person recruiting team.
      </text>
      <text x="180" y="502" fill="var(--dg-quiet)" fontSize="11">
        Not an individual who might try it once — and nothing to retrofit.
      </text>
    </svg>
  );
}
