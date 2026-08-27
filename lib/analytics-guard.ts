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
    safe[safeKey] =
      typeof value === "string" ? truncate(value) : (value as SafeValue);
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
