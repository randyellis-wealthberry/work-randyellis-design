"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SuccessConfetti } from "@/components/ui/success-confetti";

// Konami code easter egg
export function KonamiEasterEgg() {
  const [sequence, setSequence] = useState<string[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const konamiCode = useMemo(
    () => [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "KeyB",
      "KeyA",
    ],
    [],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...sequence, e.code].slice(-konamiCode.length);
      setSequence(newSequence);

      if (newSequence.join(",") === konamiCode.join(",")) {
        setShowEasterEgg(true);
        setShowConfetti(true);
        setSequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sequence, konamiCode]);

  return (
    <>
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowEasterEgg(false)}
          >
            <motion.div
              className="bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-2xl max-w-md text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{
                type: "spring" as const,
                stiffness: 200,
                damping: 15,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                🎮
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
                Konami Code Activated!
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                You&apos;ve unlocked the classic gaming easter egg! Welcome to
                the exclusive club of retro gamers.
              </p>
              <motion.button
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => setShowEasterEgg(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Awesome!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessConfetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
        intensity="heavy"
      />
    </>
  );
}

// Click counter easter egg
export function ClickCounterEasterEgg({
  targetClicks = 10,
}: {
  targetClicks?: number;
}) {
  const [clicks, setClicks] = useState(0);
  const [showReward, setShowReward] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleClick = () => {
    const newCount = clicks + 1;
    setClicks(newCount);

    if (newCount === targetClicks) {
      setShowReward(true);
      setShowConfetti(true);
      setTimeout(() => setClicks(0), 3000);
    }
  };

  return (
    <>
      <motion.div
        className="inline-block cursor-pointer select-none"
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        animate={clicks > 0 ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        🎨
      </motion.div>

      <AnimatePresence>
        {showReward && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: "spring" as const,
              stiffness: 200,
              damping: 15,
            }}
          >
            <div className="flex items-center gap-2">
              <motion.span
                className="text-2xl"
                animate={{ rotate: [0, 20, -20, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                🏆
              </motion.span>
              <div>
                <div className="font-bold">Persistence Pays!</div>
                <div className="text-sm opacity-90">
                  You clicked {targetClicks} times!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SuccessConfetti
        trigger={showConfetti}
        onComplete={() => setShowConfetti(false)}
        intensity="medium"
      />
    </>
  );
}

// Time-based easter egg (user has been on site for a while)
export function TimeBasedEasterEgg({
  delayMinutes = 2,
}: {
  delayMinutes?: number;
}) {
  const [showMessage, setShowMessage] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);

    const timer = setTimeout(
      () => {
        setShowMessage(true);
      },
      delayMinutes * 60 * 1000,
    );

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [delayMinutes]);

  return (
    <AnimatePresence>
      {showMessage && (
        <motion.div
          className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring" as const, stiffness: 200, damping: 15 }}
        >
          <div className="flex items-start gap-3">
            <motion.span
              className="text-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
            >
              ☕
            </motion.span>
            <div className="flex-1">
              <div className="font-bold mb-1">Still here?</div>
              <div className="text-sm opacity-90 mb-2">
                You&apos;ve been exploring for {Math.floor(timeSpent / 60)}{" "}
                minutes! Want to grab a coffee and chat about a project?
              </div>
              <motion.button
                className="text-xs bg-white/20 px-3 py-1 rounded hover:bg-white/30 transition-colors"
                onClick={() => setShowMessage(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Maybe later
              </motion.button>
            </div>
            <button
              onClick={() => setShowMessage(false)}
              className="text-white/60 hover:text-white text-lg leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Secret message in browser console
export function ConsoleEasterEgg() {
  useEffect(() => {
    const messages = [
      "%c🎨 Well hello there, fellow developer!",
      "color: #3b82f6; font-size: 16px; font-weight: bold;",

      "%cYou found the secret developer message! 🕵️‍♂️",
      "color: #8b5cf6; font-size: 14px;",

      "%cSince you're here poking around in the console, you clearly have good taste in exploring web experiences.",
      "color: #10b981; font-size: 12px;",

      "%cThis portfolio was built with:",
      "color: #f59e0b; font-size: 12px; font-weight: bold;",

      "%c• Next.js 15 with App Router\n• React 19\n• Motion/Framer Motion\n• Tailwind CSS v4\n• TypeScript\n• A lot of coffee ☕",
      "color: #6b7280; font-size: 11px; line-height: 1.5;",

      "%cWant to build something amazing together? Let's talk!",
      "color: #ef4444; font-size: 14px; font-weight: bold;",

      "%cmailto:hello@randyellis.design",
      "color: #3b82f6; font-size: 12px; text-decoration: underline;",
    ];

    // Log messages with styling
    for (let i = 0; i < messages.length; i += 2) {
      console.log(messages[i], messages[i + 1] || "");
    }

    // Add some ASCII art for fun
    console.log(
      `
%c
    ____            __         ______
   / __ \____ _____/ /_  __   / ____/
  / /_/ / __ \`/ __  / / / /  / __/   
 / _, _/ /_/ / /_/ / /_/ /  / /___   
/_/ |_|\____/\__,_/\__, /  /_____/   
                 /____/             

`,
      "color: #3b82f6; font-family: monospace;",
    );
  }, []);

  return null;
}

// Combined easter eggs wrapper
export function EasterEggProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <KonamiEasterEgg />
      <TimeBasedEasterEgg delayMinutes={1} />
      <ConsoleEasterEgg />
    </>
  );
}
