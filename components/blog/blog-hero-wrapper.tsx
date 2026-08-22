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
  hidden: { opacity: 1 },
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
    // The hero sits at the page's own measure, flush with the left edge the
    // body copy uses — `max-w-5xl mx-auto` centred it inside a 768px column,
    // which reads as a second, narrower page inside the first.
    <motion.div
      className="not-prose mb-16"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <BlogHero {...props} />
    </motion.div>
  );
}
