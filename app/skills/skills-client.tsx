"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { InstallPicker } from "@/components/skills/install-picker";
import { SKILLS, SKILLS_REPO_URL } from "@/lib/data/skills";
import { BuyMeACoffeeButton } from "@/components/ui/buy-me-a-coffee";

const REPO_URL = SKILLS_REPO_URL;

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

const TRANSITION_SECTION = {
  duration: 0.3,
};

type Rule = {
  title: string;
  body: string;
};

const RULES: Rule[] = [
  {
    title: "Every decision names its alternative and its cost",
    body: "Not “I chose X because it’s better” — “I chose X; Y was genuinely better at Z; here’s what X cost me.”",
  },
  {
    title: "Claim only what you did",
    body: "Post-engagement growth is the product’s, not yours. Organization size is not team size. Prototype approval is not adoption. Client revenue is theirs to disclose.",
  },
  {
    title: "Report the outcome that cut against you",
    body: "Every real decision has a cost. An outcome section with no downside in it is either a decision that was never real or a report that has been cleaned.",
  },
  {
    title: "Adoption is the hard part, not construction",
    body: "A familiar API beats a better one. A fork beats a clean sheet when the foundation is adequate. Persuasion beats a mandate you can’t enforce.",
  },
  {
    title: "Trust is a design material",
    body: "In any product that asserts something to a user, the interface either builds trust or spends it. Confidence you haven’t earned is the fastest way to spend it.",
  },
  {
    title: "The number you care about most is rarely the biggest one",
    body: "Lead with the metric that maps to the intent. Put the large number second.",
  },
];

const SELF_CRITICAL_QUOTES: { quote: string; source: string }[] = [
  {
    quote:
      "It cut both ways, as designed. Novices stopped bouncing off the first run; experienced gardeners said plainly that features they knew existed were buried. Same call again, but the complaint was real and there was no good answer for it.",
    source: "GrowIt! — progressive disclosure over two modes",
  },
  {
    quote:
      "The risk landed. Developers largely did not find the primitives on their own; they hit the edge of a default and asked rather than dropping down a layer. That is a documentation failure, not an architecture one, and it is mine to fix.",
    source: "Rambis UI — opinionated defaults with an escape hatch",
  },
  {
    quote:
      "The scale number that gets quoted — 18,000+ people across 36 countries — is the organization, not my team. I had direct authority over 15 designers and influence over everyone else, which is the honest shape of design leadership at this size.",
    source: "Nagarro — naming the shape of your authority",
  },
  {
    quote:
      "The client’s commercial results are theirs to disclose. What is claimed here is the design work.",
    source: "Claim discipline, applied to a client engagement",
  },
];

