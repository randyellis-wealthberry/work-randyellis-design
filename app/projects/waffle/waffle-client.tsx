"use client";

import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
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
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { GlowEffect } from "@/components/motion-primitives/glow-effect";
import { Magnetic } from "@/components/motion-primitives/magnetic";
import { InView } from "@/components/motion-primitives/in-view";
import { Tilt } from "@/components/motion-primitives/tilt";
import { CaseStudyNarrative } from "@/components/case-study/case-study-narrative";
import { ReflectionBlock } from "@/components/case-study/reflection-block";
import { PROJECTS } from "@/lib/data/projects";

// Get the Waffle project data
const waffleProject = PROJECTS.find((p) => p.id === "waffle")!;

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
] as const;

const STEPS = [
  {
    number: 1,
    title: "Paste your job description",
    description:
      "Drop in the role's job description and Waffle gets to work identifying the competencies that matter.",
    span: 1,
  },
  {
    number: 2,
    title: "Watch the scorecard stream live",
    description:
      "Weighted competencies, behavioral questions, and scoring rubrics stream in as interactive components in 2–4 minutes.",
    span: 1,
  },
  {
    number: 3,
    title: "Export to PDF or share with your team",
    description:
      "Export a print-ready PDF or share the scorecard directly with your hiring team inside Waffle.",
    span: 2,
  },
] as const;

/** Secondary product shots shown under the hero screenshot. */
const SCREENSHOTS = [
  {
    src: "/projects/waffle/scorecard-overview.png",
    width: 1920,
    height: 1218,
    alt: "Waffle scorecard for a Grocery Store Clerk role showing a 7.5/10 overall score weighted across five competencies",
    caption:
      "A generated scorecard: competency cards on the left, a weighted overall score rolled up from all five on the right.",
  },
  {
    src: "/projects/waffle/scorecard-questions.png",
    width: 1920,
    height: 1218,
    alt: "Waffle side panel listing behavioral interview questions with follow-ups and what each question assesses",
    caption:
      "Each competency opens into behavioral questions, follow-up prompts, and a note on what the question is actually assessing.",
  },
  {
    src: "/projects/waffle/scorecard-templates.png",
    width: 1920,
    height: 1218,
    alt: "Waffle scorecard template library filtered by Engineering, Product and Design, Sales and Marketing, and Operations",
    caption:
      "Pre-built templates for common roles, so teams start from a reviewed rubric instead of a blank prompt.",
  },
  {
    src: "/projects/waffle/landing.png",
    width: 1920,
    height: 1159,
    alt: "waffle.cards landing page: 'Untangle Your Hiring Process', with a job-description field that generates a scorecard",
    caption:
      "The public landing page at waffle.cards: paste a job description and watch the scorecard build itself live.",
  },
] as const;

// Layout: the first two shots sit side by side; everything after runs full
// width. Keeps the wide template-library shot and the square device mockup
// from being forced into half-width cells of very different heights.
const SIDE_BY_SIDE_COUNT = 2;

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
        <motion.div variants={VARIANTS_ITEM}>
          <h1 className="text-4xl font-bold text-zinc-900 md:text-6xl dark:text-zinc-100">
            <TextEffect per="char" preset="fade">
              Waffle
            </TextEffect>
          </h1>
        </motion.div>
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
          <Magnetic>
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
          </Magnetic>
          <Magnetic>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-h-[44px]"
            >
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
          </Magnetic>
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
            <motion.div key={feature.title} variants={VARIANTS_ITEM}>
              <Tilt>
                <Card className="h-full rounded-2xl border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 dark:bg-amber-500/10">
                    <feature.icon className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                  </div>
                  <CardTitle className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-base text-zinc-600 dark:text-zinc-400">
                    {feature.description}
                  </CardDescription>
                </Card>
              </Tilt>
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
            <Card
              key={step.number}
              className={`rounded-2xl border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50 ${step.span === 2 ? "md:col-span-2" : ""}`}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 dark:bg-amber-500/10">
                <span className="font-bold text-amber-600 dark:text-amber-500">
                  {step.number}
                </span>
              </div>
              <CardTitle className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                {step.title}
              </CardTitle>
              <CardDescription className="text-base text-zinc-600 dark:text-zinc-400">
                {step.description}
              </CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* My Role & Key Decisions */}
      <CaseStudyNarrative project={waffleProject} />

      {/* Product screenshot */}
      <section>
        <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          See it in action
        </h2>
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
          <GlowEffect
            colors={["#d97706", "#f59e0b", "#fbbf24", "#f97316"]}
            mode="breathe"
            blur="soft"
          />
          <div className="relative h-full w-full overflow-hidden rounded-[15px] bg-white p-6 dark:bg-zinc-950">
            <Image
              src="/projects/waffle/dashboard-macbook.jpg"
              alt="Waffle dashboard on a MacBook Pro: a 'Good morning, Randy' greeting, role cards for Software Engineer, Product Manager, Sales Representative and Designer, and a prompt to describe the role you're hiring for"
              width={1080}
              height={1080}
              priority
              className="h-auto w-full rounded-lg"
            />
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-4xl items-start gap-6 sm:grid-cols-2">
          {SCREENSHOTS.map((shot, index) => (
            <InView
              key={shot.src}
              variants={{
                hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
                visible: {
                  opacity: 1,
                  y: 0,
                  filter: "blur(0px)",
                  transition: { duration: 0.6, delay: index * 0.1 },
                },
              }}
              viewOptions={{ margin: "0px 0px -100px 0px" }}
            >
              <figure
                className={
                  index >= SIDE_BY_SIDE_COUNT ? "sm:col-span-2" : undefined
                }
              >
                <div className="overflow-hidden rounded-xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30">
                  <div className="overflow-hidden rounded-[11px] bg-white p-3 dark:bg-zinc-950">
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      width={shot.width}
                      height={shot.height}
                      sizes={
                        index >= SIDE_BY_SIDE_COUNT
                          ? "(min-width: 896px) 896px, 100vw"
                          : "(min-width: 640px) 50vw, 100vw"
                      }
                      className="h-auto w-full rounded-lg"
                    />
                  </div>
                </div>
                <figcaption className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {shot.caption}
                </figcaption>
              </figure>
            </InView>
          ))}
        </div>
      </section>

      {/* Reflection */}
      {waffleProject.processStory?.reflection && (
        <ReflectionBlock
          reflection={waffleProject.processStory.reflection}
          heading="Building a Live AI Product"
        />
      )}

      {/* Closing CTA band */}
      <section>
        <Card className="rounded-2xl bg-zinc-50 p-8 dark:bg-zinc-900/50">
          <CardTitle className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Ready to see it live?
          </CardTitle>
          <div className="flex flex-wrap gap-3">
            <Magnetic>
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
            </Magnetic>
            <Magnetic>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="min-h-[44px]"
              >
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
            </Magnetic>
          </div>
        </Card>
      </section>

      {/* Back-to-projects nav */}
      <section className="border-t border-zinc-200 pt-8 dark:border-zinc-700">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <Button asChild variant="outline" size="lg">
            <Link href="/projects">← Back to Projects</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
