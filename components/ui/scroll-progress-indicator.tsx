"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";

interface ScrollProgressIndicatorProps {
  showPercentage?: boolean;
  position?: "top" | "bottom" | "sidebar";
  color?: string;
  thickness?: number;
}

export function ScrollProgressIndicator({
  showPercentage = false,
  position = "top",
  color = "rgb(59, 130, 246)", // blue-500
  thickness = 3,
}: ScrollProgressIndicatorProps) {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    setMounted(true);

    const unsubscribe = scrollYProgress.on("change", (value) => {
      setPercentage(Math.round(value * 100));
    });

    return unsubscribe;
  }, [scrollYProgress]);

  if (!mounted) return null;

  const progressBarClasses = {
    top: "fixed top-0 left-0 right-0 z-50 origin-left",
    bottom: "fixed bottom-0 left-0 right-0 z-50 origin-left",
    sidebar: "fixed right-4 top-1/2 -translate-y-1/2 z-50 w-1 h-32 origin-top",
  };

  const progressStyle = {
    height: position === "sidebar" ? "100%" : `${thickness}px`,
    width: position === "sidebar" ? `${thickness}px` : "100%",
    backgroundColor: color,
  };

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className={progressBarClasses[position]}
        style={{
          ...progressStyle,
          scaleX: position === "sidebar" ? 1 : scaleX,
          scaleY: position === "sidebar" ? scrollYProgress : 1,
        }}
      />

      {/* Percentage Display */}
      {showPercentage && percentage > 5 && (
        <motion.div
          className="fixed bottom-4 right-4 z-50 bg-black/80 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{
            type: "spring" as const,
            stiffness: 400,
            damping: 30,
          }}
        >
          {percentage}%
        </motion.div>
      )}
    </>
  );
}

// Reading time estimator component
export function ReadingTimeIndicator({
  wordCount,
  wordsPerMinute = 200,
}: {
  wordCount: number;
  wordsPerMinute?: number;
}) {
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  const { scrollYProgress } = useScroll();
  const [readProgress, setReadProgress] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (value) => {
      setReadProgress(value);
    });

    return unsubscribe;
  }, [scrollYProgress]);

  const timeRemaining = Math.max(
    0,
    Math.round(readingTime * (1 - readProgress)),
  );

  return (
    <motion.div
      className="fixed bottom-4 left-4 z-50 bg-white/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-700 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm shadow-lg"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1 }}
    >
      <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        {timeRemaining > 0 ? (
          <span>{timeRemaining} min left</span>
        ) : (
          <span>✓ Complete</span>
        )}
      </div>
    </motion.div>
  );
}
