"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface LoadingCelebrationProps {
  isLoading: boolean;
  loadingMessages?: string[];
  successMessage?: string;
  onComplete?: () => void;
}

const defaultMessages = [
  "Crafting pixel-perfect experiences...",
  "Optimizing for delight...",
  "Adding a sprinkle of magic...",
  "Preparing something awesome...",
  "Loading with love...",
];

export function LoadingCelebration({
  isLoading,
  loadingMessages = defaultMessages,
  successMessage = "Ready to impress!",
  onComplete,
}: LoadingCelebrationProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isLoading, onComplete]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isLoading, loadingMessages.length]);

  return (
    <AnimatePresence>
      {(isLoading || showSuccess) && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-6 text-center">
            {isLoading ? (
              <>
                {/* Loading Animation */}
                <motion.div
                  className="relative mx-auto h-16 w-16"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full border-4 border-zinc-200 dark:border-zinc-700" />
                  <motion.div
                    className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Loading Message */}
                <AnimatePresence mode="wait">
                  <motion.p
                    key={currentMessageIndex}
                    className="text-lg font-medium text-zinc-700 dark:text-zinc-300"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {loadingMessages[currentMessageIndex]}
                  </motion.p>
                </AnimatePresence>
              </>
            ) : (
              <>
                {/* Success Animation */}
                <motion.div
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring" as const,
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <motion.svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </motion.div>

                <motion.p
                  className="text-lg font-medium text-green-600 dark:text-green-400"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {successMessage}
                </motion.p>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Skeleton loader with personality
export function PersonalitySkeletonLoader({
  lines = 3,
  showAvatar = false,
  className = "",
}: {
  lines?: number;
  showAvatar?: boolean;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {showAvatar && (
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="h-10 w-10 animate-pulse rounded-full bg-gradient-to-br from-blue-400 to-purple-500" />
          <div className="space-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
            <div className="h-3 w-16 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700" />
          </div>
        </motion.div>
      )}

      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            className="h-4 animate-pulse rounded bg-zinc-200 dark:bg-zinc-700"
            style={{ width: `${Math.random() * 40 + 60}%` }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 + 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

// Fun loading states for different contexts
export function ProjectLoadingState() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="flex flex-col items-center justify-center space-y-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="font-medium text-zinc-600 dark:text-zinc-400">
        Loading amazing projects{dots}
      </p>
    </motion.div>
  );
}
