"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface Particle {
  id: string;
  x: number;
  y: number;
  size: number;
  color: string;
  velocity: {
    x: number;
    y: number;
  };
  life: number;
  maxLife: number;
}

interface DelightParticlesProps {
  /** Trigger the particle burst */
  trigger?: boolean;
  /** Number of particles to spawn */
  particleCount?: number;
  /** Colors for the particles */
  colors?: string[];
  /** Size range for particles */
  sizeRange?: [number, number];
  /** Duration of the effect in milliseconds */
  duration?: number;
  /** Container className */
  className?: string;
  /** Respect reduced motion preferences */
  respectReducedMotion?: boolean;
  /** Callback when effect completes */
  onComplete?: () => void;
}

/**
 * Delightful Particle System
 *
 * Creates a burst of colorful particles for celebration moments.
 * Perfect for achievements, button clicks, and other joyful interactions.
 *
 * Features:
 * - Configurable particle count, colors, and sizes
 * - Physics-based movement with gravity
 * - Respects prefers-reduced-motion
 * - Accessible (doesn't interfere with screen readers)
 * - Performance optimized with cleanup
 */
export const DelightParticles: React.FC<DelightParticlesProps> = ({
  trigger = false,
  particleCount = 12,
  colors = ["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b", "#ef4444"],
  sizeRange = [4, 8],
  duration = 2000,
  className,
  respectReducedMotion = true,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for prefers-reduced-motion
  useEffect(() => {
    if (!respectReducedMotion) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [respectReducedMotion]);

  // Generate a random particle
  const createParticle = useCallback((): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const velocity = 100 + Math.random() * 100;
    const size = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: 0,
      y: 0,
      size,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocity: {
        x: Math.cos(angle) * velocity,
        y: Math.sin(angle) * velocity,
      },
      life: 1,
      maxLife: duration,
    };
  }, [colors, sizeRange, duration]);

  // Trigger particle burst
  useEffect(() => {
    if (!trigger || prefersReducedMotion || isAnimating) return;

    setIsAnimating(true);
    const newParticles = Array.from({ length: particleCount }, createParticle);
    setParticles(newParticles);

    // Start animation loop
    const startTime = Date.now();
    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      if (elapsed >= duration) {
        setParticles([]);
        setIsAnimating(false);
        onComplete?.();
        return;
      }

      setParticles((prevParticles) =>
        prevParticles.map((particle) => ({
          ...particle,
          x: particle.x + particle.velocity.x * 0.016, // ~60fps
          y: particle.y + particle.velocity.y * 0.016 + elapsed * 0.0001, // gravity
          velocity: {
            ...particle.velocity,
            y: particle.velocity.y + 300 * 0.016, // gravity acceleration
          },
          life: Math.max(0, 1 - elapsed / duration),
        })),
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [
    trigger,
    prefersReducedMotion,
    isAnimating,
    particleCount,
    createParticle,
    duration,
    onComplete,
  ]);

  if (prefersReducedMotion || !trigger) {
    return null;
  }

  return (
    <div
      className={cn(
        "absolute inset-0 pointer-events-none overflow-hidden z-50",
        className,
      )}
      role="presentation"
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              left: `calc(50% + ${particle.x}px)`,
              top: `calc(50% + ${particle.y}px)`,
            }}
            initial={{
              scale: 0,
              opacity: 0,
            }}
            animate={{
              scale: [0, 1.2, 1],
              opacity: particle.life,
            }}
            exit={{
              scale: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Confetti Burst Hook
 *
 * Provides a simple trigger function for particle effects
 */
export const useConfetti = () => {
  const [shouldTrigger, setShouldTrigger] = useState(false);

  const burst = useCallback(() => {
    setShouldTrigger(true);
    setTimeout(() => setShouldTrigger(false), 100);
  }, []);

  const reset = useCallback(() => {
    setShouldTrigger(false);
  }, []);

  return {
    trigger: shouldTrigger,
    burst,
    reset,
  };
};

/**
 * Achievement Toast Component
 *
 * Shows a delightful achievement notification with particles
 */
interface AchievementToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  icon?: string;
  duration?: number;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({
  message,
  show,
  onClose,
  icon = "✨",
  duration = 3000,
}) => {
  const { trigger, burst } = useConfetti();

  useEffect(() => {
    if (show) {
      burst();
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [show, burst, onClose, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.8, x: 100 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 300,
          }}
        >
          <div className="relative bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 p-4 min-w-[280px]">
            <div className="flex items-center gap-3">
              <span className="text-2xl" role="img" aria-label="Achievement">
                {icon}
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {message}
              </span>
            </div>

            <DelightParticles
              trigger={trigger}
              particleCount={15}
              colors={["#06b6d4", "#3b82f6", "#8b5cf6", "#f59e0b"]}
              className="absolute inset-0"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
