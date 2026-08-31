import Link from "next/link";
import { SECTION, LABEL } from "@/components/case-study/section-chrome";
import { PRIMARY_BUTTON } from "@/components/ui/button-styles";

/**
 * A 404 is a navigation failure, so it is answered with navigation.
 *
 * What stood here was a centred "404 / Page Not Found / Go back home" — the
 * one layout on the site that is not left-aligned editorial, and a dead end
 * offering a single destination. A reader who mistyped a case-study URL was
 * sent to the homepage to start over.
 */

const DESTINATIONS = [
  {
    href: "/projects",
    label: "Case studies",
    note: "The work, written up with the decisions and the numbers.",
  },
  {
    href: "/blog",
    label: "Writing",
    note: "Essays on design leadership, AI product work, and process.",
  },
  {
    href: "/services",
    label: "How I work",
    note: "The retainer, what it covers, and what it costs.",
  },
  {
    href: "/about",
    label: "About",
    note: "Twenty years of it, in order.",
  },
];

// Phase 13 T-16: without this, the 404 page inherits the root layout's
// alternates and emits rel=canonical pointing at the homepage — a soft signal
// that every dead URL is a duplicate of "/". Noindex is what a 404 means.
export const metadata = {
  robots: { index: false, follow: false },
  alternates: { canonical: null },
};

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
    >
      <div className="pt-12">
        {/* Display: 600, not 700. The site has no bold weight. */}
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          That page isn&apos;t here.
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
          The link may be old, or I may have moved the page. Nothing is broken
          on your end.
        </p>

        <div className="mt-8">
          <Link href="/" className={PRIMARY_BUTTON}>
            Go to the homepage
          </Link>
        </div>
      </div>

      {/* The Recommendations List signature: a hairline list of links, not a
          card grid. A dead end with one exit is what made this page useless. */}
      <section className={SECTION} aria-labelledby="not-found-destinations">
        <h2 id="not-found-destinations" className={LABEL}>
          Or start somewhere
        </h2>

        <ul className="mt-6 border-b border-zinc-200 dark:border-zinc-800">
          {DESTINATIONS.map((destination) => (
            <li
              key={destination.href}
              className="border-t border-zinc-200 dark:border-zinc-800"
            >
              <Link
                href={destination.href}
                className="group grid grid-cols-1 py-5 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none sm:grid-cols-[minmax(0,18rem)_1fr] dark:focus-visible:ring-white"
              >
                <span className="text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors group-hover:decoration-zinc-900 sm:pr-8 dark:text-white dark:decoration-zinc-700 dark:group-hover:decoration-zinc-100">
                  {destination.label}
                </span>
                <span className="mt-2 max-w-[62ch] text-base text-zinc-500 sm:mt-0 dark:text-zinc-400">
                  {destination.note}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
