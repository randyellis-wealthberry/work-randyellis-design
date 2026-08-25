# Phase 11: Self-Consistency & Proof - Pattern Map

**Mapped:** 2026-08-22
**Files analyzed:** 3 modify targets + 1 new test file (+ 3 planning-doc verification targets, already applied)
**Analogs found:** 4 / 4

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|-----------------|---------------|
| `app/about/opengraph-image.tsx` (edit `:238`) | component (edge image generator) | transform (literal string edit) | itself — single-line literal fix, no external analog needed | exact (self-contained) |
| `app/about/about-client.tsx` (edit `:19-40`, `:455-469`) | component (client render) | transform (data array → JSX) | `lib/data/retainer.ts` + `app/page.tsx:164` / `app/services/services-client.tsx:188` (shape only, read-only) | role-match |
| `__tests__/<TBD>/award-count-consistency.test.ts` (new) | test | batch (fs walk + structural assertion) | `__tests__/seo/no-legacy-schema.test.ts` | exact |
| `.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/milestones/v2.0-MILESTONE-AUDIT.md` | config/docs | transform | n/a — **already corrected**, verify only | n/a |

Note: `app/about/opengraph-image.tsx` and `app/about/about-client.tsx` don't need an external "analog" in the traditional sense — they're the files being edited, and the correct source-of-truth for the *content* going into them is `lib/seo/json-ld.ts:79-84` (data) and `.planning/CREDIBILITY-COPY.md` §1 (copy), not another code file's pattern. The proof-band *shape* precedent (for context only, since D-08 forbids editing those files) is `app/page.tsx:164` and `app/services/services-client.tsx:188`.

---

## Pattern Assignments

### `app/about/opengraph-image.tsx` (edit only — CRED-13)

