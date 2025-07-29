"use client";

import { motion, useInView, SpringOptions } from "motion/react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/core/animated-number";
import { parseMetricValue } from "@/lib/utils/parseMetricValue";
import { Card, CardContent } from "@/components/ui/card";

export interface AnimatedMetricCardProps {
  label: string;
  value: string;
  animationDelay?: number;
  springOptions?: SpringOptions;
  className?: string;
  variant?: "default" | "hero";
  performanceLevel?: "excellent" | "good" | "needs-improvement" | "neutral";
}

export function AnimatedMetricCard({
  label,
  value,
  animationDelay = 0,
  springOptions = { bounce: 0, duration: 2000 },
  className,
  variant = "default",
  performanceLevel = "neutral",
}: AnimatedMetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { number, prefix, suffix } = parseMetricValue(value);

  // Get performance-based styling
  const getPerformanceStyles = () => {
    switch (performanceLevel) {
      case "excellent":
        return {
          cardClass:
            "border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/20 dark:to-green-900/30 dark:border-green-800",
          textClass: "text-green-600 dark:text-green-400",
          indicatorClass: "bg-green-500",
        };
      case "good":
        return {
          cardClass:
            "border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/30 dark:border-amber-800",
          textClass: "text-amber-600 dark:text-amber-400",
          indicatorClass: "bg-amber-500",
        };
      case "needs-improvement":
        return {
          cardClass:
            "border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/20 dark:to-red-900/30 dark:border-red-800",
          textClass: "text-red-600 dark:text-red-400",
          indicatorClass: "bg-red-500",
        };
      default:
        return {
          cardClass:
            "border-muted bg-gradient-to-br from-background to-muted/30",
          textClass: "text-primary",
          indicatorClass: "bg-primary",
        };
    }
  };

  const performanceStyles = getPerformanceStyles();
  const isHero = variant === "hero";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.4,
        delay: animationDelay / 1000,
      }}
    >
      <Card
        className={cn(
          "hover:shadow-lg transition-all duration-300 h-full",
          performanceStyles.cardClass,
          isHero ? "col-span-2 lg:col-span-2" : "",
          className,
        )}
      >
        <CardContent
          className={cn(
            "text-center h-full flex flex-col justify-center",
            isHero ? "pt-8 pb-8" : "pt-6 pb-6",
          )}
        >
          {/* Performance indicator */}
          {performanceLevel !== "neutral" && (
            <div className="mb-2 flex justify-center">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  performanceStyles.indicatorClass,
                )}
              />
            </div>
          )}
          <div
            className={cn(
              "font-bold mb-3 flex items-center justify-center",
              isHero
                ? "text-3xl md:text-4xl lg:text-5xl min-h-[4rem]"
                : "text-2xl md:text-3xl min-h-[3rem]",
              performanceStyles.textClass,
            )}
          >
            {prefix && <span className="mr-1">{prefix}</span>}
            <AnimatedNumber
              value={isInView ? number : 0}
              springOptions={springOptions}
              className="tabular-nums"
            />
            {suffix && <span className="ml-1">{suffix}</span>}
          </div>
          <div
            className={cn(
              "text-muted-foreground font-medium leading-tight flex items-center justify-center px-2",
              isHero ? "text-base min-h-[3rem]" : "text-sm min-h-[2.5rem]",
            )}
          >
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
