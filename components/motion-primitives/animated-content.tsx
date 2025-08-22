"use client";

import { cn } from "@/lib/utils";
import { motion, Variants } from "motion/react";
import { ReactNode, useMemo } from "react";

interface AnimatedContentProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  staggerDirection?: "top" | "bottom" | "left" | "right";
  duration?: number;
  once?: boolean;
  threshold?: number;
  distance?: number;
  as?: "div" | "section" | "article" | "main" | "aside";
}

export function AnimatedContent({
  children,
  className,
  staggerDelay = 0.1,
  staggerDirection = "top",
  duration = 0.6,
  once = true,
  threshold = 0.1,
  distance = 20,
  as = "div",
}: AnimatedContentProps) {
  const variants: Variants = useMemo(() => {
    const getInitialPosition = () => {
      switch (staggerDirection) {
        case "top":
          return { y: -distance, x: 0 };
        case "bottom":
          return { y: distance, x: 0 };
        case "left":
          return { y: 0, x: -distance };
        case "right":
          return { y: 0, x: distance };
        default:
          return { y: -distance, x: 0 };
      }
    };

    return {
      hidden: {
        opacity: 0,
        ...getInitialPosition(),
      },
      visible: {
        opacity: 1,
        y: 0,
        x: 0,
        transition: {
          duration,
          ease: [0.25, 0.1, 0.25, 1], // Custom easing for smooth professional feel
          staggerChildren: staggerDelay,
        },
      },
    };
  }, [staggerDirection, distance, duration, staggerDelay]);

  const MotionComponent =
    as === "section"
      ? motion.section
      : as === "article"
        ? motion.article
        : as === "main"
          ? motion.main
          : as === "aside"
            ? motion.aside
            : motion.div;

  return (
    <MotionComponent
      initial="hidden"
      whileInView="visible"
      viewport={{
        once,
        amount: threshold,
        margin: "0px 0px -50px 0px", // Start animation slightly before element comes into view
      }}
      variants={variants}
      className={cn(
        "transform-gpu", // Enable GPU acceleration for better performance
        className,
      )}
      style={{
        willChange: "transform, opacity", // Optimize for animations
      }}
    >
      {children}
    </MotionComponent>
  );
}

// Child component for use within AnimatedContent for individual stagger items
export function AnimatedContentItem({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 10,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <motion.div
      variants={itemVariants}
      className={cn("transform-gpu", className)}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
