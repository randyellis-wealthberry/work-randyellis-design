# Conversion analytics on Vercel Web Analytics

**Date:** 2026-08-27
**Status:** Approved design, not yet implemented
**Scope:** `lib/analytics.ts`, `components/performance/web-vitals.tsx`, `app/layout.tsx`, plus two new modules

## Problem

The site already sends data to Vercel Web Analytics. `<Analytics />` is mounted in
`app/layout.tsx:155` and `trackEvent` fans out to both Google Analytics and Vercel's
typed `track()`. The problem is not that analytics is missing. It is that the analytics
present cannot answer the one question the site exists to answer: **what convinces a
visitor to book.**

Four findings drive this design.

### 1. Conversion events have no attribution

`trackContactIntent("booking", BOOKING_URL)` fires from five distinct surfaces:

| Surface | Location |
| --- | --- |
| Home hero | `app/page.tsx:152` |
| Home secondary CTA | `app/page.tsx:358` |
| Services pricing | `app/services/services-client.tsx:263` |
| Shared CTA section | `components/ui/cta-section.tsx:43` |
| Case study footer | `components/case-study/case-study-template.tsx:734` |

All five emit an identical payload, because `contactValue` is the same `BOOKING_URL`
constant in every case. The data can report *that* bookings were clicked and never
*which surface earned them*. This is the highest-value defect in the current setup.

### 2. 37 of 50 tracking functions are dead

Only 13 of the 50 exports in `lib/analytics.ts` have any call site. The other 37 have
none. They are not merely unused — several are unusable, and several more would be
actively harmful if wired naively (see finding 4).

### 3. The web-vitals module is orphaned and broken

`components/performance/web-vitals.tsx` is never mounted. If it were, it would fail:

- It `fetch`es `POST /api/analytics/web-vitals`, **a route that does not exist**.
  `app/api/` contains only `cdn/`, `csp-report/`, and `newsletter/`.
- It calls `(window as any).va?.("track", ...)` — the untyped legacy escape hatch —
  bypassing the typed `track()` export and its validation entirely.
- Its `PerformanceMetrics` component attaches document-level listeners
  (`web-vitals.tsx:182`) that emit an analytics event on **every user interaction**.

### 4. Invalid properties are dropped silently in production

From `parseProperties` in the installed `@vercel/analytics@1.5.0`:

```js
const props = parseProperties(properties, { strip: isProduction() });
```

- **Production** (`strip: true`): a property whose value is a nested object is
  silently removed from the payload. No error, no warning.
- **Development** (`strip: false`): it throws, `track()` catches, and it becomes a
  `console.error` nobody is watching.

The 255-character limit on event names, keys, and values is **not checked client-side
at all** — it is enforced at Vercel's ingestion, invisibly to the app.

The local `createProperties` helper (`lib/analytics.ts:67`) only filters `undefined`
and `null`. It does not guard nested objects or length. So the app can lose analytics
data in production and never learn that it did.

## Constraints

The project is on the **Hobby** plan. From Vercel's published limits:

| Product | Hobby limit | Behavior at limit |
| --- | --- | --- |
| Web Analytics | 50,000 events / month | **Collection pauses** until the next billing cycle. Hobby cannot purchase additional capacity. |
| Speed Insights | 10,000 events / month, 7-day reporting window | — |

Pageviews and custom events draw from the same 50,000. Exhausting it does not degrade
gracefully; it blinds the site for the remainder of the month. This constraint, not
taste, is what governs which events may be emitted per session.

Custom event properties are additionally constrained: no nested objects, values limited
to string / number / boolean / null, and event names, keys, and values each capped at
255 characters.

## Goal

Organize the event vocabulary around **lead generation**: which surfaces precede a
booking click, and which do not. Content and engagement events are retained only where
they are plausible leading indicators of that outcome.

## Design

### Module layout

`lib/analytics.ts` remains the public surface. All 50 exports keep their present
signatures and all 13 existing call sites remain untouched. Two new modules sit behind
it:

- **`lib/analytics-events.ts`** — the typed catalog. Maps each event name to its
  permitted property keys. One source of truth for the vocabulary.
