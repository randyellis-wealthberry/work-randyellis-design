"use client";

/**
 * Waffle — what fits through the input, and what falls out.
 *
 * The decision this illustrates is "chat interface over form-based input". The
 * mechanism is not the widget, it is what each widget can accept: a form has a
 * fixed number of shaped openings, and everything a hiring manager says that
 * does not match one of them is simply not collected. So the figure starts with
 * one utterance at the top and follows it into both inputs, and the argument is
 * visible as the fragments the form has nowhere to put.
 *
 * The two quoted fragments are the ones the case study quotes. The rest are
 * unlabelled bars standing for the nuance around them, because inventing three
 * more plausible-sounding requirements would be putting words in a hiring
 * manager's mouth to win a point.
 *
 * The competency counts at the bottom are the measured ones — 4.1 from the
 * prototype form flow against 6.2 from chat — and the bars are drawn to that
 * ratio rather than to whatever looks more dramatic.
 *
 * Inversion is spent once, on the chat input that takes the sentence whole.
 *
 * Colour comes entirely from `--dg-*` (declared on `.diagram-figure` in
 * globals.css) plus opacity, so this single SVG serves light and dark.
 */
export function WaffleChatCaptureDiagram() {
  return (
    <svg
      className="block h-auto w-full"
      viewBox="0 0 960 620"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="waffle-capture-title waffle-capture-desc"
    >
      <title id="waffle-capture-title">
        One thing said, and what each input can take from it
      </title>
      <desc id="waffle-capture-desc">
        At the top, what a hiring manager actually says, drawn as one band
        holding five fragments: two quoted — &ldquo;can handle conflict&rdquo;
        and &ldquo;must work remote&rdquo; — and three unlabelled bars standing
        for the nuance around them, left unlabelled because inventing more
        requirements would be putting words in someone&apos;s mouth. The
        utterance then meets two inputs. On the left, dashed because it was
        refused, is a form: fixed fields for job title, seniority and five key
        skills. Two fragments find a field. The other three fall out beneath it,
        marked as having nowhere to go — the form collects what it anticipated
        and nothing else. On the right, drawn inverted because it shipped, is a
        chat input that accepts the sentence whole, with the requirements pulled
        out of it afterwards rather than demanded in advance. Beneath both, the
        measured result: an average of 4.1 competencies per scorecard from the
        prototype form flow against 6.2 from chat, drawn to that ratio. A note
        records that twelve recruiters preferred the chat eleven to one, most
        strongly on complex and hybrid roles, and finished forty per cent
        faster.
      </desc>
      <defs>
        <marker
          id="wc-arrow-quiet"
          markerWidth="8"
          markerHeight="6"
          refX="7"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 8 3, 0 6" fill="var(--dg-quiet)" />
        </marker>
        <marker
          id="wc-arrow-focal"
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

      {/* ============ THE UTTERANCE ============ */}
      <text
        x="40"
        y="52"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.18em"
      >
        WHAT A HIRING MANAGER ACTUALLY SAYS
      </text>
      <line
        x1="40"
        y1="64"
        x2="920"
        y2="64"
        stroke="var(--dg-hairline)"
        strokeWidth="0.8"
      />

      <rect
        x="40"
        y="84"
        width="880"
        height="56"
        rx="4"
        fill="var(--dg-wash)"
      />
      <rect
        x="56"
        y="100"
        width="184"
        height="24"
        rx="3"
        fill="var(--dg-ink)"
      />
      <text
        x="148"
        y="116"
        fill="var(--dg-paper)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        can handle conflict
      </text>
      <rect
        x="256"
        y="100"
        width="176"
        height="24"
        rx="3"
        fill="var(--dg-ink)"
      />
      <text
        x="344"
        y="116"
        fill="var(--dg-paper)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
      >
        must work remote
      </text>
      <rect
        x="448"
        y="100"
        width="140"
        height="24"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.45"
      />
      <rect
        x="604"
        y="100"
        width="164"
        height="24"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.45"
      />
      <rect
        x="784"
        y="100"
        width="120"
        height="24"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.45"
      />
      <text
        x="448"
        y="158"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        THE NUANCE AROUND THEM — LEFT UNLABELLED RATHER THAN INVENTED
      </text>

      {/* ============ THE FORM ============ */}
      <path
        d="M 240,140 V 202"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
        markerEnd="url(#wc-arrow-quiet)"
      />
      <text
        x="40"
        y="212"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        A FORM · FIXED OPENINGS
      </text>
      <rect
        x="40"
        y="222"
        width="400"
        height="186"
        rx="4"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />

      <rect
        x="56"
        y="238"
        width="368"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="66"
        y="253"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        JOB TITLE
      </text>
      <rect
        x="56"
        y="266"
        width="368"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="66"
        y="281"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        SENIORITY
      </text>
      <rect
        x="56"
        y="294"
        width="368"
        height="22"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="66"
        y="309"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        KEY SKILL 1 · can handle conflict
      </text>
      <rect
        x="56"
        y="322"
        width="368"
        height="22"
        rx="3"
        fill="var(--dg-wash)"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <text
        x="66"
        y="337"
        fill="var(--dg-prose)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        KEY SKILL 2 · must work remote
      </text>
      <rect
        x="56"
        y="350"
        width="368"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />
      <rect
        x="56"
        y="378"
        width="368"
        height="22"
        rx="3"
        fill="none"
        stroke="var(--dg-edge)"
        strokeWidth="1"
      />

      {/* what the form cannot take */}
      {/* What the form could not take falls out of its underside. */}
      <path
        d="M 240,408 V 424"
        fill="none"
        stroke="var(--dg-quiet)"
        strokeWidth="1"
        strokeDasharray="2,4"
      />
      <rect
        x="222"
        y="424"
        width="140"
        height="18"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.3"
      />
      <rect
        x="222"
        y="448"
        width="164"
        height="18"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.3"
      />
      <rect
        x="222"
        y="472"
        width="120"
        height="18"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.3"
      />
      <text
        x="40"
        y="437"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        NOWHERE TO
      </text>
      <text
        x="40"
        y="451"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        PUT THESE
      </text>

      {/* ============ THE CHAT ============ */}
      <path
        d="M 710,140 V 202"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#wc-arrow-focal)"
      />
      <text
        x="500"
        y="212"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        A CHAT · ONE OPENING, ANY SHAPE
      </text>
      <rect
        x="500"
        y="222"
        width="420"
        height="60"
        rx="4"
        fill="var(--dg-ink)"
      />
      <text
        x="710"
        y="248"
        fill="var(--dg-paper)"
        fontSize="12"
        textAnchor="middle"
      >
        The sentence goes in whole
      </text>
      <text
        x="710"
        y="268"
        fill="var(--dg-paper)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        textAnchor="middle"
        opacity="0.85"
      >
        NOTHING HAS TO BE PRE-SORTED FIRST
      </text>

      <line
        x1="710"
        y1="282"
        x2="710"
        y2="304"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
        markerEnd="url(#wc-arrow-focal)"
      />
      <rect
        x="500"
        y="312"
        width="420"
        height="96"
        rx="4"
        fill="none"
        stroke="var(--dg-ink)"
        strokeWidth="1.2"
      />
      <text
        x="516"
        y="334"
        fill="var(--dg-ink)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        REQUIREMENTS PULLED OUT AFTERWARDS
      </text>
      <rect
        x="516"
        y="344"
        width="180"
        height="14"
        rx="3"
        fill="var(--dg-ink)"
      />
      <rect
        x="708"
        y="344"
        width="196"
        height="14"
        rx="3"
        fill="var(--dg-ink)"
      />
      <rect
        x="516"
        y="366"
        width="140"
        height="14"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <rect
        x="668"
        y="366"
        width="164"
        height="14"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <rect
        x="516"
        y="388"
        width="120"
        height="14"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <rect
        x="648"
        y="388"
        width="96"
        height="14"
        rx="3"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />

      {/* ============ THE MEASURED RESULT ============ */}
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
        y="536"
        fill="var(--dg-quiet)"
        fontSize="8"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        letterSpacing="0.16em"
      >
        COMPETENCIES PER SCORECARD
      </text>

      <text
        x="40"
        y="562"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        FORM
      </text>
      <rect
        x="100"
        y="551"
        width="215"
        height="14"
        rx="2"
        fill="var(--dg-quiet)"
        opacity="0.6"
      />
      <text
        x="325"
        y="562"
        fill="var(--dg-quiet)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        4.1
      </text>

      <text
        x="40"
        y="586"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        CHAT
      </text>
      <rect
        x="100"
        y="575"
        width="325"
        height="14"
        rx="2"
        fill="var(--dg-ink)"
      />
      <text
        x="435"
        y="586"
        fill="var(--dg-ink)"
        fontSize="9"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      >
        6.2
      </text>

      <text x="520" y="562" fill="var(--dg-prose)" fontSize="11">
        Twelve recruiters preferred the chat eleven to one, most
      </text>
      <text x="520" y="580" fill="var(--dg-prose)" fontSize="11">
        strongly on complex and hybrid roles — and finished 40% faster.
      </text>
    </svg>
  );
}
