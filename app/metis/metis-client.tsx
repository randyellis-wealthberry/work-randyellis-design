"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { CometCard } from "@/components/ui/comet-card";
import { CometCardDemo } from "@/components/ui/comet-card-demo";

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

export default function MetisClient() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.main
      className="mx-auto max-w-5xl space-y-16 px-4"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Banner */}
      <motion.section
        className="space-y-8 pt-16 text-center"
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        {/* Hero Banner Image - Half Height */}
        <div className="relative mx-auto mb-8 aspect-[16/4.5] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
          <Image
            src="/images/projects/metis/hero-banner-metis.jpg"
            alt="METIS:LAYER - A Business Strategy AI Agent for Digital Designers"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
          />
        </div>

        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          METIS:LAYER: A Business Strategy AI Agent for Digital Designers
        </h1>

        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          A humble announcement about what I&apos;m building and sharing with
          our design community
        </p>
      </motion.section>

      {/* Main Content */}
      <motion.section
        className="mx-auto max-w-3xl space-y-8"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.1 }}
      >
        <div className="prose prose-lg prose-zinc dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            Dear Design Community,
          </p>

          <p className="mt-6 text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            I&apos;m excited to share something I&apos;ve been working on—a
            project that bridges the gap between design excellence and boardroom
            fluency. METIS represents my commitment to elevating our profession
            and empowering designers to speak the language of business strategy.
          </p>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            This initiative draws inspiration from my upcoming manuscript
            &quot;PROFITS, NOT PIXELS&quot; and years of experience leading
            product teams, scaling design organizations, and witnessing the
            transformative power of AI in our field.
          </p>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            METIS:LAYER will serve as a platform for AI business strategy
            specifically tailored for product designers—helping us move beyond
            pixels to drive meaningful business impact through strategic
            thinking and data-driven design decisions.
          </p>

          <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
            More details will be shared soon as this vision comes to life. Thank
            you for being part of this journey and for your continued dedication
            to pushing our craft forward.
          </p>
        </div>
      </motion.section>

      {/* Signature Section */}
      <motion.section
        className="mx-auto max-w-3xl space-y-6 pb-16 text-left"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.2 }}
      >
        <p className="text-base text-zinc-600 dark:text-zinc-400">Sincerely,</p>

        {/* Signature Image with Left Tilt */}
        <div className="flex justify-start">
          <div className="-rotate-2 transform">
            {mounted && (
              <Image
                src={
                  resolvedTheme === "dark"
                    ? "/images/randyellis-signature.png"
                    : "/images/randyellis-signature-light.png"
                }
                alt="Randy Ellis Handwritten Signature"
                width={200}
                height={80}
                className="opacity-90"
              />
            )}
          </div>
        </div>

        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          Randy Ellis
          <br />
          AI Product Design Engineer
        </p>
      </motion.section>

      {/* Demo Grid Section */}
      <motion.section
        className="flex justify-center pb-16"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.25 }}
      >
        <CometCardDemo />
      </motion.section>

      {/* Comet Card Section */}
      <motion.section
        className="flex justify-center pb-16"
        variants={VARIANTS_SECTION}
        transition={{ ...TRANSITION_SECTION, delay: 0.3 }}
      >
        <CometCard className="mx-auto max-w-md">
          <div className="relative aspect-[3/4] w-full">
            <Image
              src="/images/projects/metis/playercard-metis.png"
              alt="METIS Player Card"
              fill
              className="rounded-2xl object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CometCard>
      </motion.section>
    </motion.main>
  );
}