**Target:** single literal on the line that currently reads `6` (line 238 in the read below; verify exact line number hasn't drifted before editing).

**Exact surrounding block** (`app/about/opengraph-image.tsx:223-248`, read verbatim):
```tsx
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  color: "#60a5fa",
                }}
              >
                6
              </div>
              <div
                style={{
                  fontSize: "14px",
                  opacity: 0.8,
                }}
              >
                Design Awards
              </div>
            </div>
```

**Action:** change the bare `6` text node (currently the sole content of the `<div style={{ fontSize: "36px", ... color: "#60a5fa" }}>`) to `4`. Nothing else in this cell changes — label text, color, font size all stay. This is a pure one-character literal edit; no import changes, no new pattern needed. It is the D-02 standalone commit — do not bundle with PRF-01 or CRED-12 changes.

**Sanity check already run:** no other `6`-near-`award` string exists anywhere in `app/`, `components/`, `lib/` (grepped `6.*award|award.*6` case-insensitive, zero hits) — this is the only stray literal.

---

### `app/about/about-client.tsx` (edit — PRF-01)

**Analog for array shape:** `lib/data/retainer.ts:44-52` (`PROOF_EXHIBITS`) — same "value + context" record shape as `about-client.tsx`'s local `achievements` array, but `about-client.tsx`'s array additionally carries a `description` field that `PROOF_EXHIBITS` lacks. That third field is exactly PRF-01's edit surface.

**Current `achievements` array** (`app/about/about-client.tsx:14-40`, read verbatim):
```tsx
/**
 * The proof exhibits. No icons: the Proof Exhibit signature is a figure over a
 * context line, and a decorative glyph above each one adds nothing the number
 * does not already say.
 */
const achievements = [
  {
    value: "2.5M+",
    label: "Users impacted",
    description: "Across multiple products and platforms",
  },
  {
    value: "4",
    label: "Design awards",
    description: "Recognition for innovative design work",
  },
  {
    value: "$50M",
    label: "Product value",
    description: "Generated through strategic design decisions",
  },
  {
    value: "800+",
    label: "Designers mentored",
    description: "Growing the next generation of design talent",
  },
];
```

**D-06 constraint — the comment at lines 15-18 is load-bearing.** It states the anti-decorative-glyph design rule verbatim: *"No icons: the Proof Exhibit signature is a figure over a context line, and a decorative glyph above each one adds nothing the number does not already say."* Any award-list markup added inside the `4 / Design awards` cell's `description` slot must not introduce icons/emoji — this directly forbids using CREDIBILITY-COPY.md §1's 🥈🥈🥉🥉 medal emoji verbatim. Use its text content only.

**Current render** (`app/about/about-client.tsx:454-472`, read verbatim):
```tsx
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
          {achievements.map((achievement) => (
            <div key={achievement.label} className="flex flex-col">
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
                {achievement.value}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                {achievement.label}
                {/* Each figure's context differs, so it stays with its figure
                    rather than collapsing into one shared qualifier. */}
                <span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">
                  {achievement.description}
                </span>
              </dt>
            </div>
          ))}
        </dl>
```

**Edit target (D-04, D-05):** the `<span className="mt-1 block text-xs text-zinc-500 dark:text-zinc-400">{achievement.description}</span>` at lines 465-467, specifically for the `"Design awards"` cell only (the other three cells' `description` strings stay untouched — D-03 says all four cells stay). Because `.map()` renders `achievement.description` identically for all four cells, the planner has two structural options — both compatible with D-04/D-05, format is Claude's Discretion:
  1. Keep `achievements` as a flat array but make the `"Design awards"` entry's `description` a pre-formatted multi-line string/JSX fragment, and adjust the single shared `<span>` render to handle that one cell specially (e.g. conditionally render a `<ul>` for that cell only, or give that entry a `description` that is itself JSX instead of a string).
  2. Give the `"Design awards"` entry a fourth field (e.g. `awardsList: string[]`) and branch in the render on `achievement.label === "Design awards"` to render a compact `<ul>`/stacked-`<span>` list instead of the single description string.

Either way, the render currently assumes `achievement.description` is a single string interpolated directly into one `<span>` — that assumption must be relaxed for exactly one of the four cells, not all four (D-03: other three cells' single-line qualifiers are unchanged).

**Content source (verbatim, do not re-derive — from `.planning/CREDIBILITY-COPY.md` §1 lines 13-21, cross-checked against `lib/seo/json-ld.ts:79-84`):**

| Award | Issuer | Category |
|-------|--------|----------|
| Silver Award Winner | The Davey Awards | Mobile Apps / Social |
| Silver Award Winner | The Davey Awards | Mobile Apps / Lifestyle |
| 3rd Place — Best User Interface App/Experience | Vega Digital Awards | (GrowIt!) |
| 3rd Place — Best Lifestyle App | Vega Digital Awards | (GrowIt!) |

Webby Awards is a **judge credential**, not a win (D-07) — if included at all, it must be visually/structurally distinct from the four counted awards, never a fifth list item presented the same way.

**Source-of-truth data array to match against** — `lib/seo/json-ld.ts:79-84` (verbatim, already correct, PRF-01 must agree with this):
```typescript
    award: [
      "Silver Award, The Davey Awards — Mobile Apps/Social (GrowIt!)",
      "Silver Award, The Davey Awards — Mobile Apps/Lifestyle (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best User Interface App/Experience (GrowIt!)",
      "3rd Place, Vega Digital Awards — Best Lifestyle App (GrowIt!)",
    ],
```

**Reference-only (D-08 forbids editing these — shown for shape comparison so the planner does not accidentally propose touching them):**

`app/page.tsx:163-182` (verbatim):
```tsx
      <Section id="proof" label="What the work has been worth">
        <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
          {PROOF_EXHIBITS.map((exhibit) => (
            <div key={exhibit.context} className="flex flex-col">
              {/* The true figure ships in the HTML. The old band counted up
                  from zero on a metric that was on screen at load. */}
              <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
                {exhibit.value}
              </dd>
              <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                {exhibit.context}
              </dt>
            </div>
          ))}
        </dl>
        <p className="mt-8 max-w-[62ch] text-xs text-zinc-500 dark:text-zinc-400">
          Every figure above is career to date, across roles at Nagarro,
          Chameleon Collective, and Wealthberry Labs.
        </p>
      </Section>
```

`app/services/services-client.tsx:188-204` (verbatim) — identical shape, but each `dd` wraps the value in `AnimatedMetricValue` (counts up from zero), and the same footnote sentence repeats:
```tsx
            <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
              {PROOF_EXHIBITS.map((exhibit) => (
                <div key={exhibit.context} className="flex flex-col">
                  <dd className="text-3xl font-semibold tracking-[-0.03em] text-zinc-900 tabular-nums sm:text-4xl dark:text-white">
                    <AnimatedMetricValue value={exhibit.value} />
                  </dd>
                  <dt className="mt-3 text-sm leading-snug text-zinc-700 dark:text-zinc-300">
                    {exhibit.context}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-xs text-zinc-500 dark:text-zinc-400">
              Every figure above is career to date, across roles at Nagarro,
              Chameleon Collective, and Wealthberry Labs.
            </p>
```

Both of these read `PROOF_EXHIBITS` from `lib/data/retainer.ts:44-52` (two fields: `value`, `context` — no `description`), which is why they *cannot* carry a per-cell award list today without their own edit — out of scope this phase (D-08), logged as MI-4 for a future consolidation.

---

### New test file (CRED-12) — award-count consistency

**Analog:** `__tests__/seo/no-legacy-schema.test.ts` (full file read, 198 lines — reproduced pattern below).

**Directory precedent:** `__tests__/seo/` holds 10 files, all `.test.ts` or `.test.tsx`, kebab-case names describing the invariant being pinned (e.g. `no-legacy-schema.test.ts`, `sw-kill-switch.test.ts`, `robots.test.ts`). No `__tests__/credibility/` directory currently exists. Both options named in CONTEXT.md's Claude's Discretion are viable; `__tests__/seo/` is the lower-friction choice since it is literally where the walker precedent lives and where JSON-LD/OG-image correctness is already tested (`json-ld.test.tsx`, `blog-post-json-ld.test.tsx` are siblings). Suggested name: `__tests__/seo/award-count-consistency.test.ts` (or `__tests__/credibility/award-count-consistency.test.ts` if the planner prefers topical separation — either satisfies D-13's reuse requirement).

**Imports pattern** (`__tests__/seo/no-legacy-schema.test.ts:11-12`):
```typescript
import fs from "fs";
import path from "path";
```
No testing-library/jest-dom needed — this is a pure fs/string-matching test, no component render.

**The `collectSourceFiles` walker to reuse verbatim** (`__tests__/seo/no-legacy-schema.test.ts:157-197`):
```typescript
/**
 * Recursively collect all .ts/.tsx/.mdx source files from given directories,
 * excluding node_modules, .next, and other build artifacts.
 */
function collectSourceFiles(dirs: string[]): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      // Skip build artifacts and dependencies
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === "out" ||
        entry.name === ".git" ||
        entry.name === "dist"
      ) {
        continue;
      }

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (
        entry.isFile() &&
        /\.(ts|tsx|mdx)$/.test(entry.name) &&
        !entry.name.endsWith(".d.ts")
      ) {
        files.push(fullPath);
      }
    }
  }

  dirs.forEach((dir) => walk(dir));
  return files;
}
```

**Confirmed (D-13 verification):** the walker takes an explicit **root list**, not a full-tree scan — every existing caller passes exactly `[path.join(process.cwd(), "app"), path.join(process.cwd(), "components"), path.join(process.cwd(), "lib")]` (see lines 41-45, 69-73, 112-116, 134-138). Because `.planning/` and root `*.md` files are never included as roots, they are excluded **by construction**, not by an explicit skip-list entry — the audit record (`.planning/PROJECT.md`, `.planning/MILESTONES.md`, `.planning/milestones/v2.0-MILESTONE-AUDIT.md`) is structurally out of the walker's reach regardless of what it finds inside. CRED-12's new test should call `collectSourceFiles` with the same `["app", "components", "lib"]` root set (or a narrower subset if the planner wants to scope tighter — e.g. just `["app", "lib"]` since that's where every real award-count surface lives).

**Call-site pattern for a structural (not bare-string) assertion** — model on Test 2's shape (`no-legacy-schema.test.ts:33-65`), which already demonstrates "read every file, regex-match a structural pattern, collect violations, assert empty array" — the exact shape D-11/D-12 require:
```typescript
  describe("Test 2: No forbidden schema @type values in app/components/lib (D-08)", () => {
    const forbiddenTypes = [
      "LocalBusiness",
      "FAQPage",
      "ProfessionalService",
      "Organization",
    ];

    const sourceFiles = collectSourceFiles([
      path.join(process.cwd(), "app"),
      path.join(process.cwd(), "components"),
      path.join(process.cwd(), "lib"),
    ]);

    forbiddenTypes.forEach((forbiddenType) => {
      it(`no file contains "@type": "${forbiddenType}"`, () => {
        const violations: string[] = [];

        sourceFiles.forEach((file) => {
          const content = fs.readFileSync(file, "utf-8");
          const jsonRegex = new RegExp(`"@type":\\s*"${forbiddenType}"`, "g");
          const tsRegex = new RegExp(`@type:\\s*"${forbiddenType}"`, "g");

          if (jsonRegex.test(content) || tsRegex.test(content)) {
            violations.push(file);
          }
        });

        expect(violations).toEqual([]);
      });
    });
  });
```

**D-12's structural-not-string-match requirement — concrete guidance:** the walker+regex pattern above is fine for *detecting forbidden strings*, but CRED-12 is the opposite shape — it must assert a **positive count**, extracted from each surface's actual data shape, not grep for the digit `"4"` (which collides with `grid-cols-4`, `h-4 w-4`, `sm:grid-cols-4`, etc. — all present in the exact files under test, per the render blocks read above). Concretely, per surface:
- `lib/seo/json-ld.ts` — import `buildPersonSchema` (exported at line 41) directly and assert `buildPersonSchema().award` is an array of length 4. This is a real import, not a file-content regex — the strongest structural check available, and it's already exported for this purpose.
- `lib/data/retainer.ts` — import `PROOF_EXHIBITS` (exported at line 44) directly and assert `PROOF_EXHIBITS.find(e => e.context === "Design awards won").value === "4"` (or equivalent structural lookup by the `context` field, not by array index).
- `app/about/about-client.tsx` — `achievements` is a local (non-exported) `const` inside a `"use client"` component, so it cannot be imported directly the way `PROOF_EXHIBITS`/`buildPersonSchema` can. The test must instead read the file's source text (`fs.readFileSync`) and apply a targeted regex scoped to the awards object, e.g. matching `value:\s*"4"` in the same object literal that also contains `label:\s*"Design awards"` — anchor the regex to the *object*, not a bare digit anywhere in the file. A safe approach: extract the substring between `label: "Design awards"` and the next `},` and assert it contains `value: "4"` — this avoids colliding with `grid-cols-4`/`h-4 w-4` elsewhere in the same file.
- `app/about/opengraph-image.tsx` — pure JSX-in-edge-function with no exported data; same file-read + targeted-regex approach as above, anchored to the block containing `Design Awards` (the label div immediately follows the value div in source order — see the read excerpt above), asserting the preceding value div's text node is `4` not `6`.
- `app/about/page.tsx` (newly discovered sixth surface, see "Also determine and report" below) — `metadata.openGraph.description` is an exported `Metadata` object; import it or regex it for the substring `"4 awards won"` — already correct today, include it in the surface set so a future drift is caught too.

**No error-handling/validation pattern needed** — this is a fs-read + assertion test, not a request-handling code path. No auth pattern applies (test file, not app code).

---

## Shared Patterns

### fs/path source-scanning convention
**Source:** `__tests__/seo/no-legacy-schema.test.ts:11-12, 157-197`
**Apply to:** the new CRED-12 test file — reuse `collectSourceFiles` verbatim (copy the function, do not import it — no test currently exports/shares test helpers across files in this repo; each SEO test file duplicates or defines its own walker inline, consistent with `no-legacy-schema.test.ts` being self-contained).

### Proof-band JSX shape (read-only reference — do not edit these two files this phase)
**Source:** `app/page.tsx:164`, `app/services/services-client.tsx:188`
**Apply to:** nothing this phase (D-08). Referenced only so the planner recognizes the `dl.grid.grid-cols-2.sm:grid-cols-4` shape is intentionally repeated three times (home, services, about) and about-client.tsx's version is the one with the extra `description` span — the PRF-01 edit surface.

### Design-voice comment convention (no decorative icons)
**Source:** `app/about/about-client.tsx:15-18`
**Apply to:** any new markup inside the `achievements` "Design awards" cell — carry the same rule forward; do not introduce emoji/icons even though `CREDIBILITY-COPY.md` §1's draft block uses them.

---

## Also Determined (surface-completeness findings for CRED-12)

**Full grep-verified surface list that mentions "award" in `app/`, `components/`, `lib/`:**

| File | Line(s) | States a count? | In scope this phase? |
|------|---------|------------------|------------------------|
| `app/about/opengraph-image.tsx` | 238 | `6` (wrong) → fix to `4` | Yes — CRED-13 |
| `app/about/about-client.tsx` | 26 | `"4"` (correct) | Yes — PRF-01 edits the same cell's description slot |
| `lib/data/retainer.ts` | 51 | `"4"` (correct) | Read-only this phase (D-08); CRED-12 should still assert against it since it's a real surface |
| `lib/seo/json-ld.ts` | 79-84 | 4-entry array (correct) | Read-only, source of truth |
| `app/about/page.tsx` | 27 | `"4 awards won"` in `openGraph.description` metadata string (correct) | **Not named in ROADMAP/CONTEXT — newly identified 6th surface.** Already correct; recommend CRED-12 include it in the consistency set so future drift is caught, but no edit needed now |
| `app/opengraph-image.tsx` (root OG) | — | **No awards cell at all** — stats row has exactly 3 cells (`2.5M+`, `$50M`, `800+`), confirmed by full-file read | Confirmed out of scope (matches CONTEXT.md's note); CRED-12 should NOT assert an award count here since none exists — asserting absence-of-a-wrong-number is not the same as asserting the surface is silent by design, so no test claim needed for this file |
| `components/core/animated-number-basic.tsx` | 71 | `"Design Awards"` label; numeric value driven by `useState(0)` + client-side animation, no literal digit in source | **Confirmed dead code** — zero imports found anywhere in the codebase (`grep -rn "animated-number-basic"` returns no import matches). Per CONTEXT.md's explicit instruction, do not map to this file; exclude from CRED-12's surface set (it renders nothing, so it can't disagree with anything) |
| `components/ui/reading-progress.tsx` | 5, 18 | False positive — `Award` is a `lucide-react` icon import used for an unrelated progress-milestone label, not a design-award count | Exclude — not a credibility surface |

**Net: the true "surface set" CRED-12 should assert over is 5 files, not the 4 named in ROADMAP** (`opengraph-image.tsx`, `about-client.tsx`, `retainer.ts`, `json-ld.ts`, plus the newly found `app/about/page.tsx` metadata description). The planner should decide whether to include the 5th (`app/about/page.tsx`) — it costs nothing since it's already correct, and D-11 says "every surface that states it."

## No Analog Found

None — all four in-scope files (3 edits + 1 new test) have a strong analog or, in the OG-image case, need no analog beyond the literal they're editing.

## Metadata

**Analog search scope:** `app/`, `components/`, `lib/`, `__tests__/`, `.planning/` (read-only, for REC-01 verification only)
**Files read in full or targeted:** `__tests__/seo/no-legacy-schema.test.ts` (full, 198 lines), `app/about/about-client.tsx` (targeted: 1-50, 440-480), `lib/seo/json-ld.ts` (targeted: 1-100), `lib/data/retainer.ts` (full, 53 lines), `app/about/opengraph-image.tsx` (targeted: 190-260), `app/page.tsx` (targeted: 150-190), `app/services/services-client.tsx` (targeted: 175-215), `app/opengraph-image.tsx` (full, 201 lines), `app/about/page.tsx` (targeted: 1-45), `components/core/animated-number-basic.tsx` (targeted: 50-80), `.planning/CREDIBILITY-COPY.md` (targeted: §1), `.planning/PROJECT.md` / `.planning/MILESTONES.md` / `.planning/milestones/v2.0-MILESTONE-AUDIT.md` (grep-verified, REC-01 already applied)
**Pattern extraction date:** 2026-08-22
