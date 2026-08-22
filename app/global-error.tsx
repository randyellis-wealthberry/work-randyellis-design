"use client";

/**
 * The last-resort boundary: this renders when the root layout itself throws.
 *
 * It replaces `app/layout.tsx` entirely, which is what made the previous
 * version broken in three ways at once:
 *
 *   1. `<html>` carried no `lang`. WCAG 3.1.1; a screen reader falls back to
 *      the user's own locale and reads English in the wrong voice.
 *   2. No font. The Geist CSS variable is injected by a class the root layout
 *      applies, so without that layout the page fell back to the browser's
 *      default serif — the one page on the site not set in Geist.
 *   3. Every `dark:` utility was dead code. The dark variant here is
 *      class-based (`@custom-variant dark (&:is(.dark *))`) and the class is
 *      applied by `ThemeProvider`, which is also in the layout that just
 *      failed. `<body>` had no background at all, so a reader in dark mode got
 *      an unstyled white page.
 *
 * So this file styles itself and depends on nothing: no Tailwind, no
 * `globals.css`, no provider. A boundary that needs the app to work is not a
 * boundary. `prefers-color-scheme` is the only theme signal available without
 * the provider, and it is the same signal `defaultTheme="system"` reads.
 */

// DESIGN.md palette, spelled as hex because there is no token layer here.
const STYLES = `
  :root { color-scheme: light dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #ffffff;
    color: #18181b;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .ge-wrap {
    min-height: 100vh;
    display: flex;
    align-items: center;
    max-width: 768px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
  .ge-title {
    margin: 0;
    max-width: 18ch;
    font-size: 2.25rem;
    line-height: 1.05;
    font-weight: 600;
    letter-spacing: -0.03em;
  }
  .ge-lead {
    margin: 1.5rem 0 0;
    max-width: 62ch;
    font-size: 1.125rem;
    line-height: 1.6;
    color: #52525b;
  }
  .ge-actions { margin-top: 2rem; display: flex; flex-wrap: wrap; gap: 0.75rem; }
  .ge-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    font: inherit;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background-color 150ms, border-color 150ms, color 150ms;
  }
  .ge-button:active { transform: scale(0.98); }
  .ge-button:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #18181b;
  }
  .ge-primary { background: #18181b; color: #ffffff; }
  .ge-primary:hover { background: #3f3f46; }
  .ge-secondary { border-color: #d4d4d8; color: #18181b; }
  .ge-secondary:hover { border-color: #a1a1aa; background: #f4f4f5; }
  .ge-note {
    margin: 2.5rem 0 0;
    font-size: 0.75rem;
    color: #71717a;
  }
  .ge-ref { font-variant-numeric: tabular-nums; }

  @media (prefers-color-scheme: dark) {
    body { background: #09090b; color: #ffffff; }
    .ge-lead { color: #d4d4d8; }
    .ge-button:focus-visible { box-shadow: 0 0 0 2px #09090b, 0 0 0 4px #ffffff; }
    .ge-primary { background: #ffffff; color: #18181b; }
    .ge-primary:hover { background: #e4e4e7; }
    .ge-secondary { border-color: #3f3f46; color: #ffffff; }
    .ge-secondary:hover { border-color: #52525b; background: #18181b; }
    /* zinc-500 measures 4.12:1 on the zinc-950 ground and fails the 4.5:1
       floor; the Quiet voice steps up to zinc-400 in dark everywhere on the
       site, and this page is not an exception to that. */
    .ge-note { color: #a1a1aa; }
  }

  @media (min-width: 640px) { .ge-title { font-size: 3rem; } }
  @media (prefers-reduced-motion: reduce) {
    .ge-button { transition: none; }
    .ge-button:active { transform: none; }
  }
`;

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <style>{STYLES}</style>
        <div className="ge-wrap">
          <div>
            <h1 className="ge-title">This site failed to load.</h1>
            <p className="ge-lead">
              Something went wrong before the page could render. Reloading
              usually clears it.
            </p>
            <div className="ge-actions">
              <button
                type="button"
                onClick={() => reset()}
                className="ge-button ge-primary"
              >
                Try again
              </button>
              {/* A plain anchor, not `next/link`, on purpose: the root layout
                  has already thrown, so a client-side transition would
                  re-mount the tree that just failed. This needs to be a fresh
                  document load. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/" className="ge-button ge-secondary">
                Go to the homepage
              </a>
            </div>
            {error.digest && (
              <p className="ge-note">
                Reference: <span className="ge-ref">{error.digest}</span>
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
