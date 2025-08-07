"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

interface ParticleProps {
  id: number;
  color: string;
  size: number;
  x: number;
  y: number;
  onComplete: (id: number) => void;
}

function Particle({ id, color, size, x, y, onComplete }: ParticleProps) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none z-50`}
      style={{
        background: color,
        width: size,
        height: size,
        left: x,
        top: y,
      }}
      initial={{
        scale: 0,
        rotate: 0,
        opacity: 1,
      }}
      animate={{
        scale: [0, 1, 1, 0],
        rotate: [0, 180, 360],
        x: [0, Math.random() * 200 - 100],
        y: [0, -200 - Math.random() * 100],
        opacity: [1, 1, 1, 0],
      }}
      transition={{
        duration: 2 + Math.random(),
        ease: "easeOut",
      }}
      onAnimationComplete={() => onComplete(id)}
    />
  );
}

interface CelebrationParticlesProps {
  isActive: boolean;
  particleCount?: number;
  colors?: string[];
}

export function CelebrationParticles({
  isActive,
  particleCount = 20,
  colors = [
    "linear-gradient(45deg, #ff6b6b, #ee5a52)",
    "linear-gradient(45deg, #4ecdc4, #45b7aa)",
    "linear-gradient(45deg, #45b7d1, #3a9bc1)",
    "linear-gradient(45deg, #f9ca24, #f0932b)",
    "linear-gradient(45deg, #6c5ce7, #5f3dc4)",
    "linear-gradient(45deg, #a8e6cf, #7fcdcd)",
  ],
}: CelebrationParticlesProps) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      color: string;
      size: number;
      x: number;
      y: number;
    }>
  >([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 8,
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 20,
      }));
      setParticles(newParticles);
    }
  }, [isActive, particleCount, colors]);

  const handleParticleComplete = (id: number) => {
    setParticles((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      <AnimatePresence>
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            id={particle.id}
            color={particle.color}
            size={particle.size}
            x={particle.x}
            y={particle.y}
            onComplete={handleParticleComplete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
