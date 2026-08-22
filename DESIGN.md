---
name: Randy Ellis — work.randyellis.design
description: A zinc-and-white editorial portfolio where hairlines carry the structure and weight carries the hierarchy.
colors:
  ink: "#18181b"
  ink-deep: "#09090b"
  paper: "#ffffff"
  paper-inverse: "#fafafa"
  quiet: "#71717a"
  quiet-inverse: "#a1a1aa"
  prose: "#52525b"
  prose-inverse: "#d4d4d8"
  hairline: "#e4e4e7"
  hairline-inverse: "#27272a"
  edge: "#d4d4d8"
  edge-inverse: "#3f3f46"
  wash: "#f4f4f5"
  wash-inverse: "#18181b"
typography:
  display:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.03em"
  figure:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.03em"
    fontFeature: "tabular-nums"
  lead:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  subhead:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  footnote:
    fontFamily: "var(--font-geist), system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
  sm: "0.25rem"
  md: "0.375rem"
  lg: "0.5rem"
  xl: "0.75rem"
  2xl: "1rem"
  full: "9999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
  10: "40px"
  12: "48px"
  16: "64px"
  20: "80px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.edge-inverse}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "12px 24px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.prose}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
    height: "44px"
  nav-link-hover:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.ink}"
  link-inline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    rounded: "{rounded.none}"
    padding: "0"
    height: "44px"
  ledger-cell-gap:
    backgroundColor: "transparent"
    textColor: "{colors.quiet}"
    typography: "{typography.body}"
    padding: "20px 32px 20px 0"
  ledger-cell-claim:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "20px 0 20px 32px"
  table-cell-numeric:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.subhead}"
    padding: "16px 0 16px 16px"
  metric-figure:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
  figure-ground:
    backgroundColor: "{colors.wash}"
    textColor: "{colors.quiet}"
    typography: "{typography.footnote}"
    rounded: "{rounded.xl}"
    padding: "16px"
  value-pending:
    backgroundColor: "transparent"
    textColor: "{colors.quiet}"
    typography: "{typography.body}"
---

# Design System: Randy Ellis — work.randyellis.design

## Overview

**Creative North Star: "The Ledger Page"**

This is a printed accounts page rendered for the screen: a white sheet, a single family of grays, and hairlines doing every job a box, a card, or a drop shadow would do elsewhere. Nothing is decorated. Structure is drawn with 1px rules; hierarchy is carried by weight and darkness, never by hue. When a surface needs to argue something, it sets two things beside each other and lets the reader do the arithmetic.

The system is inherited, not invented. It predates any single page in it: zinc neutrals on white and near-black, Geist loaded through `next/font`, tight negative tracking on large type, tabular figures on anything countable. It was first written down from the fractional-CDO retainer at `/services`. It now runs across the whole case-study estate: all six project surfaces render through one component, `CaseStudyTemplate`, and every section on every one of them — the template's own and the ones a page brings with it — opens through the three class constants in `section-chrome.tsx`. That file, not this document, is where a rule weight or a label colour would drift first; it exists so it cannot.

Density is editorial rather than dashboard-like: generous vertical rhythm (64–80px between movements, 20px inside a row), reading measures capped in `ch` rather than pixels, and no more than one moving thing per surface. Dark mode is a true inversion of the same ramp, not a separate palette.

**Key Characteristics:**
- One neutral family (zinc) on white / near-black; no chromatic accent on editorial surfaces
- Hairlines instead of cards: 1px rules separate rows, sections, and columns, and one rule per job
- Weight, not color, encodes confidence: gray states the problem, near-black states the answer
- Tabular figures on every countable number, at their true precision
- Motion is scroll-linked and singular; nothing hides itself waiting to animate in
- Reading measures in `ch` (18ch headline, 62ch prose) independent of container width
- Section chrome is defined once and imported, never re-typed on a page

## Colors

A single zinc ramp on paper white, inverted wholesale for dark mode; the only "accent" available is contrast itself.

