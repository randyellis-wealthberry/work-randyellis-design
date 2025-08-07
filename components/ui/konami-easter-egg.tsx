"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useMemo } from "react";
import {
  Heart,
  Star,
  Sparkles,
  Trophy,
  Zap,
  Coffee,
  LucideIcon,
} from "lucide-react";

interface KonamiEasterEggProps {
  isActive: boolean;
}

export function KonamiEasterEgg({ isActive }: KonamiEasterEggProps) {
  const [showMessage, setShowMessage] = useState(false);
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; icon: LucideIcon; color: string }>
  >([]);

  const icons = useMemo(() => [Heart, Star, Sparkles, Trophy, Zap, Coffee], []);
  const colors = useMemo(
    () => [
      "text-red-500",
      "text-yellow-500",
      "text-blue-500",
      "text-green-500",
      "text-purple-500",
      "text-pink-500",
    ],
    [],
  );

  useEffect(() => {
    if (isActive) {
      setShowMessage(true);

      // Create floating particles
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        icon: icons[Math.floor(Math.random() * icons.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setShowMessage(false);
        setParticles([]);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isActive, icons, colors]);

  return (
    <AnimatePresence>
      {showMessage && (
        <>
          {/* Floating particles */}
          {particles.map((particle) => {
            const Icon = particle.icon;
            return (
              <motion.div
                key={particle.id}
                className={`fixed pointer-events-none z-50 ${particle.color}`}
                style={{
                  left: particle.x,
                  top: particle.y,
                }}
                initial={{ scale: 0, rotate: 0, opacity: 0 }}
                animate={{
                  scale: [0, 1, 1, 0],
                  rotate: [0, 180, 360],
                  opacity: [0, 1, 1, 0],
                  x: [0, Math.random() * 200 - 100],
                  y: [0, -200 - Math.random() * 100],
                }}
                transition={{
                  duration: 4,
                  delay: Math.random() * 1,
                  ease: "easeOut",
                }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
            );
          })}

          {/* Message */}
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl shadow-2xl text-center"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                🎉 Secret Designer Mode Activated! 🎉
              </motion.div>
              <motion.p
                className="text-sm mt-2 opacity-90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                You found the hidden celebration! ✨<br />
                Thanks for being so engaged with design! 🎨
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