- **`lib/analytics-guard.ts`** — the enforcement boundary. Nested-object rejection,
  255-character truncation of names/keys/values, throttling and sampling, and event
  budget accounting.

`trackEvent` routes through the guard, so no call path can bypass validation. Because
every one of the 50 exports is implemented in terms of `trackEvent`, this single change
covers the entire surface.

A `lib/analytics/` **directory is deliberately not created.** It would sit beside the
existing `lib/analytics.ts`, making `@/lib/analytics` ambiguous to a human reader even
though module resolution defines a winner. Flat sibling filenames avoid the ambiguity.

### The guard

`lib/analytics-guard.ts` exposes one function used by `trackEvent`:

```ts
sanitize(name: string, props: Record<string, unknown>): {
  name: string;
  props: Record<string, string | number | boolean | null>;
  dropped: string[];
}
```

Rules, applied in order:

1. **Truncate** the event name to 255 characters.
2. **Reject nested objects.** Any value where `typeof value === "object" && value !== null`
   is removed and its key recorded in `dropped`. This replicates Vercel's production
   behavior explicitly rather than relying on its silent strip.
3. **Truncate** each key and each string value to 255 characters.
4. **Coerce** `undefined` to omission (preserving current `createProperties` behavior).
5. In development only, `console.warn` once per unique dropped key, so the data loss
   that production hides is visible while building.

Truncating rather than dropping over-length values is a deliberate choice: a truncated
surface name is still attributable, whereas a dropped one is indistinguishable from an
untracked click.

### Throttling and the event budget

`lib/analytics-guard.ts` also exposes:

```ts
throttled(key: string, windowMs: number): boolean   // true if the caller may emit
```

Backed by an in-memory `Map` keyed per page load. High-frequency trackers call it
before emitting. It is deliberately not persisted — a per-session ceiling is the goal,
not a per-visitor one.

Budget model, per session, for behavioral events:

| Class | Cap per session |
| --- | --- |
| Conversion events (booking, assistant, newsletter, resume) | Uncapped — these are the point |
| Navigation and content events | 1 per unique target |
| High-frequency events (scroll, hover, animation) | 1 per 30s window per event key |

At 50,000 events/month shared with pageviews, a site seeing 5,000 monthly pageviews has
roughly 45,000 events of headroom, or ~9 custom events per session. The caps above are
sized to stay inside that without sampling, which on low-traffic pages would otherwise
yield too few events per surface to be decision-useful.

### Attribution schema

Conversion events gain a required `surface` property naming the originating UI region:

```ts
trackContactIntent("booking", BOOKING_URL, "case_study_footer")
```

emitting:

```
contact_intent { method: "booking", surface: "case_study_footer", page: "/projects/foo" }
```

`surface` is typed as a union in `lib/analytics-events.ts`, so a typo fails the build
rather than silently creating a new bucket in the dashboard. `page` is derived from
`window.location.pathname` inside the guard — never passed by callers, so it cannot
drift.

The third parameter is optional in the type signature to keep the 13 existing call
sites compiling; each is then updated to pass its surface. Existing behavior is
preserved for any caller not yet updated.

### Speed Insights

Install `@vercel/speed-insights` and mount `<SpeedInsights />` alongside `<Analytics />`
in `app/layout.tsx`. On Hobby this yields 10,000 events/month against a 7-day window —
useful for spotting a regression, not for long-term trending. It draws from a separate
allowance and does not consume the 50,000 Web Analytics events.

### Rewiring web-vitals.tsx

The file is kept and repaired rather than deleted:

- Remove the `fetch` to the nonexistent `/api/analytics/web-vitals` route.
- Replace every `(window as any).va?.("track", ...)` with the typed `track()` import.
- Route `PerformanceMetrics`'s interaction listeners through `throttled()`.
- Leave both components unmounted. Speed Insights supersedes their Core Web Vitals
  role; the file becomes safe to mount for bespoke metrics rather than a landmine.

### Disposition of the 37 dead functions

