"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { CometCard } from "@/components/ui/comet-card";

// Visible At Zero (DESIGN.md): the hidden state stays fully opaque and unblurred
// so the page paints complete on first byte — entrance motion only settles the
// y-offset.
const VARIANTS_CONTAINER = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 1, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

/**
 * The METIS:LAYER announcement — a letter, linked from the homepage's FAQ.
 *
 * What was here fought the rest of the site on four counts:
 *
 *   1. **The same artwork twice.** `CometCardDemo` and the inline `CometCard`
 *      below it both rendered `playercard-metis.png`, in two consecutive
 *      `pb-16` sections. The demo component — named for what it is — had been
 *      shipped to production next to the real thing.
 *   2. **Its own container.** `mx-auto max-w-5xl px-4` sat inside
 *      `RouteContainer`, which already centres the column and already applies
 *      the gutters. `/metis` is not in `WIDE_ROUTES`, so it was asking for
 *      1024px while the layout gave it 768 — the `max-w-5xl` did nothing and
 *      the `px-4` doubled the gutter.
 *   3. **Off-system type.** `text-4xl font-bold` (700 is a weight the scale
 *      does not have; Display is 600) over a `text-xl` lead (Lead is 1.125rem)
 *      measured in `max-w-2xl` rather than `ch`.
 *   4. **Centred.** The only centred hero on a site that is left-aligned
 *      editorial everywhere else.
 *
 * It is a letter, so it stays one movement: no section rules, no labels, no
 * contents line. The Contents Threshold Rule puts the floor at six sections
 * and this has one thing to say.
 */
export default function MetisClient() {
  return (
    <motion.main
      id="main-content"
      className="pb-8 caret-zinc-900 selection:bg-zinc-900 selection:text-white dark:caret-zinc-100 dark:selection:bg-zinc-100 dark:selection:text-zinc-900"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        className="pt-8"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {/* Hero media, not evidence: `object-cover` is allowed here by the
            Uncropped Screen Rule, which reserves containment for UI screens. */}
        <Image
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="METIS:LAYER — a business strategy AI agent for digital designers"
          width={1200}
          height={630}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full rounded-xl"
        />

        <h1 className="mt-10 max-w-[18ch] text-4xl leading-[1.05] font-semibold tracking-[-0.03em] text-balance text-zinc-900 sm:text-5xl dark:text-white">
          METIS:LAYER
        </h1>
        <p className="mt-6 max-w-[62ch] text-lg text-zinc-600 dark:text-zinc-300">
          A business strategy AI agent for digital designers — and a note about
          what I&apos;m building.
        </p>
      </motion.section>

      {/* The letter. Plain paragraphs at Body in a 62ch measure: the `prose`
          wrapper that stood here set `max-w-none`, which cancels the one thing
          the typography plugin is for, while every paragraph inside it also
          carried its own size and colour utilities. Two systems, both live. */}
      <motion.section
        className="mt-16 space-y-6"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.1 }}
      >
        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-900 dark:text-white">
          Dear Design Community,
        </p>

        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          I&apos;m excited to share something I&apos;ve been working on—a
          project that bridges the gap between design excellence and boardroom
          fluency. METIS represents my commitment to elevating our profession
          and empowering designers to speak the language of business strategy.
        </p>

        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          This initiative draws inspiration from my upcoming manuscript
          &quot;PROFITS, NOT PIXELS&quot; and years of experience leading
          product teams, scaling design organizations, and witnessing the
          transformative power of AI in our field.
        </p>

        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          METIS:LAYER will serve as a platform for AI business strategy
          specifically tailored for product designers—helping us move beyond
          pixels to drive meaningful business impact through strategic thinking
          and data-driven design decisions.
        </p>

        <p className="max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          More details will be shared soon as this vision comes to life. Thank
          you for being part of this journey and for your continued dedication
          to pushing our craft forward.
        </p>
      </motion.section>

      <motion.section
        className="mt-12 space-y-6"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.2 }}
      >
        <p className="text-base text-zinc-600 dark:text-zinc-300">Sincerely,</p>

        {/* Both sources render so the markup is complete in server HTML; CSS
            picks the theme, not hydration. `hidden` removes the inactive one
            from the accessibility tree, so the signature is announced once. */}
        <div className="-rotate-2">
          <Image
            src="/images/randyellis-signature-light.png"
            alt="Randy Ellis, signed"
            width={200}
            height={80}
            className="opacity-90 dark:hidden"
          />
          <Image
            src="/images/randyellis-signature.png"
            alt="Randy Ellis, signed"
            width={200}
            height={80}
            className="hidden opacity-90 dark:block"
          />
        </div>

        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Randy Ellis
          <br />
          AI Product Design Engineer
        </p>
      </motion.section>

      {/* One card, not two. A figure, so it carries a caption rather than
          floating unlabelled at the foot of a letter. */}
      <motion.section
        className="mt-20 border-t border-zinc-200 pt-10 dark:border-zinc-800"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.25 }}
      >
        <figure className="m-0">
          <CometCard className="mx-auto max-w-sm">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/images/projects/metis/playercard-metis.png"
                alt="The METIS:LAYER player card"
                fill
                className="rounded-2xl object-cover"
                sizes="(max-width: 640px) 100vw, 384px"
              />
            </div>
          </CometCard>
          <figcaption className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
            The METIS:LAYER card. Move your pointer across it.
          </figcaption>
        </figure>
      </motion.section>
    </motion.main>
  );
}
