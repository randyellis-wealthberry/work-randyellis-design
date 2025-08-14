"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface AnimatedGroupProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  [key: string]: unknown;
}

export function AnimatedGroup({
  children,
  className = "",
  staggerDelay = 0.1,
  ...props
}: AnimatedGroupProps) {
  // Extract non-DOM props
  const { staggerDelay: propStaggerDelay, ...domProps } = props;
  const finalStaggerDelay = propStaggerDelay || staggerDelay;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.6,
        staggerChildren: (finalStaggerDelay as number) || 0.1,
      }}
      data-testid="animated-group"
      {...domProps}
    >
      {children}
    </motion.div>
  );
}