### Primary
- **Ink** (#18181b): The assertion color. Headlines, confirmed values, the right-hand side of any paired comparison, the primary button's fill, section-boundary rules. In dark mode it becomes the paper and **Paper** becomes the ink.
- **Ink Deep** (#09090b): The dark-mode page ground only. Never used as a text color on white.

### Neutral
- **Paper** (#ffffff): Light-mode page ground and the label on filled buttons.
- **Paper Inverse** (#fafafa): Dark-mode text on ink grounds where pure white would glare.
- **Quiet** (#71717a) / **Quiet Inverse** (#a1a1aa): The deliberately subordinate voice — section labels, the left-hand "the problem" column, table row heads, captions, footnotes, and unconfirmed values. It steps one stop lighter in dark mode rather than holding; on a near-black ground the light-mode value does not carry.
- **Prose** (#52525b) / **Prose Inverse** (#d4d4d8): Running body copy, lead paragraphs, and every explanatory paragraph under a section label.
- **Hairline** (#e4e4e7) / **Hairline Inverse** (#27272a): Row separators, table rules, column dividers, and the static structural rule.
- **Edge** (#d4d4d8) / **Edge Inverse** (#3f3f46): Secondary-button strokes, link underline decoration at rest, input borders.
- **Wash** (#f4f4f5) / **Wash Inverse** (#18181b): Hover grounds for navigation and ghost controls, and the tinted ground a contained figure sits on.

### Named Rules

**The One Family Rule.** Editorial surfaces use zinc and nothing else. If something needs to stand out, make it darker or heavier — never more colorful. A new hue on a text surface is a bug report, not a design decision. This extends to focus rings: the ring is Ink on light and Paper on dark, never a browser blue and never a themed blue.

**The Weight Ledger Rule.** In any paired or tabulated content, Quiet states the condition being replaced and Ink at `font-medium` states what replaces it. The two tones are the argument; keeping them at the same weight destroys it. This holds in a `<table>` exactly as it holds in a grid: the row head is Quiet at regular weight, the cells that answer it are Ink at `font-medium`.

**The Placeholder Marking Rule.** A value not yet confirmed renders in Quiet against Ink for confirmed values, plus a visible "to confirm" note in the same row at `text-xs` (#71717a light, #a1a1aa dark) and a `data-placeholder="true"` hook. Never a hover-only tooltip (invisible on touch), never a dotted underline (reads as a link), never a tint that fails the contrast floor.

**The Browser Surfaces Rule.** Selection and caret are part of the palette, not the browser's business: the case-study `<main>` sets selection to Ink-on-Paper and the caret to Ink, both inverted in dark mode. A surface that themes its type and leaves the selection blue is unfinished.

## Typography

**Display / Body Font:** Geist (loaded via `next/font/google` as `--font-geist`, with `system-ui, sans-serif` fallback)
**Mono Font:** Geist Mono (`--font-geist-mono`), reserved for code blocks

**Character:** One grotesque doing everything, differentiated only by size, weight, and tracking. It reads as a document rather than a brand: no display face, no serif counterpoint, no italic voice.

### Hierarchy
- **Display** (600, 2.25rem → 3rem at ≥640px, line-height 1.05, tracking -0.03em, `text-balance`): Page titles. Capped at `max-w-[18ch]` so it always breaks into two or three dense lines.
- **Headline** (600, 1.5rem → 1.875rem at ≥640px, line-height tight, tracking -0.03em, `max-w-[24ch]`): The closing proposition on a page; the only heading below the title that gets display treatment.
- **Figure** (600, 1.875rem → 2.25rem at ≥640px, tracking -0.03em, `tabular-nums`): Proof numbers and metrics.
- **Lead** (400, 1.125rem, Prose): The single paragraph under a page title, capped at `max-w-[62ch]`.
- **Body** (400, 1rem, `leading-relaxed` on running paragraphs): Ledger rows, term values, prose. Claim-side cells take `font-medium`.
- **Subhead** (500, 1rem, Ink): The named things inside a section — a decision's title, a definition-list term, a wireframe's caption, a sub-heading inside a long section. It is Body at `font-medium`, not a smaller display size; the system has no fourth heading size.
- **Label** (500, 0.875rem, tracking +0.02em, Quiet): Section labels, column heads, and table column heads. Sentence case — never uppercase, never letterspaced into a kicker. Every section label on a case study is one `SectionLabel`, so the size, tracking, and tone cannot vary between the shared surface and a page's own sections.
- **Footnote** (400, 0.75rem, Quiet): Provenance lines and qualifiers stated once for a whole band.

### Named Rules

**The Tabular Figures Rule.** Any number a reader might compare, watch change, or align against another number sets `tabular-nums`. Metrics, term values, animated counters, numeric table columns, and any outcome line that states a figure all qualify.

**The True Precision Rule.** A figure is displayed at the precision it was written with. "2.5M+" never renders as "3M+" — animated counters carry an explicit `decimals` derived from the source string.

**The Measure Rule.** Reading measures are set in `ch` on the text element (18ch display, 24ch closing headline, 62ch prose, 70ch for a single-line list item), never inherited from the container. Widening a route must not widen a paragraph — and the case-study routes are wide, so this rule is what keeps them readable.

**The One Heading Ladder Rule.** A page has exactly three heading voices below the title: the Label that opens a section, the Subhead that names a thing inside it, and nothing else. A section that wants a fourth level wants to be two sections.

## Layout

The site is a centered column whose width is owned by one component, `RouteContainer`, which maps a pathname to a measure: `max-w-screen-md` (768px) by default, `max-w-[1100px]` for `/services` and for every route under `/projects/`. The case studies are wide because they carry a multi-column ledger and a full-measure media band, neither of which fits a reading measure; the projects index stays narrow because it is a list, not a ledger. Gutters are `px-4 / sm:px-6 / lg:px-8` with `pt-8 / sm:pt-6`, and the container widens header, content, and footer as one unit.

The vertical rhythm is a 4px scale used at a few fixed steps: 16–20px inside a row, 40px between a section rule and its content, 48px between a block and a sub-heading inside the same section, 64px between a page's opening and its first movement, 80px between movements. Every section movement opens the same way — `mt-20`, a full-contrast rule (Ink light / Paper dark), `pt-10` — because that is literally one exported string, `SECTION`.

Two-column structures split at `sm` (640px), three-column ledgers at `md` (768px), and both stack below. Their dividers are static hairlines scoped to the grid itself and appear only above the breakpoint; stacked, the divider is dropped and the cells keep only their top hairline so a pair reads as one entry rather than two. The page's scroll rail is a separate element down the left edge of the ruled block at every breakpoint — 16px in from the content edge on small screens, lifted into the page margin at `sm` and above (`sm:-ml-8 sm:pl-8`, `lg:-ml-10 lg:pl-10`) so body text keeps the same left edge as the page title.

### Named Rules

**The One Rule, One Job Rule.** Separating columns and carrying a scroll timeline are different jobs and want different positions; a single line cannot hold both. A case study runs two vertical devices: a scroll rail at the left edge of the ruled argument block, and static column dividers scoped to the ledger grid alone. Merging them is what produced the defect this rule exists to prevent — a centred timeline rule crossed by two full-width lines of text at 1440w.

**The Label-Width Rule.** A definition list sizes its term column to the term, not to half the container, at one of three fixed widths: `minmax(0,14rem)` for a one-word term, `minmax(0,18rem)` for the standard row (`ROW`), `minmax(0,22rem)` for a row whose term is a link or a full phrase. At a wide measure, equal halves leave hundreds of pixels of blank between a label and its value, several rows running, and the eye loses the pairing. This asymmetry is correct; do not "balance" it back.

**The Clear Track Rule.** A rule that carries a scroll timeline lives where no line of text can cross it: in the margin, at the edge of the block it spans, never inside the text column. The audit test is literal — at every documented width, no text bounding box may intersect the rail's x position. The proof band's even four-up with a wide centre gap (`sm:grid-cols-4 sm:gap-x-16`) keeps the band airy without straddling anything.

**The Whole-Chrome Rule.** A route that needs a different measure changes it in `RouteContainer` for header, content, and footer together. Widening the page alone leaves the navigation hanging off the content's left edge.

**The Anchored Section Rule.** Every section a reader can jump to carries an `id` and `scroll-mt-10`, baked into the `SECTION` constant so it cannot be forgotten on a bespoke section. An anchored section that lands with its opening rule flush against the viewport edge reads as a page cut off mid-sentence; 40px of clearance is what makes the jump land on a heading rather than under one.

## Elevation & Depth

Editorial surfaces are flat. Depth is drawn, not cast: a 1px hairline separates peers, and a 1px rule at full Ink contrast opens a new section. There is no shadow anywhere on a case study — the ledger reads as layered because its rules have two weights, not because anything floats.

Shadows do exist in the wider component library (overlays, media cards, popovers) and remain legitimate there: they are a response to a thing genuinely sitting above the page, not a way to group content.

### Shadow Vocabulary
- **Overlay lift** (`shadow-lg` / `shadow-xl`): Menus, dialogs, popovers, hover-video chrome — anything that leaves the document plane.
- **Resting card** (`shadow-sm` / `shadow-xs`): Optional, on interactive media and card components in the legacy library only.

### Named Rules

**The Hairline-First Rule.** Structure is a line before it is a box and a box before it is a shadow. If a hairline can separate two things, use the hairline. The "Next" list at the foot of a case study is the test case: three destinations, three hairlines, no cards.

**The Two-Weight Rule.** Rules come in exactly two weights: Hairline for separating peers inside a set, full Ink/Paper contrast for opening a section. A third rule weight is drift.

## Shapes

Rectilinear and unrounded wherever the content is text: ledger rows, tables, definition lists, the contents line, and rules have no corners at all. Radius appears only on things you touch, things that hold an image, or things that overlay the page — controls at 8px (`rounded-lg`), small chrome and nav targets at 6px (`rounded-md`), figure grounds and the closing card at 12px (`rounded-xl`), expanded media at 16px (`rounded-2xl`), and avatars, pills, and dots fully round. Borders are 1px on editorial surfaces. Interactive targets hold a 44px minimum height regardless of their padding, achieved with a negative margin against padded height rather than by loosening the row.

## Components

### Section Chrome (signature)
Three exported strings and one component, defined once in `section-chrome.tsx` and imported by the template and by every page that adds its own sections.
- `SECTION` — `mt-20 scroll-mt-10 border-t border-zinc-900 pt-10 dark:border-zinc-100`. How a section opens, everywhere.
- `LABEL` — `text-sm font-medium tracking-[0.02em]` in Quiet. The label voice.
- `ROW` — a hairline-topped grid at `sm:grid-cols-[minmax(0,18rem)_1fr]` with 20px vertical padding. The standard term/value row.
- `SectionLabel` — an `<h2>` at `LABEL`, forwarding an `id` so the section can `aria-labelledby` it. Its text renders true on first paint and scrambles only on hover, so the heading in the server HTML is always the real one.

### Buttons
- **Shape:** Gently rounded (8px, `rounded-lg`), 44px minimum height, 12px/24px padding, 1rem `font-medium`.
- **Primary:** Ink fill, Paper label; inverted in dark mode. One primary per surface.
- **Secondary:** Transparent with a 1px Edge stroke and Ink label; hover darkens the stroke one step and fills with Wash.
- **Hover / Focus:** `transition-colors` only — no lift, no shadow, no scale on hover. Focus is a 2px ring in Ink (Paper in dark) offset 2px against the page ground. Press is `active:scale-[0.98]`.
- **Stacking:** Column with 12px gap below `sm`, row above it. The secondary never sits above the primary.

### Action Row (signature)
The set of links a page asks the reader to take, rendered under the lead and optionally again in the close. The first action is the primary and every other is secondary — the hierarchy is the array order, so a surface cannot ship two primaries by mistake. An external action opens in a new tab, carries a 16px `ArrowUpRight` after its label, and states the new tab in an `sr-only` note. Most case studies have no action row at all: the close's booking pair is the default, and only the surface with a live product to point at overrides it.

### Contents Line (signature)
An in-page anchor nav that reads as a contents line, not a widget: a hairline above, "On this page" in the Label voice, then the section names as wrapped inline links at 44px targets with Edge underlines that darken to Ink on hover. The labels are the section labels verbatim, taken from the same values the headings render, so the nav and the page cannot drift apart. Plain anchors only — no scroll-spy, no highlight, no sticky rail.

### Navigation
- Sentence-case labels at Label size in Prose, 44px targets, 6px radius. Hover fills with Wash and darkens the label to Ink. Desktop nav is flush-left with the content edge (`-ml-4` compensating the link's own padding) and hides below `lg`, where a global mobile menu takes over.
- **Breadcrumb:** Quiet at Label size with `ChevronRight` separators. It renders its own home link, so a trail passed to it starts at the section, never at Home. Every link target is 44px via `-my-3 py-3`, which keeps the row visually tight.

### Ledger Row (signature)
Two or three cells sharing a row across static column dividers. The left cell is Quiet at regular weight and states the problem; the middle cell is Ink at `font-medium` and states the response; an optional third cell states the outcome in Ink `tabular-nums`. Column heads show only above the breakpoint; stacked, the third cell prints its own `text-xs` Quiet name ("Result") above its value rather than relying on a column order the reader can no longer see. Two-column ledgers split `1fr / 1.15fr` and three-column ledgers `0.9fr / 1.3fr / 0.85fr` — the response column is the widest because it carries the most words.

### Results Table (signature)
Tabulated measurements use a real `<table>`: an `sr-only` `<caption>` naming what is being compared, `scope="col"` heads in the Label voice, `scope="row"` heads in Quiet at regular weight, and numeric columns right-aligned in Ink `font-medium` with `tabular-nums`. Rules are `border-b` hairlines on every row; there is no outer border, no zebra fill, and no radius. Capped at `max-w-[46rem]` so a three-column table does not stretch to the full 1100px measure.

### Proof Exhibit (signature)
A figure-over-context pair: Figure type in Ink with `tabular-nums`, then a 0.875rem context line in Prose 12px below. Four exhibits sit two-up below `sm` and four-up above it with a 64px centre gap; nothing passes through that gap. The qualifier they share (period, provenance) is stated once beneath the band as a Footnote, never repeated under each figure. The band normally follows the ledger; a page whose scale is the argument may state it first instead.

### Terms List (signature)
A definition list with a hairline above every row, a term in a fixed-width column, and its value in the remaining space. Which side carries Ink `font-medium` depends on which side is the assertion — a capability list puts weight on the term, a context list puts weight on the value. Unconfirmed values follow The Placeholder Marking Rule.

### Decision Callout (signature)
One design decision as a hairline-separated entry, not a card and not a tinted callout: a Subhead title, the decision stated in Ink, a "Why" disclosure at Label size that opens the rationale in Prose, and the outcome held permanently visible in Ink `font-medium` `tabular-nums`. What a decision cost is the part the reader came for, so it never hides behind the disclosure.

### Wireframe Figure (signature)
A `<figure>` whose frame is a hairline and a Wash ground at `rounded-xl`, holding a `3/4` box with the screen `object-contain` and 16px of padding inside it. Below, a Subhead title and the screen's features as hairline-separated Footnote-size rows. No card, no lift, no tilt. Loading is a Wash pulse in the same box; a failed image states so in Quiet and offers a text retry link at a 44px target.

### Media Band Figure (signature)
The frame the Wireframe Figure uses, applied to shipped evidence: a 1px Hairline on a Wash ground at `rounded-xl` with 12px of padding (16px above `sm`), holding the asset at `rounded-lg`. The asset keeps its own proportions — a landscape screen runs the full measure at its native ratio, a portrait screen centres at `max-h-[80vh]` with the ground either side, and a video sits in the identical frame so the band does not alternate between framed and bare. `cover` is opt-in and reserved for photography, where a crop still leaves the subject. Below, an optional caption in Quiet at `max-w-[62ch]`. Clicking opens the same asset `object-contain` at `rounded-2xl`.

### Quote Panel (signature)
Someone else's words, in a hairline-bounded panel rather than a card: the quote in Ink at Lead size capped at `68ch` and wrapped in typographic quotation marks, the attribution below it with the name in Ink and the role in Quiet. Where several quotes sit together in a document, they stack as Terms List rows and are all readable at once. Where the surface is selling — one quote at a time with a pager — the arrows are 44px, the position reads `1 / 2` in Quiet `tabular-nums`, and each dot is an 8px mark inside a 44px target carrying `aria-current`. Advancing on a timer is off by default, stops on hover and focus, and never runs under `useReducedMotion`.

### Recommendations List (signature)
"Next" at the foot of a case study is a hairline list of links, not a card grid: the project name in Ink `font-medium` with an Edge underline and a small `ArrowRight` that shifts 2px on hover, its one-line description in Quiet in the second column at `minmax(0,22rem)_1fr`, and a final row linking to all case studies with the count stated. The page has already spent its imagery on the work itself.

### Scroll Rule (signature)
Two stacked 1px elements in the same track at the left edge (`left-0`) of the ruled argument block. The lower is static Hairline and always holds the structure. The upper is Ink and scales from `transformOrigin: top` on a single `useScroll` timeline bound to exactly the element the rail spans (`offset: ["start 0.85", "end 0.65"]`, spring `stiffness 80 / damping 30`), so the ink completes while the rail is still on screen. Both are `aria-hidden`. Under `useReducedMotion` the inked rail renders at full scale immediately. The construction is identical at every breakpoint; only its offset changes.

### Named Rules

**The One Crank Rule.** A surface gets at most one scroll-linked timeline, carried by one element in the left margin. The page is driven by a single crank the reader turns, not by a dozen independent reveals. The corollaries are removals the build now depends on: no floating reading-progress widget (it competed with the rail and named sections the page did not have), and no scroll-spy on the contents line (a per-frame listener for a decorative highlight, when native anchors already do the work that matters).

**The Order Is The Hierarchy Rule.** Where a component takes a list of actions, the first is the primary and the rest are secondary, decided by position rather than by a prop. A `variant` flag is a way to ship two primaries; an array index is not.

**The Departure Marking Rule.** A link that leaves the site says so twice: an `ArrowUpRight` for the eye and an `sr-only` "(opens in a new tab)" for everyone else, alongside `target="_blank"` and `rel="noopener noreferrer"`. Internal links get neither — the arrow means "leaving", so spending it on in-page navigation makes it meaningless.

**The Contents Threshold Rule.** The contents line appears only once a page renders six or more sections. Below that the nav costs more attention than the scroll it saves. Its items are built from the same labels the sections render, in render order, so adding a section to a page adds it to the nav or it does not appear at all.

**The Uncropped Screen Rule.** A UI screen shown as evidence is contained on a tinted ground, never cropped to fit a box. `object-contain` on a Wash ground with a hairline; `object-cover` is for photography and hero media, where the subject survives a crop. A wireframe sliced through the middle is not evidence of anything.

**The Static Understudy Rule.** Anything driven by scroll has a static counterpart underneath it that holds the structure at progress 0. A layout that only exists after scrolling is broken at the fold.

**The Visible At Zero Rule.** Entrance motion moves; it never hides. The media band's `hidden` state is `opacity: 1, y: 10` — the figure is fully painted before the observer fires and only settles 10px when it does. A `hidden` state at `opacity: 0` makes the content conditional on a script and a scroll position, and anyone whose scroll never reaches it sees a blank band.

**The True Figure First Rule.** Server-rendered HTML carries the real number and the real heading. A count-up arms only while its metric is still below the fold and is skipped entirely under reduced motion; a scrambled heading renders its true text first and scrambles only on hover. A figure already on screen never drops to zero to animate back.

**The One Home Link Rule.** The breadcrumb owns the home link. A trail handed to it starts at the section, so a page never ships two links to the same destination in one row.

## Do's and Don'ts

### Do:
- **Do** build hierarchy from weight and darkness within the zinc ramp — Quiet for the subordinate voice, Ink at `font-medium` for the assertion.
- **Do** open every section through the shared `SECTION` / `LABEL` / `ROW` constants, including sections a single page owns.
- **Do** give every section an `id` and inherit `scroll-mt-10` so an anchored jump lands with clearance.
- **Do** check that no text bounding box crosses a scroll-linked rule at any documented width before calling a surface finished.
- **Do** separate content with hairlines at the two established weights: Hairline for peers, full Ink/Paper contrast to open a section.
- **Do** set `tabular-nums` on every countable figure and preserve its source precision.
- **Do** use a real `<table>` with an `sr-only` caption and `scope` attributes when the content is genuinely tabulated, and right-align its numeric columns.
- **Do** cap reading measures in `ch` on the text element, independent of the container — especially on the wide case-study routes.
- **Do** change a route's measure in `RouteContainer` so header, content, and footer move together.
- **Do** size definition-list term columns to the term (14rem, 18rem, or 22rem) rather than to half the container.
- **Do** put the primary action first in the array and let the order carry the hierarchy.
- **Do** mark an outbound link with an arrow and an `sr-only` new-tab note.
- **Do** contain a UI screen on a tinted ground rather than cropping it.
- **Do** theme selection and caret from the palette on any surface you finish.
- **Do** hold a 44px minimum touch target on every control, including breadcrumb and contents-line links.

### Don't:
- **Don't** introduce a new hue for emphasis on an editorial surface; zinc plus weight is the whole vocabulary, focus rings included.
- **Don't** use a shadow to group or separate content — shadows belong to things that genuinely overlay the page.
- **Don't** make one line do two structural jobs; a rule that carries a timeline and a rule that separates columns are different elements in different places.
- **Don't** letterspace a small uppercase line above a heading; labels are sentence case at +0.02em and stand on their own.
- **Don't** communicate a provisional value through hover-only affordances or a dotted underline.
- **Don't** add a second scroll-linked element — no progress bar, no scroll-spy, no parallax — to a page that already runs the margin rail.
- **Don't** ship an entrance animation whose hidden state is invisible, or let an animated figure render zero in server HTML.
- **Don't** re-type section chrome inline on a page; import it, or the next rule weight will drift.
- **Don't** round the corners of text structures — ledgers, tables, definition lists, and the contents line are square.
- **Don't** show a tall UI screen cropped by `object-cover`.
- **Don't** repeat a destination the breadcrumb already links, or ship an in-page anchor list on a page short enough to scroll.
- **Don't** stack a second full-width capture form under a surface that already owns a primary action.
