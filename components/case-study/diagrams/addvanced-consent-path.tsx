"use client";

/**
 * Addvance — the same result, drawn as two screens.
 *
 * The decision this illustrates is "consent and transparency over the magic
 * moment". Drawn as a two-up screen comparison rather than a fork, because
 * the argument is not that a route was chosen — it is that the identical
 * finding produces two entirely different products depending on how it is
 * presented, and that difference is only convincing if the reader can see
 * both screens and judge them. A fork would say "we picked the lower branch";
 * two rendered interface states say "here is what a user would have been
 * handed, and here is what they were handed instead".
 *
 * So both frames are the same size, carry the same header, the same result
 * row and the same line of copy, and diverge only below it: screen A stops at
 * the claim and has an empty region where its evidence would be, while screen
 * B spends that region on the route — a breadcrumb of named hops and a list
 * where each hop is a person with a mute toggle. Everything standing in for
 * text is a bar rather than lettering, so the eye reads layout instead of
 * reading words twice.
 *
 * The path search that produced the result is one strip above both frames,
 * deliberately not a second flowchart: its only job is to establish that the
 * two screens are showing the same thing.
 *
 * The shipped frame is the single focal element and signals it by inversion —
 * ink fill, paper text — which also makes the two-up legible at a glance.
 * There are no arrows in this figure and therefore no markers; a screen
 * comparison has no flow to trace.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function AddvancedConsentPathDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 640"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="addvanced-consent-title addvanced-consent-desc"
    >
      <title id="addvanced-consent-title">
        The same result, drawn as two screens
      </title>
      <desc id="addvanced-consent-desc">
        Two mobile screens of identical size, side by side, both showing the
        same referral result. A strip above them names its source: the
        user&apos;s imported first-degree network, searched across second- and
        third-degree connections, returning one person who could refer them.
        Screen A, outlined in a dashed rule because it was cut, shows a header,
        the result — an avatar, two lines of text and a referral badge — then a
        single line of copy reading &ldquo;You have a way into this role,&rdquo;
        one action button, and after that an empty dashed region marked no
        source, no path, no control. That screen cannot answer how it knew.
        Screen B, what shipped, is drawn inverted in solid ink with pale text
        and carries the identical header, result and line of copy, then spends
        the rest of itself on the route: a breadcrumb of four named hops from
        you to a first-, second- and third-degree connection, and a list where
        each hop is a person with their own row, their relationship, and a
        toggle that mutes them — the third hop shown muted. Nobody in testing
        described the feature as invasive once that path was visible.
      </desc>

      <rect width="100%" height="100%" fill="var(--dg-paper)" />

      {/* ============ THE SHARED SOURCE — one strip, both screens ============ */}
      <text
        x="32"
        y="40"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        THE FINDING, ONCE
      </text>
      <rect
        x="32"
        y="52"
        width="896"
        height="64"
        rx="6"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="52"
        y="80"
        fill="var(--dg-ink)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
      >
        One path search, one result
      </text>
      <text
        x="52"
        y="100"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        your imported 1st degree · searched across 2nd and 3rd · one person who
        can refer you
      </text>
      <text
        x="908"
        y="92"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="end"
      >
        both screens below show this same result
      </text>

      {/* Quiet ticks tying the strip to each screen — no junction, no fork */}
      <line
        x1="240"
        y1="116"
        x2="240"
        y2="132"
        stroke="var(--dg-hairline)"
        strokeWidth="1"
      />
      <line
        x1="720"
        y1="116"
        x2="720"
        y2="132"
        stroke="var(--dg-hairline)"
        strokeWidth="1"
      />

      {/* ============ SCREEN A — the version cut ============ */}
      <text
        x="32"
        y="146"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        A · THE VERSION CUT
      </text>
      <rect
        x="32"
        y="160"
        width="416"
        height="340"
        rx="10"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />

      {/* A — header bar */}
      <rect
        x="50"
        y="173"
        width="14"
        height="14"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.38"
      />
      <rect
        x="72"
        y="176"
        width="88"
        height="8"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.55"
      />
      <circle cx="412" cy="180" r="1.6" fill="var(--dg-quiet)" opacity="0.5" />
      <circle cx="420" cy="180" r="1.6" fill="var(--dg-quiet)" opacity="0.5" />
      <circle cx="428" cy="180" r="1.6" fill="var(--dg-quiet)" opacity="0.5" />
      <line
        x1="32"
        y1="200"
        x2="448"
        y2="200"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />

      {/* A — the result row */}
      <text
        x="52"
        y="222"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        THE SAME RESULT
      </text>
      <circle cx="66" cy="252" r="14" fill="var(--dg-quiet)" opacity="0.32" />
      <rect
        x="92"
        y="240"
        width="150"
        height="9"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <rect
        x="92"
        y="256"
        width="104"
        height="7"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.38"
      />
      <rect
        x="364"
        y="242"
        width="64"
        height="18"
        rx="9"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <text
        x="396"
        y="254"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        REFERRAL
      </text>
      <line
        x1="32"
        y1="300"
        x2="448"
        y2="300"
        stroke="var(--dg-edge)"
        strokeWidth="0.8"
      />

      {/* A — the claim, an action, and then nothing */}
      <text
        x="52"
        y="324"
        fill="var(--dg-quiet)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
      >
        &ldquo;You have a way into this role.&rdquo;
      </text>
      <rect
        x="52"
        y="352"
        width="120"
        height="22"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
      />
      <rect
        x="78"
        y="359"
        width="68"
        height="8"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.5"
      />
      <rect
        x="52"
        y="386"
        width="376"
        height="80"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        opacity="0.7"
      />
      <text
        x="240"
        y="418"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.14em"
      >
        NO SOURCE · NO PATH · NO CONTROL
      </text>
      <text
        x="240"
        y="438"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        the screen cannot answer &ldquo;how did you know?&rdquo;
      </text>
      <text
        x="52"
        y="486"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        one string, and nothing behind it
      </text>

      {/* A — verdict */}
      <text
        x="32"
        y="522"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        cut — an unexplained suggestion reads as surveillance
      </text>
      <text
        x="32"
        y="538"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        the moment a user wonders how you knew
      </text>

      {/* ============ SCREEN B — FOCAL: what shipped, inverted ============ */}
      <text
        x="512"
        y="146"
        fill="var(--dg-ink)"
        fontSize="8"
        fontWeight="600"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        B · WHAT SHIPPED
      </text>
      <rect
        x="512"
        y="160"
        width="416"
        height="340"
        rx="10"
        fill="var(--dg-ink)"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />

      {/* B — header bar, identical furniture */}
      <rect
        x="530"
        y="173"
        width="14"
        height="14"
        rx="3"
        fill="var(--dg-paper)"
        opacity="0.38"
      />
      <rect
        x="552"
        y="176"
        width="88"
        height="8"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.55"
      />
      <circle cx="892" cy="180" r="1.6" fill="var(--dg-paper)" opacity="0.5" />
      <circle cx="900" cy="180" r="1.6" fill="var(--dg-paper)" opacity="0.5" />
      <circle cx="908" cy="180" r="1.6" fill="var(--dg-paper)" opacity="0.5" />
      <line
        x1="512"
        y1="200"
        x2="928"
        y2="200"
        stroke="var(--dg-paper)"
        strokeWidth="0.8"
        opacity="0.22"
      />

      {/* B — the same result row */}
      <text
        x="532"
        y="222"
        fill="var(--dg-paper)"
        opacity="0.62"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        THE SAME RESULT
      </text>
      <circle cx="546" cy="252" r="14" fill="var(--dg-paper)" opacity="0.3" />
      <rect
        x="572"
        y="240"
        width="150"
        height="9"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.62"
      />
      <rect
        x="572"
        y="256"
        width="104"
        height="7"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.36"
      />
      <rect
        x="844"
        y="242"
        width="64"
        height="18"
        rx="9"
        fill="var(--dg-paper)"
        opacity="0.16"
      />
      <text
        x="876"
        y="254"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        REFERRAL
      </text>
      <line
        x1="512"
        y1="300"
        x2="928"
        y2="300"
        stroke="var(--dg-paper)"
        strokeWidth="0.8"
        opacity="0.22"
      />

      {/* B — the same claim, then the route underneath it */}
      <text
        x="532"
        y="324"
        fill="var(--dg-paper)"
        fontSize="12"
        fontWeight="600"
        fontFamily="var(--font-geist), system-ui, sans-serif"
      >
        &ldquo;You have a way into this role.&rdquo;
      </text>
      <text
        x="532"
        y="344"
        fill="var(--dg-paper)"
        opacity="0.62"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        HOW WE FOUND IT
      </text>

      {/* B — hop chain, as a breadcrumb of chips */}
      <rect
        x="532"
        y="352"
        width="76"
        height="22"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.16"
      />
      <text
        x="570"
        y="366"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        YOU
      </text>
      <path
        d="M 617.5,359 L 622.5,363 L 617.5,367"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect
        x="632"
        y="352"
        width="76"
        height="22"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.16"
      />
      <text
        x="670"
        y="366"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        1ST
      </text>
      <path
        d="M 717.5,359 L 722.5,363 L 717.5,367"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect
        x="732"
        y="352"
        width="76"
        height="22"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.16"
      />
      <text
        x="770"
        y="366"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        2ND
      </text>
      <path
        d="M 817.5,359 L 822.5,363 L 817.5,367"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="1"
        opacity="0.5"
      />
      <rect
        x="832"
        y="352"
        width="76"
        height="22"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.16"
      />
      <text
        x="870"
        y="366"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        letterSpacing="0.06em"
      >
        3RD
      </text>

      {/* B — the path list: one row per hop, each attributable and mutable */}
      <rect
        x="532"
        y="380"
        width="376"
        height="26"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.08"
      />
      <circle cx="550" cy="393" r="8" fill="var(--dg-paper)" opacity="0.3" />
      <rect
        x="568"
        y="387"
        width="112"
        height="6"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.62"
      />
      <rect
        x="568"
        y="396"
        width="78"
        height="4"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.34"
      />
      <text
        x="700"
        y="397"
        fill="var(--dg-paper)"
        opacity="0.62"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        1ST DEGREE
      </text>
      <rect
        x="862"
        y="387"
        width="30"
        height="12"
        rx="6"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle cx="869" cy="393" r="4" fill="var(--dg-paper)" opacity="0.7" />

      <rect
        x="532"
        y="410"
        width="376"
        height="26"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.08"
      />
      <circle cx="550" cy="423" r="8" fill="var(--dg-paper)" opacity="0.3" />
      <rect
        x="568"
        y="417"
        width="112"
        height="6"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.62"
      />
      <rect
        x="568"
        y="426"
        width="78"
        height="4"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.34"
      />
      <text
        x="700"
        y="427"
        fill="var(--dg-paper)"
        opacity="0.62"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        2ND DEGREE
      </text>
      <rect
        x="862"
        y="417"
        width="30"
        height="12"
        rx="6"
        fill="none"
        stroke="var(--dg-paper)"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <circle cx="869" cy="423" r="4" fill="var(--dg-paper)" opacity="0.7" />

      {/* Third hop, muted — the control is real, not decorative */}
      <rect
        x="532"
        y="440"
        width="376"
        height="26"
        rx="4"
        fill="var(--dg-paper)"
        opacity="0.08"
      />
      <circle cx="550" cy="453" r="8" fill="var(--dg-paper)" opacity="0.18" />
      <rect
        x="568"
        y="447"
        width="112"
        height="6"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.28"
      />
      <rect
        x="568"
        y="456"
        width="78"
        height="4"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.18"
      />
      <text
        x="700"
        y="457"
        fill="var(--dg-paper)"
        opacity="0.34"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        3RD DEGREE
      </text>
      <text
        x="800"
        y="457"
        fill="var(--dg-paper)"
        opacity="0.45"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.06em"
      >
        MUTED
      </text>
      <rect
        x="862"
        y="447"
        width="30"
        height="12"
        rx="6"
        fill="var(--dg-paper)"
        opacity="0.28"
      />
      <circle cx="885" cy="453" r="4" fill="var(--dg-paper)" opacity="0.85" />

      <text
        x="532"
        y="486"
        fill="var(--dg-paper)"
        opacity="0.78"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        every hop named · any hop can be muted
      </text>

      {/* B — verdict */}
      <text
        x="512"
        y="522"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        shipped — nobody in testing described the feature
      </text>
      <text
        x="512"
        y="538"
        fill="var(--dg-prose)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        as invasive once the path was visible
      </text>

      {/* ============ LEGEND ============ */}
      <line
        x1="32"
        y1="568"
        x2="928"
        y2="568"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />
      <text
        x="32"
        y="594"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.14em"
      >
        LEGEND
      </text>

      <rect
        x="104"
        y="584"
        width="12"
        height="12"
        rx="2"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      <text
        x="122"
        y="594"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Dashed frame — the version cut
      </text>

      <rect
        x="300"
        y="584"
        width="12"
        height="12"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="318"
        y="594"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Focal — what shipped
      </text>

      <rect
        x="450"
        y="584"
        width="26"
        height="12"
        rx="3"
        fill="var(--dg-ink)"
      />
      <rect
        x="454"
        y="587"
        width="18"
        height="6"
        rx="2"
        fill="var(--dg-paper)"
        opacity="0.32"
      />
      <text
        x="484"
        y="594"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Chip — one named hop
      </text>

      <rect
        x="104"
        y="613"
        width="26"
        height="6"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.55"
      />
      <text
        x="140"
        y="620"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Bar — a line of text
      </text>

      <circle cx="306" cy="616" r="6" fill="var(--dg-quiet)" opacity="0.4" />
      <text
        x="318"
        y="620"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Dot — a person
      </text>

      <rect
        x="450"
        y="610"
        width="26"
        height="12"
        rx="6"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="0.8"
      />
      <circle cx="469" cy="616" r="4" fill="var(--dg-quiet)" />
      <text
        x="484"
        y="620"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        Toggle — mute a hop
      </text>
    </svg>
  );
}
