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

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
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
      className="space-y-8 pt-16 text-center"
      variants={VARIANTS_SECTION}
      transition={TRANSITION_SECTION}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Banner Image - Matching METIS aspect ratio */}
      <div className="relative mx-auto mb-8 aspect-[16/4.5] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
        <Image
          src={heroImage}
          alt={heroAlt || title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
        />
      </div>

      {/* Title and Description */}
      <div className="space-y-4">
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          {title}
        </h1>
        
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-zinc-600 dark:text-zinc-400">
          {description}
        </p>
        
        {/* Author and Date */}
        {(author || date) && (
          <div className="flex items-center justify-center space-x-4 text-sm text-zinc-500 dark:text-zinc-400">
            {author && <span>By {author}</span>}
            {author && date && <span>•</span>}
            {date && <span>{new Date(date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>}
          </div>
        )}
      </div>
    </motion.section>
  );
}