# Analytics Guard and Attribution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every analytics event pass through one validating, throttling boundary, and give booking conversions the surface attribution they currently lack.

**Architecture:** `lib/analytics.ts` stays the public surface with all 50 exports and all existing call sites intact. Two new sibling modules sit behind it: `lib/analytics-events.ts` (typed vocabulary) and `lib/analytics-guard.ts` (validation, truncation, throttling). `trackEvent` is the single chokepoint every export already routes through, so changing it covers the whole surface at once.

**Tech Stack:** TypeScript, Next.js 15 App Router, `@vercel/analytics@1.5.0`, `@vercel/speed-insights` (to be added), Jest + React Testing Library.

**Spec:** `docs/superpowers/specs/2026-08-27-analytics-conversion-strategy-design.md`

## Global Constraints

- **Vercel plan is Hobby.** Web Analytics allows **50,000 events/month** shared between pageviews and custom events; on exhaustion collection **pauses until the next billing cycle** and cannot be topped up. Speed Insights allows **10,000 events/month** with a **7-day** reporting window.
- **Vercel custom-event limits:** no nested objects; values must be string, number, boolean, or null; event names, property keys, and property values are each capped at **255 characters**.
- **Nothing in `lib/analytics.ts` may be deleted.** All 50 exports keep their present names and signatures. New parameters must be optional.
- **`page` is added only to conversion events.** 31 existing assertions in `__tests__/lib/analytics-{blog,motion,pwa,seo}.test.ts` use exact-payload `toHaveBeenCalledWith` on `mockTrack`. Adding `page` to non-conversion events breaks all of them.
- **Do not create a `lib/analytics/` directory.** It would sit beside `lib/analytics.ts` and make `@/lib/analytics` ambiguous to read. Use flat sibling filenames.
- Verify with `npm run lint`, then `npx tsc --noEmit`, then `npm test`. `npm run build` is **not** a validation step — the config ignores type and lint errors.
- Baseline is **92 suites passing, 28 intentionally skipped**. Any other failure is a regression you introduced.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `lib/analytics-guard.ts` (create) | Pure enforcement: truncation, nested-object rejection, throttle bookkeeping, current-page derivation. No knowledge of specific events. |
| `lib/analytics-events.ts` (create) | The vocabulary: which surfaces exist, which events count as conversions, throttle window constant. No behavior. |
| `lib/analytics.ts` (modify) | Unchanged public API. `trackEvent` now composes the two modules above. |
| `app/layout.tsx` (modify) | Mounts `<SpeedInsights />` beside the existing `<Analytics />`. |
| `components/performance/web-vitals.tsx` (modify) | Repaired: typed `track()` instead of `(window as any).va`, dead `fetch` removed, listeners throttled. |
| `__tests__/lib/analytics-guard.test.ts` (create) | Unit tests for the guard. |
| `__tests__/lib/analytics-events.test.ts` (create) | Catalog invariants. |
| `__tests__/ui/lets-chat-dialog.test.tsx` (modify) | Two assertions updated for the new `surface` argument. |

---

### Task 1: The guard module

**Files:**
- Create: `lib/analytics-guard.ts`
- Test: `__tests__/lib/analytics-guard.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `MAX_LEN: 255`
  - `type SafeValue = string | number | boolean | null`
  - `interface SanitizeResult { name: string; props: Record<string, SafeValue>; dropped: string[] }`
  - `sanitize(name: string, props: Record<string, unknown>): SanitizeResult`
  - `throttled(key: string, windowMs: number): boolean` — returns `true` when the caller **may** emit
  - `resetThrottle(): void` — test helper, clears the in-memory map
  - `currentPage(): string | null` — `window.location.pathname`, or `null` on the server

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/analytics-guard.test.ts`:

