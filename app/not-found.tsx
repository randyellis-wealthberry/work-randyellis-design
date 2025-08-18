"use client";

import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { EnhancedButton } from "@/components/ui/enhanced-button";
import { Magnetic } from "@/components/ui/magnetic";

const funMessages = [
  "Oops! This page took a wrong turn at Albuquerque.",
  "404: Page not found, but your sense of adventure is!",
  "This page is playing hide and seek... and winning.",
  "Lost? Don't worry, even GPS gets confused sometimes.",
  "This page went on vacation and forgot to leave a note.",
  "Error 404: Page missing, probably making coffee.",
];

export default function NotFound() {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentMessage((prev) => (prev + 1) % funMessages.length);
        setIsAnimating(false);
      }, 300);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // Generate stable particle positions to avoid hydration mismatch
  const [particlePositions, setParticlePositions] = useState<
    Array<{ x: number; y: number; offsetX: number; offsetY: number }>
  >([]);

  useEffect(() => {
    // Generate random positions only on client side
    const positions = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      offsetX: (Math.random() - 0.5) * 200,
      offsetY: (Math.random() - 0.5) * 200,
    }));
    setParticlePositions(positions);
  }, []);

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900"
      onMouseMove={handleMouseMove}
    >
      {/* Floating particles */}
      {particlePositions.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute h-2 w-2 rounded-full bg-blue-400/30"
          initial={{
            x: pos.x,
            y: pos.y,
          }}
          animate={{
            x: mousePosition.x + pos.offsetX,
            y: mousePosition.y + pos.offsetY,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: i * 0.1,
          }}
        />
      ))}

      <div className="relative z-10 max-w-2xl space-y-8 px-4 text-center">
        {/* 404 Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring" as const,
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <motion.h1
            className="text-8xl font-bold text-zinc-800 select-none md:text-9xl dark:text-zinc-200"
            whileHover={{
              scale: 1.1,
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.5 },
            }}
          >
            <Magnetic intensity={0.3}>
              <span className="inline-block">4</span>
            </Magnetic>
            <motion.span
              className="inline-block text-blue-500"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{
                rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                scale: { duration: 1, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              0
            </motion.span>
            <Magnetic intensity={0.3}>
              <span className="inline-block">4</span>
            </Magnetic>
          </motion.h1>
        </motion.div>

        {/* Dynamic Message */}
        <motion.div
          className="flex h-16 items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            key={currentMessage}
            className="text-xl font-medium text-zinc-600 md:text-2xl dark:text-zinc-400"
            initial={{ opacity: 0, y: 20, rotateX: -90 }}
            animate={{
              opacity: isAnimating ? 0 : 1,
              y: isAnimating ? -20 : 0,
              rotateX: isAnimating ? 90 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {funMessages[currentMessage]}
          </motion.p>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <h3 className="text-lg font-medium text-zinc-700 dark:text-zinc-300">
            While you&apos;re here, why not:
          </h3>

          <div className="flex flex-wrap justify-center gap-3">
            {[
              { text: "Go Home", href: "/", primary: true },
              { text: "View Projects", href: "/projects" },
              { text: "About Me", href: "/about" },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
              >
                <EnhancedButton
                  variant={item.primary ? "primary" : "secondary"}
                  size="md"
                  delightLevel="playful"
                  onClick={() => (window.location.href = item.href)}
                  className="min-w-[120px]"
                >
                  {item.text}
                </EnhancedButton>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Easter Egg */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.p
            className="cursor-pointer text-sm text-zinc-500 select-none dark:text-zinc-400"
            whileHover={{
              scale: 1.05,
              color: "rgb(59, 130, 246)",
            }}
            onClick={() => {
              const messages = [
                "🎉 You found the easter egg!",
                "🚀 Welcome to the secret club!",
                "✨ You're clearly a person of culture!",
                "🎨 Design detective level: Expert",
              ];
              const randomMessage =
                messages[Math.floor(Math.random() * messages.length)];
              alert(randomMessage);
            }}
          >
            💡 Psst... click me for a surprise
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}
