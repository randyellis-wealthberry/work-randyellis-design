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

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
          initial={{
            x:
              Math.random() *
              (typeof window !== "undefined" ? window.innerWidth : 1200),
            y:
              Math.random() *
              (typeof window !== "undefined" ? window.innerHeight : 800),
          }}
          animate={{
            x: mousePosition.x + (Math.random() - 0.5) * 200,
            y: mousePosition.y + (Math.random() - 0.5) * 200,
          }}
          transition={{
            duration: 2,
            ease: "easeOut",
            delay: i * 0.1,
          }}
        />
      ))}

      <div className="text-center space-y-8 px-4 max-w-2xl relative z-10">
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
            className="text-8xl md:text-9xl font-bold text-zinc-800 dark:text-zinc-200 select-none"
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
          className="h-16 flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p
            key={currentMessage}
            className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-medium"
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

          <div className="flex flex-wrap gap-3 justify-center">
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
            className="text-sm text-zinc-500 dark:text-zinc-400 cursor-pointer select-none"
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