```ts
import {
  sanitize,
  throttled,
  resetThrottle,
  currentPage,
  MAX_LEN,
} from "@/lib/analytics-guard";

describe("sanitize", () => {
  it("passes valid scalar values through untouched", () => {
    const result = sanitize("my_event", {
      category: "engagement",
      count: 3,
      flag: true,
      empty: null,
    });

    expect(result.name).toBe("my_event");
    expect(result.props).toEqual({
      category: "engagement",
      count: 3,
      flag: true,
      empty: null,
    });
    expect(result.dropped).toEqual([]);
  });

  it("truncates an over-length event name to 255 characters", () => {
    const result = sanitize("a".repeat(300), {});

    expect(result.name).toHaveLength(MAX_LEN);
  });

  it("truncates an over-length key and string value", () => {
    const longKey = "k".repeat(300);
    const result = sanitize("e", { [longKey]: "v".repeat(300) });

    const [key] = Object.keys(result.props);
    expect(key).toHaveLength(MAX_LEN);
    expect(result.props[key]).toHaveLength(MAX_LEN);
  });

  it("removes nested objects and reports them as dropped", () => {
    const result = sanitize("e", { good: "yes", bad: { nested: 1 } });

    expect(result.props).toEqual({ good: "yes" });
    expect(result.dropped).toEqual(["bad"]);
  });

  it("treats arrays as nested objects and drops them", () => {
    const result = sanitize("e", { list: [1, 2, 3] });

    expect(result.props).toEqual({});
    expect(result.dropped).toEqual(["list"]);
  });

  it("omits undefined values without reporting them as dropped", () => {
    const result = sanitize("e", { present: "x", missing: undefined });

    expect(result.props).toEqual({ present: "x" });
    expect(result.dropped).toEqual([]);
  });

  it("preserves null, which Vercel accepts", () => {
    const result = sanitize("e", { cleared: null });

    expect(result.props).toEqual({ cleared: null });
    expect(result.dropped).toEqual([]);
  });
});

describe("throttled", () => {
  beforeEach(() => {
    resetThrottle();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows the first call for a key", () => {
    expect(throttled("scroll", 30_000)).toBe(true);
  });

  it("blocks a repeat call inside the window", () => {
    throttled("scroll", 30_000);

    expect(throttled("scroll", 30_000)).toBe(false);
  });

  it("allows again once the window has elapsed", () => {
    throttled("scroll", 30_000);
    jest.advanceTimersByTime(30_001);

    expect(throttled("scroll", 30_000)).toBe(true);
  });

  it("tracks each key independently", () => {
    throttled("scroll", 30_000);

    expect(throttled("hover", 30_000)).toBe(true);
  });
});

describe("currentPage", () => {
  it("returns the pathname in a browser environment", () => {
    expect(currentPage()).toBe(window.location.pathname);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/lib/analytics-guard.test.ts`
Expected: FAIL — `Cannot find module '@/lib/analytics-guard'`

- [ ] **Step 3: Write the implementation**

Create `lib/analytics-guard.ts`:

```ts
/**
 * The single enforcement boundary for analytics events.
 *
 * Vercel silently strips invalid properties in production (`strip: isProduction()`
 * inside the SDK's `parseProperties`) and only throws in development, where the
 * error becomes a console message nobody reads. Rather than depend on that silent
 * behavior, every event is validated here first, so what we send is what we meant.
 */

export const MAX_LEN = 255;

export type SafeValue = string | number | boolean | null;

export interface SanitizeResult {
  name: string;
  props: Record<string, SafeValue>;
  dropped: string[];
}

const truncate = (value: string): string =>
  value.length > MAX_LEN ? value.slice(0, MAX_LEN) : value;

// Warn once per key per page load. A dropped property is usually a coding
// mistake that repeats on every emit; logging it each time buries it.
const warned = new Set<string>();

export function sanitize(
  name: string,
  props: Record<string, unknown>,
): SanitizeResult {
  const safe: Record<string, SafeValue> = {};
  const dropped: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    // undefined is an omission, not a failure — it is how optional
    // parameters arrive. It is deliberately not reported as dropped.
    if (value === undefined) continue;

    // Arrays are typeof "object" too, and Vercel rejects them the same way.
    if (typeof value === "object" && value !== null) {
      dropped.push(key);
      if (process.env.NODE_ENV !== "production" && !warned.has(key)) {
        warned.add(key);
        console.warn(
          `[analytics] Dropped "${key}" from event "${name}": Vercel accepts only strings, numbers, booleans, and null.`,
        );
      }
      continue;
    }

    const safeKey = truncate(key);
    // Truncating beats dropping: a shortened surface name is still
    // attributable, while a missing one looks like an untracked click.
    safe[safeKey] = typeof value === "string" ? truncate(value) : (value as SafeValue);
  }

  return { name: truncate(name), props: safe, dropped };
}

const lastEmitted = new Map<string, number>();

/** Returns true when the caller may emit. In-memory, so it resets per page load. */
export function throttled(key: string, windowMs: number): boolean {
  const now = Date.now();
  const previous = lastEmitted.get(key);

  if (previous !== undefined && now - previous < windowMs) return false;

  lastEmitted.set(key, now);
  return true;
}

/** Test helper. Clears throttle state between cases. */
export function resetThrottle(): void {
  lastEmitted.clear();
  warned.clear();
}

/** Derived here, never passed by callers, so it cannot drift from reality. */
export function currentPage(): string | null {
  if (typeof window === "undefined") return null;
  return window.location.pathname;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/lib/analytics-guard.test.ts`
