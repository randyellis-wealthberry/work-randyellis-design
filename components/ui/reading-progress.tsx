"use client";

import { motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { Heart, Target, Award, Rocket } from "lucide-react";

interface ReadingProgressProps {
  className?: string;
}

export function ReadingProgress({ className }: ReadingProgressProps) {
  const { scrollYProgress } = useScroll();
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { icon: Target, label: "Metrics", color: "bg-blue-500" },
    { icon: Rocket, label: "Initiatives", color: "bg-purple-500" },
    { icon: Award, label: "Impact", color: "bg-green-500" },
    { icon: Heart, label: "Reflection", color: "bg-pink-500" },
  ];

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      const sectionIndex = Math.floor(progress * sections.length);
      setCurrentSection(Math.min(sectionIndex, sections.length - 1));
    });

    return unsubscribe;
  }, [scrollYProgress, sections.length]);

  return (
    <motion.div
      className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center gap-4">
          {sections.map((section, index) => {
            const Icon = section.icon;
            const isActive = index <= currentSection;
            const isCurrent = index === currentSection;

            return (
              <motion.div
                key={index}
                className="flex items-center gap-2"
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.4,
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                    isActive ? section.color : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                  animate={{
                    rotate: isCurrent ? [0, 360] : 0,
                  }}
                  transition={{
                    duration: 2,
                    repeat: isCurrent ? Infinity : 0,
                    ease: "linear",
                  }}
                >
                  <Icon className="h-4 w-4" />
                </motion.div>
                {index < sections.length - 1 && (
                  <motion.div className="w-12 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${section.color} origin-left`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress text */}
        <motion.div
          className="text-center mt-2 text-xs text-zinc-600 dark:text-zinc-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          {sections[currentSection]?.label} Journey
        </motion.div>
      </div>
    </motion.div>
  );
}
