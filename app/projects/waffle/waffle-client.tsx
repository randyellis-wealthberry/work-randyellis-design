"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { trackEvent } from "@/lib/analytics";
import {
  MessageSquare,
  Sparkles,
  FileText,
  Upload,
  ShieldCheck,
  Users,
} from "lucide-react";

const CATEGORY = "waffle_product_page";
const VIEW_LIVE_LABEL = "View live product CTA";
const TRY_FREE_LABEL = "Try free CTA";

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const VARIANTS_ITEM = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const FEATURES = [
  {
    icon: MessageSquare,
    title: "Chat-Based Scorecard Generation",
    description:
      "Generate weighted competencies, behavioral questions, and scoring rubrics through a simple chat interface powered by Claude and the Vercel AI SDK 6.",
  },
  {
    icon: Sparkles,
    title: "Generative UI",
    description:
      "Scorecards stream in live as interactive React components — not static text — so you see the rubric take shape in real time.",
  },
  {
    icon: FileText,
    title: "PDF Export",
    description:
      "Export any scorecard as a clean, print-ready PDF you can share with hiring panels or attach to an ATS record.",
  },
  {
    icon: Upload,
    title: "Universal Transcript Ingestion",
    description:
      "Import interview transcripts from Granola, Otter, Fathom, Fireflies, Gong, and 25+ more note-taking tools.",
  },
  {
    icon: ShieldCheck,
    title: "EEOC-Compliant & Bias-Reducing",
    description:
      "Scoring rubrics are generated with EEOC-compliant, bias-reducing guardrails baked into every question and competency.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description:
      "Multi-tenant organizations with role-based access let hiring teams collaborate on scorecards together.",
  },
];

const STEPS = [
  {
    number: 1,
    title: "Paste your job description",
    description:
      "Drop in the role's job description and Waffle gets to work identifying the competencies that matter.",
  },
  {
    number: 2,
    title: "Watch the scorecard stream live",
    description:
      "Weighted competencies, behavioral questions, and scoring rubrics stream in as interactive components in 2–4 minutes.",
  },
  {
    number: 3,
    title: "Export to PDF or share with your team",
    description:
      "Export a print-ready PDF or share the scorecard directly with your hiring team inside Waffle.",
  },
];

/** Secondary product shots shown under the hero screenshot. */
const SCREENSHOTS = [
  {
    src: "/projects/waffle/scorecard-overview.png",
    alt: "Waffle scorecard for a Grocery Store Clerk role showing a 7.5/10 overall score weighted across five competencies",
    caption:
      "A generated scorecard: competency cards on the left, a weighted overall score rolled up from all five on the right.",
  },
  {
    src: "/projects/waffle/scorecard-questions.png",
    alt: "Waffle side panel listing behavioral interview questions with follow-ups and what each question assesses",
    caption:
      "Each competency opens into behavioral questions, follow-up prompts, and a note on what the question is actually assessing.",
  },
  {
    src: "/projects/waffle/scorecard-templates.png",
    alt: "Waffle scorecard template library filtered by Engineering, Product and Design, Sales and Marketing, and Operations",
    caption:
      "Pre-built templates for common roles, so teams start from a reviewed rubric instead of a blank prompt.",
  },
] as const;