Each group below was verified against the codebase for an actual surface to attach to.
Five functions initially assumed wireable were found to have none.

**Wire to real call sites (7).** A surface exists today and the event carries intent:

| Function | Surface |
| --- | --- |
| `trackProjectLiveDemo` | `link` field on project records in `lib/data/projects.ts` |
| `trackProjectGithub` | `githubLink` field, present on some projects |
| `trackExternalLink` | 12 files contain `target="_blank"` anchors |
| `trackRelatedArticleClick` | `components/ui/project-recommendations.tsx` |
| `trackRecommendationConversion` | same |
| `trackNewsletterSignup` | `components/ui/newsletter-signup.tsx` |
| `trackBlogPostView` | `app/blog/` |

**Keep exported, route through `throttled()` (7).** High-frequency by nature; wiring
them unthrottled is what would exhaust the monthly budget:
`trackScrollProgress`, `trackScrollDepth`, `trackParallaxScroll`, `trackMagneticHover`,
`trackAnimationInteraction`, `trackGlowEffectTrigger`, `trackReadingProgress`.

**Leave unwired, documented in-file (17).** No surface exists to fire them, or the
platform already covers the job:

`trackResumeDownload`, `trackTechnologyFilter`, `trackWorkExperienceExpand`,
`trackDownload`, `trackDemoInteraction`, `trackBlogCommentInteraction`,
`trackBlogSearchUsage`, `trackBlogHeroImageView`, `trackBlogReadingTime`,
`trackLocalBusinessView`, `trackMetaTagEngagement`, `trackMotionPreference`,
`trackPageLoadTime`, `trackPageView`, `trackSearchEngineReferral`, `trackSectionView`,
`trackStructuredDataView`.

Each receives a one-line comment naming what would have to exist for it to fire, so the
next person does not repeat this audit. Notable cases:

- `trackResumeDownload` — `public/randy-ellis-resume.pdf` **exists but is linked from
  nowhere.** See "Findings outside scope" below.
- `trackTechnologyFilter` — no filter UI exists on the projects page.
- `trackWorkExperienceExpand` — the `/about` experience list is not expandable.
- `trackDemoInteraction` — the only demo pages live under `app/admin/`, which is
  internal and not a conversion surface.
- `trackPageView` — superseded by `<Analytics />` automatic pageview collection.

**Unwireable, documented in-file (6).** PWA is disabled in `next.config.js`; no service
worker is generated, so nothing can fire these:
`trackPWAInstallSuccess`, `trackPWAEngagement`, `trackPWAPerformance`,
`trackOfflineUsage`, `trackServiceWorkerUpdate`, `trackPushNotificationPermission`.

Nothing is deleted. The four groups total 37 (7 + 7 + 17 + 6).

## Findings outside scope

Surfaced by this audit, deliberately **not** acted on in this design because each is a
product decision rather than an analytics one:

- **The resume PDF is unreachable.** `public/randy-ellis-resume.pdf` is shipped but no
  page links to it. For a site whose stated goal is lead generation, a resume download
  is a conversion surface currently worth zero. Adding the link is a content change; if
  it is made, `trackResumeDownload` is already written and moves to the wire group.
- **No projects filter.** `trackTechnologyFilter` anticipates a filtering UI that was
  never built.

## Testing

New unit tests for `lib/analytics-guard.ts`:

- truncates an event name longer than 255 characters
- truncates a property key and a string value longer than 255 characters
- removes a nested-object property and reports it in `dropped`
- preserves string, number, boolean, and null values unchanged
- `throttled()` returns `true` on first call and `false` within the window
- `throttled()` returns `true` again after the window elapses

New test for `lib/analytics-events.ts`:

- every event name and every property key in the catalog is at most 255 characters

Regression: the existing suite must stay green — 92 passing, 28 intentionally skipped.

## Explicitly out of scope

- Migrating off Google Analytics. `trackEvent` continues to dual-send.
- A server-side analytics route. The design removes the only caller of the
  nonexistent one rather than building it.
- Upgrading the Vercel plan. The design targets Hobby limits.
- Dashboards or the Web Analytics query API.
