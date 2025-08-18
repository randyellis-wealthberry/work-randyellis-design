"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll } from "motion/react";
import { ChevronUp, Rocket, ArrowUp } from "lucide-react";
import { Magnetic } from "@/components/ui/magnetic";

interface ScrollToTopProps {
  threshold?: number;
  personality?: "minimal" | "playful" | "rocket";
  position?: "bottom-right" | "bottom-left" | "bottom-center";
}

export function ScrollToTop({
  threshold = 400,
  personality = "playful",
  position = "bottom-right",
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsVisible(latest > threshold);
    });

    return unsubscribe;
  }, [scrollY, threshold]);

  const scrollToTop = () => {
    setIsClicked(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reset click state after animation
    setTimeout(() => setIsClicked(false), 1000);
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  const personalities = {
    minimal: {
      icon: ArrowUp,
      bgClass: "bg-zinc-900 dark:bg-zinc-100",
      iconClass: "text-white dark:text-zinc-900",
      hoverScale: 1.05,
      animation: {
        hover: { y: -2 },
        tap: { scale: 0.95 },
      },
    },
    playful: {
      icon: ChevronUp,
      bgClass: "bg-blue-500 hover:bg-blue-600",
      iconClass: "text-white",
      hoverScale: 1.1,
      animation: {
        hover: { y: -4, rotate: [0, -5, 5, 0] },
        tap: { scale: 0.9 },
      },
    },
    rocket: {
      icon: Rocket,
      bgClass:
        "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600",
      iconClass: "text-white",
      hoverScale: 1.15,
      animation: {
        hover: { y: -6, rotate: [0, -10, 10, 0] },
        tap: { scale: 0.85, rotate: 45 },
      },
    },
  };

  const config = personalities[personality];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`fixed ${positionClasses[position]} pointer-events-none z-40`}
          initial={{ opacity: 0, scale: 0, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 50 }}
          transition={{
            type: "spring" as const,
            stiffness: 200,
            damping: 15,
          }}
        >
          <Magnetic intensity={0.3}>
            <motion.button
              onClick={scrollToTop}
              className={`group pointer-events-auto relative h-12 w-12 overflow-hidden rounded-full shadow-lg transition-all duration-300 ${config.bgClass} hover:shadow-xl focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none`}
              whileHover={config.animation.hover}
              whileTap={config.animation.tap}
              aria-label="Scroll to top"
            >
              {/* Background pulse effect */}
              <motion.div
                className="absolute inset-0 rounded-full bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                animate={
                  isClicked
                    ? {
                        scale: [0, 1.5, 2],
                        opacity: [0, 0.3, 0],
                      }
                    : {}
                }
                transition={{ duration: 0.6, ease: "easeOut" }}
              />

              {/* Icon */}
              <motion.div
                className="relative z-10 flex h-full w-full items-center justify-center"
                animate={
                  isClicked && personality === "rocket"
                    ? {
                        y: [-20, 0],
                        transition: { duration: 0.5, ease: "easeOut" },
                      }
                    : {}
                }
              >
                <IconComponent className={`h-5 w-5 ${config.iconClass}`} />
              </motion.div>

              {/* Rocket trail effect */}
              {personality === "rocket" && isClicked && (
                <motion.div
                  className="absolute bottom-0 left-1/2 w-1 -translate-x-1/2 rounded-full bg-orange-400"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: [0, 20, 0],
                    opacity: [0, 1, 0],
                    y: [0, 10, 20],
                  }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              )}

              {/* Progress ring for playful mode */}
              {personality === "playful" && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, white ${(scrollY.get() / (document.documentElement.scrollHeight - window.innerHeight)) * 360}deg, transparent ${(scrollY.get() / (document.documentElement.scrollHeight - window.innerHeight)) * 360}deg)`,
                  }}
                />
              )}
            </motion.button>
          </Magnetic>

          {/* Tooltip */}
          <motion.div
            className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded bg-zinc-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:bg-zinc-100 dark:text-zinc-900"
            initial={{ y: 10, opacity: 0 }}
            whileHover={{ y: 0, opacity: 1 }}
          >
            {personality === "rocket" ? "Blast off!" : "Back to top"}
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-zinc-900 dark:bg-zinc-100" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Quick access version for minimal implementation
export function QuickScrollToTop() {
  return <ScrollToTop personality="minimal" position="bottom-right" />;
}

// Fun version for creative portfolios
export function FunScrollToTop() {
  return <ScrollToTop personality="rocket" position="bottom-right" />;
}