Expected: PASS, 12 tests.

- [ ] **Step 5: Verify types and lint**

Run: `npm run lint && npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add lib/analytics-guard.ts __tests__/lib/analytics-guard.test.ts
git commit -m "feat(analytics): add the event validation and throttle boundary"
```

---

### Task 2: The event catalog

**Files:**
- Create: `lib/analytics-events.ts`
- Test: `__tests__/lib/analytics-events.test.ts`

**Interfaces:**
- Consumes: `MAX_LEN` from `lib/analytics-guard.ts`.
- Produces:
  - `type ConversionSurface` — union of surface identifiers
  - `CONVERSION_EVENTS: ReadonlySet<string>` — event names that receive `page`
  - `HIGH_FREQUENCY_WINDOW_MS: 30_000`

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/analytics-events.test.ts`:

```ts
import {
  CONVERSION_EVENTS,
  CONVERSION_SURFACES,
  HIGH_FREQUENCY_WINDOW_MS,
} from "@/lib/analytics-events";
import { MAX_LEN } from "@/lib/analytics-guard";

describe("the event catalog", () => {
  it("keeps every conversion event name inside Vercel's 255-character cap", () => {
    for (const name of CONVERSION_EVENTS) {
      expect(name.length).toBeLessThanOrEqual(MAX_LEN);
    }
  });

  it("keeps every surface identifier inside the cap", () => {
    for (const surface of CONVERSION_SURFACES) {
      expect(surface.length).toBeLessThanOrEqual(MAX_LEN);
    }
  });

  it("treats contact_intent as a conversion, since it is the booking signal", () => {
    expect(CONVERSION_EVENTS.has("contact_intent")).toBe(true);
  });

  it("does not treat decorative events as conversions", () => {
    // These carry no intent and must not receive the `page` property,
    // which would break the existing exact-payload assertions.
    expect(CONVERSION_EVENTS.has("pwa_install_success")).toBe(false);
    expect(CONVERSION_EVENTS.has("scroll_progress")).toBe(false);
  });

  it("uses a throttle window long enough to bound per-session cost", () => {
    expect(HIGH_FREQUENCY_WINDOW_MS).toBe(30_000);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/lib/analytics-events.test.ts`
Expected: FAIL — `Cannot find module '@/lib/analytics-events'`

- [ ] **Step 3: Write the implementation**

Create `lib/analytics-events.ts`:

```ts
/**
 * The analytics vocabulary. Behavior lives in `analytics-guard.ts`; this file
 * only says what may be named.
 */

/**
 * Every UI region that can originate a conversion. Typed as a union so a typo
 * fails the build instead of quietly opening a new bucket in the dashboard.
 */
export const CONVERSION_SURFACES = [
  "home_hero",
  "home_secondary_cta",
  "services_pricing",
  "shared_cta_section",
  "case_study_footer",
  "chat_dialog",
  "coffee_link",
] as const;

export type ConversionSurface = (typeof CONVERSION_SURFACES)[number];

/**
 * Events that receive a derived `page` property.
 *
 * Deliberately narrow. 31 assertions across the existing analytics suites match
 * event payloads exactly, so adding `page` to a non-conversion event breaks them
 * — and would spend event budget on data that answers no question.
 */
export const CONVERSION_EVENTS: ReadonlySet<string> = new Set([
  "contact_intent",
  "newsletter_signup",
  "newsletter_attempt",
  "resume_download",
  "recommendation_conversion",
]);

/**
 * Throttle window for scroll, hover, and animation events. At 50,000 events per
 * month shared with pageviews, unthrottled per-scroll tracking exhausts the
 * Hobby allowance in days, after which collection stops for the rest of the cycle.
 */
export const HIGH_FREQUENCY_WINDOW_MS = 30_000;
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/lib/analytics-events.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add lib/analytics-events.ts __tests__/lib/analytics-events.test.ts
git commit -m "feat(analytics): add the typed event and surface catalog"
```

---

### Task 3: Route trackEvent through the guard

**Files:**
- Modify: `lib/analytics.ts:5-32` (the `trackEvent` body)
- Create: `__tests__/lib/analytics-attribution.test.ts`
- Test: existing `__tests__/lib/analytics-{blog,motion,pwa,seo}.test.ts` must stay green

**Interfaces:**
- Consumes: `sanitize`, `currentPage` from `lib/analytics-guard.ts`; `CONVERSION_EVENTS` from `lib/analytics-events.ts`.
- Produces: no signature change. `trackEvent(action, category, label?, value?, properties?)` is unchanged for all 50 callers.

**Why this is the only change needed:** every one of the 50 exports is implemented in terms of `trackEvent`, so validating here covers the entire surface.

- [ ] **Step 1: Write the failing test**

Create `__tests__/lib/analytics-attribution.test.ts`. This is a **separate file**, not an
addition to the guard suite: it must mock `@vercel/analytics` at the top level, and mixing
`jest.doMock` with the static imports already in `analytics-guard.test.ts` is unreliable.
The structure below matches the pattern the existing analytics suites already use.

```ts
// Mock Vercel Analytics before the module under test imports it.
const mockTrack = jest.fn();
jest.mock("@vercel/analytics", () => ({
  track: mockTrack,
}));

const mockGtag = jest.fn();
Object.defineProperty(window, "gtag", {
  value: mockGtag,
  writable: true,
});

describe("trackEvent integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrack.mockClear();
  });

  it("attaches page to a conversion event", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("contact_intent", "professional_interest", "booking");

    expect(mockTrack).toHaveBeenCalledWith(
      "contact_intent",
      expect.objectContaining({ page: window.location.pathname }),
    );
  });

  it("does not attach page to a non-conversion event", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("pwa_install_success", "pwa_engagement", "accepted");

    const [, props] = mockTrack.mock.calls[0];
    expect(props).not.toHaveProperty("page");
  });

  it("strips a nested property before it reaches Vercel", () => {
    const { trackEvent } = require("../../lib/analytics");

    trackEvent("some_event", "cat", undefined, undefined, {
      ok: "yes",
      // Deliberately invalid: the SDK would silently drop this in production.
      bad: { nested: true } as unknown as string,
    });

    const [, props] = mockTrack.mock.calls[0];
    expect(props).not.toHaveProperty("bad");
    expect(props).toHaveProperty("ok", "yes");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/lib/analytics-attribution.test.ts`
Expected: FAIL — no `page` property on the conversion event, and `bad` still present.

- [ ] **Step 3: Modify `trackEvent`**

In `lib/analytics.ts`, add to the imports at the top of the file:

```ts
import { sanitize, currentPage } from "@/lib/analytics-guard";
import { CONVERSION_EVENTS } from "@/lib/analytics-events";
```

Then replace the Vercel Analytics half of `trackEvent` (currently `lib/analytics.ts:22-31`) with:

```ts
  // Vercel Analytics
  const raw: Record<string, unknown> = { category };

  if (label) raw.label = label;
  if (value !== undefined) raw.value = value;
  if (properties) Object.assign(raw, properties);

  // Only conversions carry `page`. Adding it everywhere would spend event
  // budget on questions nobody asks, and would break the exact-payload
  // assertions in the existing analytics suites.
  if (CONVERSION_EVENTS.has(action)) {
    const page = currentPage();
    if (page) raw.page = page;
  }

  const { name, props } = sanitize(action, raw);
  track(name, props);
```

Leave the Google Analytics block above it exactly as it is.

- [ ] **Step 4: Run the new tests**

Run: `npx jest __tests__/lib/analytics-attribution.test.ts`
Expected: PASS, 3 tests.

- [ ] **Step 5: Run the existing analytics suites to confirm no regression**

Run: `npx jest __tests__/lib/analytics-blog.test.ts __tests__/lib/analytics-motion.test.ts __tests__/lib/analytics-pwa.test.ts __tests__/lib/analytics-seo.test.ts __tests__/lib/analytics-recommendations.test.ts`
Expected: PASS. All 31 exact-payload assertions still match, because non-conversion events gain no `page` and `sanitize` returns valid scalars unchanged.

- [ ] **Step 6: Commit**

```bash
git add lib/analytics.ts __tests__/lib/analytics-attribution.test.ts
git commit -m "feat(analytics): validate every event at a single boundary"
```

---

### Task 4: Surface attribution on conversion events

**Files:**
- Modify: `lib/analytics.ts:169-183` (`trackContactIntent`)
- Modify: `__tests__/lib/analytics-attribution.test.ts` (created in Task 3)
- Modify: `app/page.tsx:152`, `app/page.tsx:358`
- Modify: `app/services/services-client.tsx:263`
- Modify: `components/ui/cta-section.tsx:43`, `components/ui/cta-section.tsx:54`
- Modify: `components/case-study/case-study-template.tsx:734`
- Modify: `components/ui/lets-chat-dialog.tsx:65`, `components/ui/lets-chat-dialog.tsx:140`
- Modify: `components/ui/buy-me-a-coffee.tsx:40`
- Test: `__tests__/ui/lets-chat-dialog.test.tsx:70`, `:76`

**Interfaces:**
- Consumes: `ConversionSurface` from `lib/analytics-events.ts`.
- Produces: `trackContactIntent(contactType: string, contactValue?: string, surface?: ConversionSurface): void` — third parameter **optional**, so any caller not yet updated still compiles.

**Why this task exists:** all five booking CTAs currently emit an identical payload, because `contactValue` is the same `BOOKING_URL` constant everywhere. The data can report that bookings were clicked and never which surface earned them.

- [ ] **Step 1: Write the failing test**

Append to `__tests__/lib/analytics-attribution.test.ts`, inside the same file created in
Task 3 so it reuses that file's top-level `@vercel/analytics` mock:

```ts
describe("trackContactIntent attribution", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTrack.mockClear();
  });

  it("records which surface originated the booking click", () => {
    const { trackContactIntent } = require("../../lib/analytics");

    trackContactIntent("booking", "https://example.com/book", "case_study_footer");

    expect(mockTrack).toHaveBeenCalledWith(
      "contact_intent",
      expect.objectContaining({
        contact_method: "booking",
        surface: "case_study_footer",
      }),
    );
  });

  it("still works for a caller that passes no surface", () => {
    const { trackContactIntent } = require("../../lib/analytics");

    trackContactIntent("booking", "https://example.com/book");

    const [, props] = mockTrack.mock.calls[0];
    expect(props).not.toHaveProperty("surface");
    expect(props).toHaveProperty("contact_method", "booking");
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx jest __tests__/lib/analytics-attribution.test.ts -t "attribution"`
Expected: FAIL — `surface` is absent, because `trackContactIntent` ignores a third argument.

- [ ] **Step 3: Add the optional parameter**

In `lib/analytics.ts`, add to the existing import from the catalog:

```ts
import { CONVERSION_EVENTS, type ConversionSurface } from "@/lib/analytics-events";
```

Replace `trackContactIntent` with:

```ts
export const trackContactIntent = (
  contactType: string,
  contactValue?: string,
  surface?: ConversionSurface,
) => {
  trackEvent(
    "contact_intent",
    "professional_interest",
    contactType,
    undefined,
    createProperties({
      contact_method: contactType,
      contact_value: contactValue,
      surface,
    }),
  );
};
```

`createProperties` already discards `undefined`, so an omitted `surface` adds nothing to the payload.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx jest __tests__/lib/analytics-attribution.test.ts -t "attribution"`
Expected: PASS, 2 tests.

- [ ] **Step 5: Pass the surface at each of the nine call sites**

Apply exactly these, one per site:

| File and line | Change the call to |
| --- | --- |
| `app/page.tsx:152` | `trackContactIntent("booking", BOOKING_URL, "home_hero")` |
| `app/page.tsx:358` | `trackContactIntent("booking", BOOKING_URL, "home_secondary_cta")` |
| `app/services/services-client.tsx:263` | `trackContactIntent("booking", BOOKING_URL, "services_pricing")` |
| `components/ui/cta-section.tsx:43` | `trackContactIntent("booking", BOOKING_URL, "shared_cta_section")` |
| `components/ui/cta-section.tsx:54` | `trackContactIntent("virtual_assistant_open", ASSISTANT_URL, "shared_cta_section")` |
| `components/case-study/case-study-template.tsx:734` | `trackContactIntent("booking", BOOKING_URL, "case_study_footer")` |
| `components/ui/lets-chat-dialog.tsx:65` | `trackContactIntent("virtual_assistant_open", ZINLEY_URL, "chat_dialog")` |
| `components/ui/lets-chat-dialog.tsx:140` | add `"chat_dialog"` as the third argument to the existing call |
| `components/ui/buy-me-a-coffee.tsx:40` | `trackContactIntent("buy_me_a_coffee", BMC_URL, "coffee_link")` |

- [ ] **Step 6: Update the two assertions this breaks**

`__tests__/ui/lets-chat-dialog.test.tsx` asserts two-argument calls. Replace both:

```ts
    expect(trackContactIntent).toHaveBeenCalledWith(
      "virtual_assistant_open",
      ZINLEY_URL,
      "chat_dialog",
    );

    fireEvent.click(screen.getByRole("button", { name: /proceed to call/i }));
    expect(trackContactIntent).toHaveBeenCalledWith(
      "virtual_assistant_call",
      ZINLEY_EMBED_URL,
      "chat_dialog",
    );
```

- [ ] **Step 7: Run the full suite**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: 92 suites passing, 28 skipped.

- [ ] **Step 8: Commit**

```bash
git add lib/analytics.ts app/page.tsx app/services/services-client.tsx components/ui/cta-section.tsx components/ui/lets-chat-dialog.tsx components/ui/buy-me-a-coffee.tsx components/case-study/case-study-template.tsx __tests__/ui/lets-chat-dialog.test.tsx __tests__/lib/analytics-attribution.test.ts
git commit -m "feat(analytics): attribute conversions to the surface that earned them"
```

---

### Task 5: Speed Insights

**Files:**
- Modify: `package.json` (add `@vercel/speed-insights`)
- Modify: `app/layout.tsx:9` (import), `app/layout.tsx:155` (mount)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Install the package**

```bash
npm install @vercel/speed-insights
```

- [ ] **Step 2: Mount the component**

In `app/layout.tsx`, beside the existing `import { Analytics } from "@vercel/analytics/next";` add:

```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
```

Directly after the existing `<Analytics />` at `app/layout.tsx:155`, add:

```tsx
        <SpeedInsights />
```

- [ ] **Step 3: Verify it renders without error**

```bash
npm run dev:direct
```

Then load `http://localhost:3000` and confirm the browser console shows no error from `@vercel/speed-insights`. On Hobby this reports against a 10,000-event/month allowance with a 7-day window, separate from the 50,000 Web Analytics events.

- [ ] **Step 4: Verify types, lint, and tests**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: 92 suites passing, 28 skipped.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json app/layout.tsx
git commit -m "feat(analytics): report Core Web Vitals through Speed Insights"
```

---

### Task 6: Repair the orphaned web-vitals module

**Files:**
- Modify: `components/performance/web-vitals.tsx`

**Interfaces:**
- Consumes: `throttled` from `lib/analytics-guard.ts`, `HIGH_FREQUENCY_WINDOW_MS` from `lib/analytics-events.ts`.
- Produces: nothing. Both components remain unmounted.

**Why:** the file is never mounted, and if it were it would fail three ways — it POSTs to `/api/analytics/web-vitals`, a route that does not exist; it calls the untyped `(window as any).va` escape hatch; and its `PerformanceMetrics` attaches document-level listeners that emit an analytics event on every interaction. Speed Insights (Task 5) now covers its Core Web Vitals role, so this task makes the file safe rather than useful.

- [ ] **Step 1: Add the imports**

At the top of `components/performance/web-vitals.tsx`:

```tsx
import { track } from "@vercel/analytics";
import { throttled } from "@/lib/analytics-guard";
import { HIGH_FREQUENCY_WINDOW_MS } from "@/lib/analytics-events";
```

- [ ] **Step 2: Delete the fetch to the nonexistent route**

Remove the entire `fetch("/api/analytics/web-vitals", { ... })` call beginning at `components/performance/web-vitals.tsx:48`. `app/api/` contains only `cdn/`, `csp-report/`, and `newsletter/` — this request has always 404'd.

- [ ] **Step 3: Replace every untyped `va` call**

Replace each occurrence of the pattern:

```tsx
(window as any).va?.("track", "Web Vital", { ... });
```

with:

```tsx
track("Web Vital", { ... });
```

Apply the same substitution at every remaining site: `"TTFB"`, `"Resource Size"`, `"Memory Usage"`, `"Connection"`, and `"User Interactions"`. The property objects passed to each stay as they are — `sanitize` is not involved here because these call `track` directly, so keep their values as scalars.

- [ ] **Step 4: Throttle the interaction listener**

The `trackInteraction` function registered at `components/performance/web-vitals.tsx:182` fires on every user interaction. Guard its emit:

```tsx
    const trackInteraction = () => {
      if (!throttled("web_vitals_interaction", HIGH_FREQUENCY_WINDOW_MS)) return;

      track("User Interactions", {
        // ... keep the existing property object unchanged
      });
    };
```

- [ ] **Step 5: Confirm the file is still unmounted**

Run: `grep -rn "WebVitalsReporter\|PerformanceMetrics" app components --include='*.tsx' | grep -v "components/performance/web-vitals.tsx"`
Expected: no output. Both components stay unmounted; Speed Insights supersedes them.

- [ ] **Step 6: Verify**

Run: `npm run lint && npx tsc --noEmit && npm test`
Expected: 92 suites passing, 28 skipped.

- [ ] **Step 7: Commit**

```bash
git add components/performance/web-vitals.tsx
git commit -m "fix(analytics): make the web-vitals module safe to mount"
```

---

## Out of scope for this plan

Wiring the 7 signal trackers (`trackProjectLiveDemo`, `trackProjectGithub`, `trackExternalLink`, `trackRelatedArticleClick`, `trackRecommendationConversion`, `trackNewsletterSignup`, `trackBlogPostView`) and routing the 7 high-frequency trackers through `throttled()` is a **separate plan**. It touches seven unrelated surfaces and depends on the guard landing first. This plan delivers working, independently valuable software without it: every event validated at one boundary, conversions attributed to their surface, Core Web Vitals reported, and the web-vitals landmine defused.

Also out of scope, per the spec: migrating off Google Analytics, building a server-side analytics route, upgrading the Vercel plan, and dashboards or the query API.
