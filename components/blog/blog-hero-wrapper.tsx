"use client";
import { motion } from "motion/react";
import { BlogHero } from "./blog-hero";

interface BlogHeroWrapperProps {
  title: string;
  description: string;
  heroImage?: string;
  heroAlt?: string;
  author?: string;
  date?: string;
}

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

export function BlogHeroWrapper(props: BlogHeroWrapperProps) {
  const { heroImage } = props;
  
  // Only render if there's a hero image
  if (!heroImage) return null;

  return (
    <motion.div
      className="mx-auto max-w-5xl space-y-16 px-4 mb-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <BlogHero {...props} />
    </motion.div>
  );
}