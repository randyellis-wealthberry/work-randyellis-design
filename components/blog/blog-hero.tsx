"use client";
import { motion } from "motion/react";
import Image from "next/image";

interface BlogHeroProps {
  title: string;
  description: string;
  heroImage?: string;
  heroAlt?: string;
  author?: string;
  date?: string;
}

// The Visible At Zero Rule: the hidden state is fully painted and only settles
// 10px, so the post's title is never conditional on a script or a scroll.
const VARIANTS_SECTION = {
  hidden: { opacity: 1, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

export function BlogHero({
  title,
  description,
  heroImage,
  heroAlt,
  author = "Randy Ellis",
  date,
}: BlogHeroProps) {
  if (!heroImage) return null;

  return (
    <motion.section
      className="not-prose space-y-8 pb-12"
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      initial="hidden"
      animate="visible"
    >
      {/* The Media Band Figure (DESIGN.md): a 1px Hairline on a Wash ground at
          `rounded-xl` with 12px of padding (16px above `sm`), holding the asset
          at `rounded-lg`. A bare rounded image changed the page's ground
          wherever the art had a light background. */}
      <figure className="rounded-xl border border-zinc-200 bg-zinc-100 p-3 sm:p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Image
          src={heroImage}
          alt={heroAlt || title}
          width={1200}
          height={630}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          className="w-full rounded-lg"
        />
      </figure>

      {/* Display / Lead, left-aligned like every other page title on the site.
          Display is 600 at -0.03em capped at 18ch; the Lead is one paragraph at
          1.125rem in Prose capped at 62ch. This was 36px/700 centred with an
          uncapped 20px paragraph under it. */}
      <div className="space-y-6">
        <h1 className="max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          {title}
        </h1>

        <p className="max-w-[62ch] text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          {description}
        </p>

        {/* Provenance in the Footnote voice; the date is a countable figure. */}
        {(author || date) && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-zinc-500 dark:text-zinc-400">
            {author && <span>By {author}</span>}
            {author && date && <span aria-hidden="true">·</span>}
            {date && (
              <time className="tabular-nums" dateTime={date}>
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
          </div>
        )}
      </div>
    </motion.section>
  );
}
