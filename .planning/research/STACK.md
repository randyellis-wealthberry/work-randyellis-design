# Stack Research

**Domain:** Remediation milestone on a shipped Next.js 15 portfolio (metric-integrity regression testing, a projects filter/grouping UI, and OG image edits) — NOT a greenfield build
**Researched:** 2026-08-22
**Confidence:** HIGH (every claim below is either read directly from this repo's source files or verified against current Next.js docs via Context7)

## Bottom Line

**Zero new runtime or dev dependencies are needed for any of the three v3.0 capabilities.** Everything required — `fs`/`path` source-scanning in Jest, `@radix-ui/react-tabs`, `next/og`'s `ImageResponse`, the URL-driven category filter — is already installed and, in the filter case, already *built and wired*. The only "stack" work in this milestone is disciplined reuse of existing patterns plus editing existing files.

## Recommended Stack

### Core Technologies (already installed — reused as-is)

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Jest | ^30.0.5 (`jest.config.js` via `next/jest`) | Regression test for unbacked figures | This IS the repo's gate (`npm test`, step 3 of the verify order). `next/jest` compiles TS test files through SWC, so no `ts-jest`/typecheck dependency is needed even though `tsconfig.json` excludes `__tests__/` from `tsc --noEmit`. |
| Node `fs`/`path` (built-in) | Node runtime | Reading source files as raw text inside a Jest test | Already the mechanism behind `__tests__/seo/no-legacy-schema.test.ts` (`fs.readFileSync` + a recursive `collectSourceFiles` walker) and `__tests__/projects/projects-category-filter.test.tsx`'s "Projects Page Source Assertions" describe block. No package needed — `fs`/`path` are Node core. |
| `next/og` `ImageResponse` | Bundled with `next` 15.5.9 | Editing `app/opengraph-image.tsx` and `app/about/opengraph-image.tsx` | Already the API in use in both files (`import { ImageResponse } from "next/og"`). Confirmed via Context7 (`/vercel/next.js`) that `next/og` is the current, non-deprecated import path (the old `next/server` import was codemodded away years ago) and that `ImageResponse` vendors `@vercel/og`/`satori`/`resvg` **internally** — there is no separate `@vercel/og` package to install; `package.json` correctly has none. |
| `@radix-ui/react-tabs` (via `components/ui/tabs.tsx`) | ^1.1.12 (installed) | Available if the projects grouping UI needs true ARIA tablist semantics | Present in `package.json` and already wrapped in a shadcn-style component at `components/ui/tabs.tsx`. See "Projects filter" section below for why this is *available* but not necessarily the *right* primitive for this specific UI. |
| `?category=` URL filter (`lib/project-utils.ts` `filterProjectsByCategory`, `app/projects/projects-client.tsx`) | Already shipped (Phase 10, D-13) | Backing mechanism for any `/projects` grouping UI | Full working filter already exists: case-insensitive substring match across `name`, `category`, `categories[]`, `tags[]`, driven by `useSearchParams`, advertised to Google via a `WebSite` `SearchAction` JSON-LD (`urlTemplate: ${WEBSITE_URL}/projects?category={search_term_string}`). A "grouped entry point" is additive data + UI on top of this, not a new filtering system. |

### Supporting Libraries

None needed. `class-variance-authority`, `lucide-react`, `motion`, `tailwind-merge` — all already installed — are sufficient for any visual work on the filter UI or badges.

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint flat config (`eslint.config.mjs`) | `npm run lint` gate | Extends only `next/core-web-vitals`, `next/typescript`, `plugin:prettier/recommended`, `plugin:mdx/recommended` — no local-rule infrastructure (no `eslint-plugin-local-rules`, no `rulesDirPlugin`, no custom `rules/` folder). Standing up a custom ESLint rule for the metric-integrity check would require adding that infrastructure from scratch. See "Test approach" below for why this is the wrong tool regardless. |

## Installation

```bash
# Nothing to install for any of the three capabilities.
```

## Test Approach for the Unbacked-Figures Regression Test

**Recommendation: a Jest test under `__tests__/`, not an ESLint rule and not a standalone `scripts/` script.**

### Why Jest, not ESLint

- `npm run lint` runs `next lint` against `eslint.config.mjs`'s flat config. Adding a custom rule means either publishing/authoring a local ESLint plugin package or wiring `@typescript-eslint/utils`' rule-creation API plus a local rules directory — none of which exists in this repo today. That's new tooling for a check that has a zero-dependency precedent already proven twice (below).
- ESLint rules are AST-based and operate per-file; this check is fundamentally a *repo-wide* "does string X appear anywhere" query with per-string exemptions, which is what `fs.readFileSync` + `String.prototype.includes`/regex already does trivially in the precedent tests.

### Why Jest, not a standalone script

- A `scripts/*.js` file (there's real precedent — `scripts/analyze-performance.js`, `scripts/clean-vercel-deployments.js`) is not part of the verify chain (`lint` → `tsc --noEmit` → `test`) unless someone remembers to run it or wires it into `npm test`/CI/a pre-commit hook. This repo has **no Husky/pre-commit hooks installed** (checked: no `.husky/`, no `husky`/`lint-staged` in `package.json`, no custom hooks in `.git/hooks/`) — `npm run precommit` is a manually-invoked script, not an enforced gate. Placing the check in `__tests__/` means it runs every time `npm test` runs, with zero extra wiring, exactly like `no-legacy-schema.test.ts` already does.

### Why Jest works cleanly despite `tsconfig.json` excluding `__tests__/`

`jest.config.js` uses `nextJest({ dir: "./" })`, which transforms test files through Next's SWC pipeline, not `tsc`. Type errors inside `__tests__/` are invisible to `npx tsc --noEmit` (by design, per `tsconfig.json`'s `exclude`), but the test still runs and fails correctly under `npm test` — this is exactly the situation the two precedent tests already live in today. No new configuration needed.

### Precedent to model directly

Two files already do this exact shape of work — read them before writing the new test, do not design from scratch:

1. **`__tests__/seo/no-legacy-schema.test.ts`** (Phase 10-08) — the closest analog named in the brief. Its `collectSourceFiles([app, components, lib])` recursive walker (skips `node_modules`, `.next`, `out`, `.git`, `dist`; collects `.ts`/`.tsx`/`.mdx`) is directly reusable/copyable for the new test.
2. **`__tests__/projects/projects-category-filter.test.tsx`** — its second `describe` block, "Projects Page Source Assertions," does `fs.readFileSync(path.join(__dirname, "../../app/projects/page.tsx"), "utf-8")` and asserts `toContain`/`not.toContain` on the raw source. This is a smaller, page-scoped version of the same pattern and shows the house style for combining rendered-DOM assertions and raw-source assertions in one test file.

### The exact matching strategy — and why it must NOT be a bare-number scan

I verified directly (via repo-wide grep) that a blunt scan for the bare digits `2.5`, `50`, or `800` would produce **real false positives today**, not hypothetical ones:

- `800` alone collides with: `fontWeight: "800"` (five separate files — both OG generators, `app/icon.tsx`, `app/apple-icon.tsx`), `SWIPE_CLOSE_VELOCITY = 800` (`components/ui/global-mobile-menu.tsx`), `width={800}` image props, a Web Vitals TTFB budget (`ttfb: { budget: 800 }`), and raw SVG coordinates (`x="800"`, `x2="800"`).
- `50` alone collides with SVG `y1="50"`/`x="50"` coordinates in case-study diagrams, and `lib/data/projects.ts`'s LedgerIQ case study prose, which legitimately states `"$50,000 in prevented fraud losses"` — a real, backed, different figure.
- `2.5` alone collides with `height: 2.5` (hamburger button), `radius = 2.5` (WebGL scene), `2.5rem` CSS, Tailwind's `px-2.5`/`py-2.5`/`size-2.5` spacing utilities, SVG `r="2.5"`, and — most importantly — **`lib/data/projects.ts:1174: { label: "Weekly Downloads", value: "2.5K+" }`**, a legitimate, differently-scoped, backed metric that a bare-`2.5` scan would incorrectly flag.

**The safe pattern is to match the exact rendered/formatted string, not the bare number**, because every current occurrence of each unbacked figure is consistently formatted:

- SITE-01: the literal substring `"2.5M+"`
- SITE-03: the literal substring `"$50M"`
- SITE-04: the literal substring `"800+"`

I confirmed by grep that these three exact substrings appear ONLY in the flagged-unbacked contexts today — zero collisions anywhere else in the repo (unlike the bare digits above). For extra future-proofing against a number like `"1800+"` or `"$150M"` being introduced later and accidentally matching as a substring, use a regex with a non-digit lookbehind rather than `.includes()`, e.g. `/(?<!\d)800\+/`, `/(?<!\d)2\.5M\+/`, `/(?<!\$?\d)\$50M/` — Node's V8 has supported lookbehind since well before this repo's Node baseline, so this needs no new dependency either.

Do **not** design the test around `components/core/animated-number-basic.tsx:12-15` as the sole target. Grep confirms `AnimatedNumberBasic` is **dead code** — it is exported but imported nowhere in the app (`grep -rn "AnimatedNumberBasic"` returns only its own definition). The audit's cited line numbers point at this orphaned demo component, but the figures actually render today from two live, data-driven sources:

- `app/about/about-client.tsx`'s `achievements` array (lines ~19-38)
- `lib/data/retainer.ts`'s `PROOF_EXHIBITS` array (lines 47-51), rendered on the homepage via `app/page.tsx`

...and propagate as plain strings into **eight** confirmed files (wider than the six named in the prompt — the prompt's list undercounts):

| File | Line(s) | What's there |
|---|---|---|
| `components/core/animated-number-basic.tsx` | 12,14,15 | Dead code — orphaned demo component, not rendered anywhere |
| `app/about/about-client.tsx` | 21, 31, 36 | `achievements` array — SITE-01/03/04's live source |
| `lib/data/retainer.ts` | 48-50 | `PROOF_EXHIBITS` — SITE-01/03/04's other live source (homepage) |
| `app/opengraph-image.tsx` | 118, 143, 168 | Root OG image "Stats" row — **all three** figures, no backed figure alongside them |
| `app/about/opengraph-image.tsx` | 161, 212, 264 | About OG image — plus a **pre-existing separate bug**: line 238 still renders `"6"` for Design Awards, contradicting the shipped "4 named awards" decision (SITE-02/SITE-05, Backed). This is a live defect, not something the audit or prompt flagged — worth fixing in the same OG-image edit pass since the file is already open. |
| `app/about/page.tsx` | 10, 27 | `generateMetadata()` description strings |
| `app/services/page.tsx` | 10 | `generateMetadata()` description string |
| `lib/metadata.ts` | 25 | Base/site-wide metadata description |
| `components/seo/related-content.tsx` | 255 | A `description` string referencing "2.5M+ users" |
| `__tests__/integration/home-page-argument.test.tsx` | 62 | **Currently asserts these figures ARE present** — this test will break the moment SITE-01/03/04 are removed and must be updated in the same phase (drop `"2.5M+"`/`"$50M"`/`"800+"` from its array, keep `"4"`) |

The "4 Design Awards must survive" constraint: `"4"` (bare, from `achievements`/`PROOF_EXHIBITS`) and `"Design Awards"`/`"Design awards"` are Backed (SITE-02, deck slide 28) and must be excluded from the forbidden-string list. Because the recommended strategy matches the exact *unbacked* strings (`"2.5M+"`, `"$50M"`, `"800+"`) rather than any bare digit, `"4"` is never a match candidate — this is the structural reason the string-literal approach satisfies the constraint, not an exception that has to be special-cased.

## Projects Filter/Grouping UI (ENT-04)

**No new dependency.** The filtering *system* already exists and is already live-wired; only data (a shared category tag) and a small piece of UI are missing.

### What's already there

- **Type support:** `lib/data/types.ts` already has `categories?: string[]` (multi-category, additive to the legacy `category: string` field) — no schema change needed.
- **Data:** Echo (`lib/data/projects.ts:765`) already carries `categories: ["Mobile App", "UI/UX", "Web Dev"]`; Nagarro (`lib/data/projects.ts:953`) already carries `categories: ["Design Leadership", "Enterprise Strategy", "Accessibility"]`. ENT-04's "one grouped entry point for the regulated / field-operations work" is most directly implemented by **adding a shared tag** (e.g. `"Regulated"` or `"Field Operations"`) to both projects' `categories[]` arrays.
- **Filter logic:** `lib/project-utils.ts`'s `filterProjectsByCategory()` already does case-insensitive substring matching across `name`, `category`, `categories[]`, `tags[]`. Filtering by the new shared tag works with zero logic changes.
- **URL wiring:** `app/projects/projects-client.tsx` already reads `?category=` via `useSearchParams()`, already renders a "Showing N projects matching X · Clear filter" status line with a plain `<Link href="/projects">`.
- **SEO wiring:** the `WebSite` `SearchAction` schema (`lib/seo/json-ld.ts` ~line 108-111) already advertises `${WEBSITE_URL}/projects?category={search_term_string}` — a new grouped entry point that links to `/projects?category=Regulated` is additive and requires no schema change.
- **Second, unused helper:** `lib/data/projects.ts`'s `getProjectsByCategory()` (exact-match against `categories.includes()`/`category ===`) already exists too, currently used only for a dynamic-import code-split in `lib/data/index.ts`. Not needed for this UI, but confirms exact-match category grouping is an established pattern in this codebase, not a new concept being introduced.

### What to build (UI only, no package)

A small set of filter entry points (links or buttons) styled with the existing `Badge` (`components/ui/badge.tsx`, `class-variance-authority`-based) or plain `<Link>` classes already used for the "Clear filter" affordance. **Recommend plain `<Link href="/projects?category=Regulated">` elements over `components/ui/tabs.tsx`** (Radix `Tabs`): Radix Tabs manages client-side active-panel switching with ARIA `tablist`/`tabpanel` semantics for content that's simultaneously present in the DOM — it does not represent navigation state, isn't deep-linkable/shareable by default, and would fight against the URL-param-driven, server-shareable filter model this page already has (the whole point of `?category=` is that a filtered view is a real, bookmarkable, crawlable URL matching the `SearchAction` schema). A row of styled `<Link>`s (visually tab-like via `aria-current="page"` + Tailwind, if a tab *look* is wanted) reuses 100% of what's installed and stays consistent with the page's existing pattern. `@radix-ui/react-tabs` remains available (already installed) if a future page genuinely needs in-page panel switching without navigation — just not the right fit here.

## Editing the OG Image Generators (CRED-10/11/12)

**No new dependency; confirmed via Context7 (`/vercel/next.js`).** `ImageResponse` from `next/og` is bundled with Next.js core — `next/og` re-exports it internally from Vercel's own `@vercel/og`/`satori`/`resvg` stack, but none of those are (or need to be) direct `package.json` dependencies; `next` 15.5.9 alone is sufficient, matching what's already installed and already imported in both files.

### Constraints that apply when removing a figure

- `ImageResponse` only supports **a subset of CSS** — flexbox and absolute positioning, no CSS Grid, no arbitrary layout. Both existing generators already respect this (`display: "flex"` throughout, no `grid`), so editing within them (removing/adjusting a `<div>` block) stays inside supported territory as long as replacement layout code also stays flex-based.
- **Removing a stat block is a structural edit, not just a text delete, in the root OG image.** `app/opengraph-image.tsx`'s "Stats" row (`justifyContent: "space-around"`, three children) contains **only** the three unbacked figures (2.5M+, $50M, 800+) — there is no backed figure in that row to fall back to. Deleting all three leaves an empty flex container; the executor needs a real layout decision here (remove the row entirely and rebalance vertical spacing, or replace its contents with something backed — e.g., the "4 Design Awards" figure or nothing at all), not a mechanical three-line deletion.
- `app/about/opengraph-image.tsx`'s "Career Impact" stats card has three entries (2.5M+, **6** [sic — Backed count is 4, see defect note above], $50M) plus a fourth unbacked bullet in the left column ("Mentored 800+ Designers Globally"). After removing the two unbacked stat-card entries, only one entry remains — this card also needs a layout decision, and its stray "6" needs correcting to "4" in the same pass regardless of the unbacked-figure work, since it's a second, independent inaccuracy in the same file.
- `runtime = "edge"` is already set on both files and is unaffected by content edits — no runtime/config change needed.
- No shared OG-image helper/component exists (`app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `app/projects/opengraph-image.tsx` are each fully self-contained JSX); `app/projects/opengraph-image.tsx` was checked and does **not** carry any of the three unbacked figures, so it's out of scope for this specific remediation.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Jest `fs`-scanning test in `__tests__/` | Custom ESLint rule | If this project later needs a *general-purpose*, editor-time-visible class of "forbidden string" rules across many recurring cases — but a single one-off regression pinning three specific historical figures doesn't justify standing up local-rule infrastructure that doesn't exist yet. |
| Jest `fs`-scanning test | Standalone `scripts/*.js` + manual/CI wiring | If the check needs to run somewhere `npm test` doesn't reach (e.g., a pre-deploy CI step outside the Jest run) — not the case here; `npm test` already gates every verify pass per `CLAUDE.md`. |
| Plain `<Link>` filter entry points | `components/ui/tabs.tsx` (Radix `Tabs`) | If a future in-page UI needs simultaneous-DOM panel switching without navigation (e.g., toggling dense vs. compact project cards) rather than a shareable, crawlable filtered view. |
| Exact-substring/regex match on formatted figures (`"2.5M+"`, `"$50M"`, `"800+"`) | Bare-number regex (`/\b800\b/`, `/\b50\b/`, `/\b2\.5\b/`) | Never, for this check — proven above to false-positive on real, unrelated, currently-shipping code (CSS `font-weight`, SVG coordinates, Web Vitals budgets, a legitimate `"2.5K+"` metric). |

## What NOT to Add

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| `@vercel/og` as a direct dependency | Already vendored inside `next` 15.5.9's `next/og`; adding it as a direct dependency would duplicate/version-skew against what Next.js already ships and both existing generators already import correctly. | `import { ImageResponse } from "next/og"` (already the pattern in both files) |
| A new filter/tab UI library (headlessui, react-tabs, cmdk, etc.) | The filtering mechanism (state, URL sync, SEO schema) is fully built; only presentational links are missing, and `@radix-ui/react-tabs` is already installed if true tab semantics are ever needed. | `<Link href="/projects?category=...">` styled with existing `Badge`/Tailwind classes |
| Husky / lint-staged / a new pre-commit hook to run the metric-integrity check | No hook infrastructure exists in this repo today (verified: no `.husky/`, no `husky` or `lint-staged` in `package.json`, no custom `.git/hooks/`) and adding one is out of scope for a punch-list remediation milestone. | Put the check in `__tests__/`, where `npm test` already gates it |
| A custom ESLint rule/plugin package | No local-rule infrastructure exists in `eslint.config.mjs` (flat config extends only `next/core-web-vitals`, `next/typescript`, prettier, mdx); building it for one regression test is disproportionate. | Jest `fs`-scanning test, per precedent |
| `ts-jest` or enabling `tsc` on `__tests__/` | `next/jest` (already configured) compiles test files via SWC without needing `ts-jest`; changing `tsconfig.json`'s `exclude` to typecheck `__tests__/` is a separate, unrelated, and riskier change (would surface pre-existing type debt across the whole existing test suite) that this milestone doesn't need. | Existing `jest.config.js` setup as-is |

## Version Compatibility

| Package | Version (installed) | Notes |
|---------|---------------------|-------|
| `next` | 15.5.9 | Ships `next/og` (`ImageResponse`) — confirmed current, non-deprecated import path via Context7 `/vercel/next.js` docs. |
| `jest` | ^30.0.5 | Runs via `next/jest`; no interaction with `tsconfig.json`'s `__tests__/` exclusion — SWC transform, not `tsc`. |
| `@radix-ui/react-tabs` | ^1.1.12 | Already wrapped by `components/ui/tabs.tsx`; available but not recommended for the `/projects` grouping UI (see rationale above). |
| `react` / `react-dom` | ^19.0.0 | No interaction with any of these three capabilities beyond what's already running in `app/projects/projects-client.tsx` and the OG generators today. |

## Sources

- Direct repo inspection (Read/Bash/grep, this session): `package.json`, `jest.config.js`, `jest.setup.ts`, `tsconfig.json`, `eslint.config.mjs`, `components/core/animated-number-basic.tsx`, `__tests__/seo/no-legacy-schema.test.ts`, `__tests__/projects/projects-category-filter.test.tsx`, `app/opengraph-image.tsx`, `app/about/opengraph-image.tsx`, `app/projects/opengraph-image.tsx`, `app/projects/projects-client.tsx`, `lib/project-utils.ts`, `lib/data/types.ts`, `lib/data/projects.ts`, `components/ui/tabs.tsx`, `components/ui/badge.tsx`, `.planning/DECK-COVERAGE-AUDIT.md` (SITE-01/02/03/04/05 rows), `.planning/PROJECT.md`, `.planning/MILESTONES.md` — HIGH confidence, verified by reading the actual files, not recalled.
- Context7 `/vercel/next.js` (via `npx ctx7@latest`, MCP key was invalid so used the documented CLI fallback) — queried "ImageResponse from next/og... bundled or separate package, edge runtime constraints" and "ImageResponse JSX and CSS subset supported" — HIGH confidence, current docs, confirms `next/og` is the non-deprecated import and that only a CSS subset (flex/absolute positioning, no grid) is supported.
- Repo-wide `grep` sweeps (this session) for `800`, `50`, `2.5`, `2.5M`, `$50M`, `800+` across `app/`, `components/`, `lib/` — used to empirically prove the false-positive risk of bare-number matching and to confirm the exact-substring approach has zero current collisions. HIGH confidence — this is direct evidence, not inference.

---
*Stack research for: v3.0 Enterprise Credibility — metric-integrity regression test, projects filter/grouping UI, OG image edits*
*Researched: 2026-08-22*