export default function SkillsClient() {
  return (
    <motion.main
      className="mx-auto max-w-3xl space-y-20 px-0 pb-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <p className="mb-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Open source · Agent skills · MIT
        </p>
        <h1 className="mb-5 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-100">
          AI Skills
        </h1>
        <p className="mb-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
          Rationale as a design material.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            View on GitHub
          </a>
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 ring-1 ring-zinc-200 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:text-zinc-100"
          >
            See the work behind them
          </Link>
        </div>
        {/* Fine print, not a third button: the ask stays quieter than the work. */}
        <p className="mt-5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Free to use. If you find this useful,{" "}
          <BuyMeACoffeeButton className="text-xs">
            buy me a coffee
          </BuyMeACoffeeButton>
          .
        </p>
      </motion.section>

      {/* Premise */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.05 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          Why this exists
        </h2>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          For twenty years a design portfolio worked as proof by being expensive
          — producing a polished case study cost real hours, so the artifact
          itself was evidence. That cost is now zero. Anyone can generate six
          clean sections and a metrics band in an afternoon, and no reader can
          tell the difference by looking.
        </p>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          So evaluation moved to the only question that still carries
          information:
        </p>
        <p className="border-l-2 border-zinc-300 pl-5 text-lg leading-relaxed font-medium text-zinc-900 dark:border-zinc-600 dark:text-zinc-100">
          Walk me through why you didn’t just do the simpler thing.
        </p>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          These skills exist to make an agent useful for answering that. Agents
          are good at producing design rationale that sounds right. They are
          much worse at producing rationale that is <em>true</em> — that names
          the option you passed on, admits what your choice cost, and reports
          the result that cut against you. Left alone, an agent will write you a
          case study where every decision was correct, every number is yours,
          and nothing was traded away.
        </p>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          That is the gap these skills close. They encode a working method built
          across social platforms, logistics, fintech, AI products, a design
          system, and design leadership at enterprise scale:{" "}
          <strong className="font-medium text-zinc-900 dark:text-zinc-100">
            a decision you can’t defend isn’t a decision, it’s a preference —
            and a claim you can’t support isn’t a result, it’s a story.
          </strong>
        </p>
      </motion.section>

      {/* The skills */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.1 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          The skills
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SKILLS.map((skill) => (
            <li key={skill.name}>
              <a
                href={`${REPO_URL}${skill.path}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-full flex-col rounded-xl p-5 ring-1 ring-zinc-200 transition-colors hover:ring-zinc-400 dark:ring-zinc-800 dark:hover:ring-zinc-600"
              >
                <span className="mb-1 font-mono text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {skill.name}
                </span>
                <span className="mb-3 text-xs text-zinc-500 dark:text-zinc-400">
                  {skill.role}
                </span>
                <span className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {skill.summary}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </motion.section>

      {/* What they enforce */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.15 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          What they enforce
        </h2>
        <dl className="space-y-6">
          {RULES.map((rule) => (
            <div key={rule.title}>
              <dt className="mb-1 text-base font-medium text-zinc-900 dark:text-zinc-100">
                {rule.title}
              </dt>
              <dd className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
                {rule.body}
              </dd>
            </div>
          ))}
        </dl>
      </motion.section>

      {/* Held to their own standard */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.2 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          Held to their own standard
        </h2>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The skills and worked examples are held to the standard they enforce,
          which means several of them argue against their own author.
        </p>
        <div className="space-y-6">
          {SELF_CRITICAL_QUOTES.map((item) => (
            <figure key={item.source}>
              <blockquote className="border-l-2 border-zinc-300 pl-5 text-base leading-relaxed text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">
                {item.quote}
              </blockquote>
              <figcaption className="mt-2 pl-5 text-xs text-zinc-500 dark:text-zinc-400">
                {item.source}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          An agent running these skills will hold your work to that standard,
          including when the honest version is smaller than the one you wanted
          to write.
        </p>
      </motion.section>

      {/* Install */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.25 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          Install
        </h2>
        <InstallPicker />
      </motion.section>

      {/* Prior art */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.3 }}
        className="space-y-5"
      >
        <h2 className="text-xl font-medium text-zinc-900 dark:text-zinc-100">
          Prior art
        </h2>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The structure of this collection is modeled on{" "}
          <a
            href="https://github.com/emilkowalski/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            emilkowalski/skills
          </a>
          . Same premise — agents don’t have taste, so give them yours — aimed
          at a different layer.
        </p>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The two are complements, not alternatives. His lens is how an
          interface <em>feels to move</em>: springs, interruptibility, velocity
          handoff, gesture. The lens here is how much an interface should{" "}
          <em>assert</em>: what it shows, how certain it looks, what it refuses
          to do. If you want the motion half, install his directly — it is not
          reproduced here, and none of the content in this collection is derived
          from it.
        </p>
      </motion.section>

      {/* Closing */}
      <motion.section
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.35 }}
        className="space-y-5 border-t border-zinc-100 pt-10 dark:border-zinc-800"
      >
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          The skills are a side-effect of domain expertise, not a replacement
          for it. They encode judgment developed by making these calls and
          living with what they cost — which is why the examples throughout are
          real projects with real tradeoffs, including the ones where the
          predicted cost landed.
        </p>
        <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          Use them to get to a defensible decision faster. Then go develop the
          expertise yourself; it is the part that compounds.
        </p>
      </motion.section>
    </motion.main>
  );
}
