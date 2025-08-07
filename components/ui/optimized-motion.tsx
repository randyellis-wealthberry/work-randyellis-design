"use client";

import { motion, MotionProps } from "motion/react";
import { forwardRef, ReactNode } from "react";

// Optimized motion components with performance-first defaults

interface OptimizedMotionProps extends MotionProps {
  children: ReactNode;
  reduceMotion?: boolean;
  className?: string;
}

// Optimized div component with reduced motion support
export const OptimizedMotionDiv = forwardRef<
  HTMLDivElement,
  OptimizedMotionProps
>(({ children, reduceMotion = false, className = "", ...props }, ref) => {
  const optimizedProps = reduceMotion
    ? {
        // Static props for reduced motion
        ...props,
        animate: undefined,
        whileHover: undefined,
        whileTap: undefined,
        initial: { opacity: 1 },
      }
    : {
        // Performance-optimized defaults
        transition: { duration: 0.2, ease: "easeOut" as const },
        ...props,
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      {...optimizedProps}
      // Force hardware acceleration for smoother animations
      style={{
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        perspective: "1000px",
        ...props.style,
      }}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotionDiv.displayName = "OptimizedMotionDiv";

// Optimized section component for staggered animations
export const OptimizedMotionSection = forwardRef<
  HTMLElement,
  OptimizedMotionProps
>(({ children, reduceMotion = false, className = "", ...props }, ref) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.3,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.section
      ref={ref}
      className={className}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "50px" }}
      {...props}
    >
      {children}
    </motion.section>
  );
});

OptimizedMotionSection.displayName = "OptimizedMotionSection";

// Optimized card hover component
export const OptimizedMotionCard = forwardRef<
  HTMLDivElement,
  OptimizedMotionProps
>(({ children, reduceMotion = false, className = "", ...props }, ref) => {
  const cardProps = reduceMotion
    ? {
        ...props,
        whileHover: undefined,
        whileTap: undefined,
      }
    : {
        whileHover: { scale: 1.01, transition: { duration: 0.2 } },
        whileTap: { scale: 0.99, transition: { duration: 0.1 } },
        ...props,
      };

  return (
    <motion.div
      ref={ref}
      className={className}
      {...cardProps}
      // Optimize for compositing
      style={{
        willChange: "transform",
        ...props.style,
      }}
    >
      {children}
    </motion.div>
  );
});

OptimizedMotionCard.displayName = "OptimizedMotionCard";

// Performance-optimized stagger container
interface StaggerContainerProps extends OptimizedMotionProps {
  staggerDelay?: number;
}

export const OptimizedStaggerContainer = forwardRef<
  HTMLDivElement,
  StaggerContainerProps
>(
  (
    {
      children,
      reduceMotion = false,
      staggerDelay = 0.1,
      className = "",
      ...props
    },
    ref,
  ) => {
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: reduceMotion ? 0 : staggerDelay,
          delayChildren: reduceMotion ? 0 : 0.1,
        },
      },
    };

    return (
      <motion.div
        ref={ref}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        {children}
      </motion.div>
    );
  },
);

OptimizedStaggerContainer.displayName = "OptimizedStaggerContainer";

// Utility function to create performance-optimized variants
export const createOptimizedVariants = (reduceMotion: boolean) => ({
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.1,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.25,
        ease: "easeOut" as const,
      },
    },
  },
  card: {
    hover: reduceMotion
      ? {}
      : {
          scale: 1.01,
          transition: { duration: 0.2 },
        },
    tap: reduceMotion
      ? {}
      : {
          scale: 0.99,
          transition: { duration: 0.1 },
        },
  },
});

// Performance monitoring hook for animations
export const useAnimationPerformance = () => {
  const logAnimationStart = (animationName: string) => {
    if (process.env.NODE_ENV === "development") {
      performance.mark(`animation-${animationName}-start`);
    }
  };

  const logAnimationEnd = (animationName: string) => {
    if (process.env.NODE_ENV === "development") {
      performance.mark(`animation-${animationName}-end`);
      performance.measure(
        `animation-${animationName}`,
        `animation-${animationName}-start`,
        `animation-${animationName}-end`,
      );
    }
  };

  return { logAnimationStart, logAnimationEnd };
};
