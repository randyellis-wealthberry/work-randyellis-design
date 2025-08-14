"use client";

import { motion, useInView } from "motion/react";
import { ReactNode, useRef } from "react";

interface InViewProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  [key: string]: unknown;
}

export function InView({
  children,
  className = "",
  once = true,
  ...props
}: InViewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  return (
    <motion.div
      ref={ref}
      className={className}
      data-testid="in-view"
      data-in-view={isInView ? "true" : "false"}
      {...props}
    >
      {children}
    </motion.div>
  );
}
