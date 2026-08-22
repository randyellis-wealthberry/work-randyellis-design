"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  PRIMARY_BUTTON,
  SECONDARY_BUTTON,
} from "@/components/ui/button-styles";

/**
 * The route-level error boundary.
 *
 * It printed "500" at `text-6xl font-bold`, centred. Three things wrong with
 * that: this boundary catches *any* render error in the segment — a thrown
 * client exception, a failed fetch, a bad prop — and almost none of them are
 * an HTTP 500, so the page stated a status code it cannot know; `font-bold` is
 * a weight the type scale does not have (Display is 600); and the centred
 * layout is the only one on the site that is not left-aligned editorial.
 *
 * The digest is surfaced deliberately. Next.js hashes the server-side error
 * and exposes it here; it is the only string a reader can quote that maps to
 * anything in the logs. Without it, "it broke" is the whole bug report.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // `next.config.js` strips console calls in production, so this is a
    // development aid only — not error reporting. The comment that used to
    // sit here claimed it logged "to an error reporting service"; it never
    // did, and pretending otherwise is how a service never gets wired up.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
    >
      <div className="pt-12">
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          Something broke on this page.
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
          The rest of the site is fine. Reloading this page usually clears it;
          if it doesn&apos;t, the link below still works.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className={PRIMARY_BUTTON}
          >
            Try again
          </button>
          <Link href="/" className={SECONDARY_BUTTON}>
            Go to the homepage
          </Link>
        </div>

        {/* Footnote voice: a qualifier stated once, in Quiet at 0.75rem. The
            reference is tabular because it is a string a reader transcribes. */}
        {error.digest && (
          <p className="mt-10 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            If you tell me about this, quote this reference:{" "}
            <span className="font-[family-name:var(--font-geist-mono),ui-monospace,monospace] tabular-nums">
              {error.digest}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
