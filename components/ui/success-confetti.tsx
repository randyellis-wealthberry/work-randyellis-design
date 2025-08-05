"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface SuccessConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
  intensity?: "light" | "medium" | "heavy";
  colors?: string[];
}

const defaultColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-purple-500",
  "bg-pink-500",
];

export function SuccessConfetti({
  trigger,
  onComplete,
  intensity = "medium",
  colors = defaultColors,
}: SuccessConfettiProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      x: number;
      y: number;
      color: string;
      rotation: number;
      velocity: { x: number; y: number };
    }>
  >([]);

  const particleCount = {
    light: 20,
    medium: 50,
    heavy: 100,
  }[intensity];

  useEffect(() => {
    if (!trigger) return;

    // Generate particles
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      velocity: {
        x: (Math.random() - 0.5) * 10,
        y: Math.random() * 3 + 2,
      },
    }));

    setParticles(newParticles);

    // Clean up after animation
    const timeout = setTimeout(() => {
      setParticles([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timeout);
  }, [trigger, particleCount, colors, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-3 h-3 ${particle.color} rounded-sm`}
            initial={{
              x: particle.x,
              y: particle.y,
              rotate: particle.rotation,
              scale: 1,
            }}
            animate={{
              x: particle.x + particle.velocity.x * 50,
              y: window.innerHeight + 50,
              rotate: particle.rotation + 720,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeOut",
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Celebration burst for specific actions
export function CelebrationBurst({
  x,
  y,
  trigger,
  onComplete,
}: {
  x: number;
  y: number;
  trigger: boolean;
  onComplete?: () => void;
}) {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsActive(true);
      const timeout = setTimeout(() => {
        setIsActive(false);
        onComplete?.();
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {/* Central burst */}
      <motion.div
        className="absolute w-4 h-4 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.5, 0] }}
        transition={{ duration: 0.6 }}
      />

      {/* Radiating particles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45 * (Math.PI / 180);
        const distance = 60;

        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
            initial={{ x: 0, y: 0, scale: 0 }}
            animate={{
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: i * 0.05,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

// Success checkmark with satisfying animation
export function SuccessCheckmark({
  trigger,
  size = "md",
  onComplete,
}: {
  trigger: boolean;
  size?: "sm" | "md" | "lg";
  onComplete?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [trigger, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`${sizeClasses[size]} bg-green-500 rounded-full flex items-center justify-center shadow-lg`}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              type: "spring" as const,
              stiffness: 300,
              damping: 20,
            }}
          >
            <motion.svg
              className={`${iconSizes[size]} text-white`}
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
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </motion.svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
