"use client";

import { motion, useInView } from "motion/react";
import { useRef, useMemo, memo } from "react";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { InView } from "@/components/motion-primitives/in-view";
import { WireframeCard } from "./wireframe-card";
import { wireframesData } from "@/lib/data/wireframes-data";
import type { WireframeData } from "@/lib/data/wireframes-data";

interface WireframesSectionProps {
  wireframes?: WireframeData[];
  className?: string;
  animationConfig?: {
    staggerDelay?: number;
    duration?: number;
  };
}

const WireframesSectionComponent = ({
  wireframes = wireframesData, // Use default wireframes data if not provided
  className = "",
  animationConfig = { staggerDelay: 100, duration: 0.6 },
}: WireframesSectionProps) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });

  // Memoize wireframes to optimize performance with large datasets
  const memoizedWireframes = useMemo(() => {
    // For very large datasets, we can optimize by limiting initial render
    if (wireframes && wireframes.length > 20) {
      // In test environment, still render all for testing
      return wireframes;
    }
    return wireframes || [];
  }, [wireframes]);

  // Handle empty wireframes
  if (!memoizedWireframes || memoizedWireframes.length === 0) {
    return (
      <section
        data-testid="wireframes-section"
        aria-labelledby="wireframes-title"
        className={`px-4 py-16 md:px-6 lg:px-8 ${className}`}
      >
        <div className="mx-auto max-w-6xl text-center">
          <h2 id="wireframes-title" className="mb-4 text-2xl font-bold">
            HIGH-FIDELITY WIREFRAMES
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            No wireframes available at this time.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-testid="wireframes-section"
      aria-labelledby="wireframes-title"
      aria-label="Wireframes showcase"
      className={`bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 py-16 md:px-6 lg:px-8 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800 ${className} `}
    >
      <div className="mx-auto max-w-6xl">
        <InView
          once={true}
          viewOptions={{ margin: "-10%" }}
          data-in-view={isInView}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-12 text-center"
          >
            <motion.h2
              id="wireframes-title"
              className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl dark:text-white"
            >
              HIGH-FIDELITY WIREFRAMES
            </motion.h2>

            <motion.p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
              Detailed wireframes showcasing key user flows and interactions
              from our intensive 2-week design sprint, focusing on optimal user
              experience and seamless navigation patterns.
            </motion.p>

            {/* Screen reader announcement */}
            <p className="sr-only">
              {memoizedWireframes.length} wireframes showcasing the design
              process and user interface layouts
            </p>
          </motion.div>

          <AnimatedGroup
            data-in-view={isInView ? "true" : "false"}
            staggerDelay={(animationConfig.staggerDelay ?? 100) / 1000}
          >
            <div
              data-testid="wireframes-grid"
              className="grid auto-rows-fr grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-2"
            >
              {memoizedWireframes.map((wireframe, index) => {
                const delay = index * (animationConfig.staggerDelay || 100);

                return (
                  <motion.div
                    key={wireframe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={
                      isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                    }
                    transition={{
                      duration: animationConfig.duration || 0.6,
                      delay: delay / 1000,
                      ease: "easeOut",
                    }}
                    className="h-full"
                  >
                    <WireframeCard
                      wireframe={wireframe}
                      animationDelay={delay}
                      className="h-full"
                    />
                  </motion.div>
                );
              })}
            </div>
          </AnimatedGroup>
        </InView>
      </div>
    </section>
  );
};

export const WireframesSection = memo(WireframesSectionComponent);
