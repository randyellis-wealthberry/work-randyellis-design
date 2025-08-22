"use client";

import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";
import { ReactNode, useState } from "react";

interface FadeContentProps {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
  duration?: number;
  delay?: number;
  once?: boolean;
  threshold?: number;
  triggerOnce?: boolean;
  cascade?: boolean;
  cascadeDelay?: number;
}

export function FadeContent({
  children,
  className,
  direction = "up",
  distance = 30,
  duration = 0.6,
  delay = 0,
  once = true,
  threshold = 0.1,
  triggerOnce = true,
  cascade = false,
  cascadeDelay = 0.1,
}: FadeContentProps) {
  const [, setHasAnimated] = useState(false);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const getInitialState = () => {
    if (prefersReducedMotion) {
      return { opacity: 1, x: 0, y: 0 };
    }

    switch (direction) {
      case "up":
        return { opacity: 0, y: distance, x: 0 };
      case "down":
        return { opacity: 0, y: -distance, x: 0 };
      case "left":
        return { opacity: 0, x: distance, y: 0 };
      case "right":
        return { opacity: 0, x: -distance, y: 0 };
      case "fade":
      default:
        return { opacity: 0, x: 0, y: 0 };
    }
  };

  const variants: Variants = {
    hidden: getInitialState(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for professional feel
        ...(cascade && {
          staggerChildren: cascadeDelay,
          delayChildren: delay,
        }),
      },
    },
  };

  const handleAnimationComplete = () => {
    if (triggerOnce) {
      setHasAnimated(true);
    }
  };

  // If reduced motion is preferred, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{
        once: once && triggerOnce,
        amount: threshold,
        margin: "0px 0px -20px 0px",
      }}
      variants={variants}
      onAnimationComplete={handleAnimationComplete}
      className={cn("transform-gpu", className)}
      style={{
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}

// Progressive disclosure component for revealing content in sequence
export function ProgressiveDisclosure({
  children,
  className,
  staggerDelay = 0.15,
  direction = "up",
  distance = 20,
  duration = 0.5,
}: {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
  distance?: number;
  duration?: number;
}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const getChildInitial = () => {
    if (prefersReducedMotion) {
      return { opacity: 1, x: 0, y: 0 };
    }

    switch (direction) {
      case "up":
        return { opacity: 0, y: distance };
      case "down":
        return { opacity: 0, y: -distance };
      case "left":
        return { opacity: 0, x: distance };
      case "right":
        return { opacity: 0, x: -distance };
      case "fade":
      default:
        return { opacity: 0 };
    }
  };

  const childVariants: Variants = {
    hidden: getChildInitial(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  if (prefersReducedMotion) {
    return (
      <div className={className}>
        {children.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
      className={cn("transform-gpu", className)}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={childVariants}
          className="transform-gpu"
          style={{ willChange: "transform, opacity" }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Hook for manual trigger control
export function useFadeContent(initialState = false) {
  const [isVisible, setIsVisible] = useState(initialState);

  const show = () => setIsVisible(true);
  const hide = () => setIsVisible(false);
  const toggle = () => setIsVisible(!isVisible);

  return { isVisible, show, hide, toggle };
}