export default function WaffleClientPage() {
  return (
    <main className="relative space-y-16 sm:space-y-24">
      {/* Hero */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={VARIANTS_CONTAINER}
        className="space-y-6"
      >
        <motion.div
          variants={VARIANTS_ITEM}
          className="flex items-center gap-3"
        >
          <Badge className="bg-amber-600 text-sm font-bold text-zinc-950 dark:bg-amber-500">
            Live Product
          </Badge>
          <Image
            src="/projects/waffle/logo.svg"
            alt="Waffle logo"
            width={48}
            height={48}
          />
        </motion.div>
        <motion.h1
          variants={VARIANTS_ITEM}
          className="text-4xl font-bold text-zinc-900 md:text-6xl dark:text-zinc-100"
        >
          Waffle
        </motion.h1>
        <motion.p
          variants={VARIANTS_ITEM}
          className="max-w-3xl text-zinc-600 dark:text-zinc-400"
        >
          AI-powered interview scorecard generator — paste a job description,
          get weighted competencies, behavioral questions, and scoring rubrics
          in 2–4 minutes.
        </motion.p>
        <motion.p
          variants={VARIANTS_ITEM}
          className="text-sm font-bold text-zinc-700 dark:text-zinc-300"
        >
          Designed and built end-to-end by Randy Ellis — a live, paid,
          production AI SaaS (Next.js 16, AI SDK 6 + Claude, Stripe,
          Neon/Prisma, Clerk).
        </motion.p>
        <motion.div variants={VARIANTS_ITEM} className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="min-h-[44px] bg-amber-600 text-zinc-950 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            <a
              href="https://waffle.cards"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("waffle_view_live", CATEGORY, VIEW_LIVE_LABEL)
              }
            >
              View live product ↗
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <a
              href="https://app.waffle.cards/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("waffle_try_free", CATEGORY, TRY_FREE_LABEL)
              }
            >
              Try free
            </a>
          </Button>
        </motion.div>
      </motion.section>

      {/* Feature grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={VARIANTS_CONTAINER}
      >
        <motion.h2
          variants={VARIANTS_ITEM}
          className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100"
        >
          Key Features
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              variants={VARIANTS_ITEM}
              className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 dark:bg-amber-500/10">
                <feature.icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {feature.title}
              </h3>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Free tier available — no credit card required.
        </p>
      </motion.section>

      {/* How it works */}
      <section>
        <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          How It Works
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className={
                step.number === 3
                  ? "rounded-2xl border border-zinc-200 bg-zinc-50 p-6 md:col-span-2 dark:border-zinc-800 dark:bg-zinc-900/50"
                  : "rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50"
              }
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 dark:bg-amber-500/10">
                <span className="font-bold text-amber-600 dark:text-amber-500">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </h3>
              <p className="text-base text-zinc-600 dark:text-zinc-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product screenshot */}
      <section>
        <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          See it in action
        </h2>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
          <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-white p-6 dark:bg-zinc-950">
            <Image
              src="/projects/waffle/landing.png"
              alt="waffle.cards landing page: 'Untangle Your Hiring Process', with a job-description field that generates a scorecard"
              width={1920}
              height={1159}
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl gap-6 sm:grid-cols-2">
          {SCREENSHOTS.map((shot) => (
            <figure key={shot.src} className="sm:last:col-span-2">
              <div className="overflow-hidden rounded-xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
                <div className="overflow-hidden rounded-[11px] bg-white p-3 dark:bg-zinc-950">
                  <Image
                    src={shot.src}
                    alt={shot.alt}
                    width={1920}
                    height={1218}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="h-auto w-full rounded-lg"
                  />
                </div>
              </div>
              <figcaption className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Closing CTA band */}
      <section className="rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900/50">
        <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Ready to see it live?
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="min-h-[44px] bg-amber-600 text-zinc-950 hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600"
          >
            <a
              href="https://waffle.cards"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("waffle_view_live", CATEGORY, VIEW_LIVE_LABEL)
              }
            >
              View live product ↗
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-h-[44px]">
            <a
              href="https://app.waffle.cards/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("waffle_try_free", CATEGORY, TRY_FREE_LABEL)
              }
            >
              Try free
            </a>
          </Button>
        </div>
      </section>

      {/* Back-to-projects nav */}
      <section className="border-t border-zinc-200 pt-8 dark:border-zinc-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-6 py-3 text-zinc-900 transition-all duration-200 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            ← Back to Projects
          </Link>
        </div>
      </section>
    </main>
  );
}
