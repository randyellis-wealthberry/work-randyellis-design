"use client";

import {
  Disclosure,
  DisclosureTrigger,
  DisclosureContent,
} from "@/components/motion-primitives/disclosure";
import { Markdown } from "@/components/skill/markdown";
import { BuyButton } from "@/components/skill/buy-button";
import type { SkillModule } from "@/lib/data/skill-catalog";

const DISCLOSURE_TRIGGER =
  "min-h-[44px] cursor-pointer text-sm font-medium text-zinc-500 underline decoration-zinc-300 underline-offset-4 transition-colors hover:text-zinc-900 hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-zinc-400 dark:decoration-zinc-700 dark:hover:text-white dark:hover:decoration-zinc-100 dark:focus-visible:ring-white";

/**
 * One module as a hairline-separated entry, in the shape of the Decision
 * Callout: a Subhead, the assertion in Ink, the long half behind a
 * disclosure, and the part a reader came for held visible. Here the visible
 * part is the price and what the module produces; the preview and the sample
 * open on demand. Not a card, not a grid: six cards would be six equal
 * shouts, and a list lets the names carry the hierarchy.
 */
export function ModuleEntry({
  module,
  index,
  sectionId,
}: {
  module: SkillModule;
  index: number;
  sectionId: string;
}) {
  const headingId = `${sectionId}-module-${index}-heading`;

  return (
    <article
      id={`module-${module.id}`}
      aria-labelledby={headingId}
      className="scroll-mt-10 border-t border-zinc-200 py-8 first:border-t-0 first:pt-0 dark:border-zinc-800"
    >
      <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div className="min-w-0">
          <h3
            id={headingId}
            className="text-lg font-medium text-zinc-900 dark:text-white"
          >
            {module.name}
            <span className="ml-3 font-mono text-xs font-normal text-zinc-500 dark:text-zinc-400">
              {module.id}
            </span>
          </h3>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {module.role}
          </p>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-zinc-900 dark:text-zinc-100">
            {module.tagline}
          </p>
          <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {module.summary}
          </p>
        </div>
        <div className="sm:pt-1">
          <BuyButton entry={module} />
        </div>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-[minmax(0,10rem)_1fr]">
        <dt className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
          Produces
        </dt>
        <dd>
          <ul className="max-w-[62ch] space-y-1 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            {module.produces.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </dd>
        <dt className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
          Use it when
        </dt>
        <dd className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          {module.useWhen}
        </dd>
      </dl>

      {/* Stacked, not a row: each disclosure owns its trigger and its content,
          and a content panel opening inside a flex item would be squeezed to
          that item's width. */}
      <div className="mt-5 space-y-1">
        <Disclosure>
          <DisclosureTrigger>
            <button type="button" className={DISCLOSURE_TRIGGER}>
              Read the preview
            </button>
          </DisclosureTrigger>
          <DisclosureContent>
            <div className="pt-4 pb-2">
              <Markdown>{module.preview}</Markdown>
            </div>
          </DisclosureContent>
        </Disclosure>
        <Disclosure>
          <DisclosureTrigger>
            <button type="button" className={DISCLOSURE_TRIGGER}>
              See what it produces
            </button>
          </DisclosureTrigger>
          <DisclosureContent>
            <figure className="pt-4 pb-2">
              <figcaption className="text-sm font-medium tracking-[0.02em] text-zinc-500 dark:text-zinc-400">
                {module.sampleTitle}
              </figcaption>
              <div className="mt-2">
                <Markdown>{module.sample}</Markdown>
              </div>
            </figure>
          </DisclosureContent>
        </Disclosure>
      </div>
    </article>
  );
}
