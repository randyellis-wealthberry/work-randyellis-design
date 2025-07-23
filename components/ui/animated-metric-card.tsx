"use client";

import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AnimatedMetricCardProps {
  label: string;
  value: string;
  duration?: number;
  delay?: number;
}

function extractNumber(value: string): number {
  const match = value.match(/[\d,]+\.?\d*/);
  if (!match) return 0;
  return parseFloat(match[0].replace(/,/g, ""));
}

function formatValue(value: string, currentNumber: number): string {
  const prefix = value.match(/^[^\d]*/)?.[0] || "";
  const suffix = value.match(/[^\d,\.]*$/)?.[0] || "";

  if (value.includes("$")) {
    return `${prefix}${currentNumber.toFixed(1)}${suffix}`;
  } else if (value.includes("K") || value.includes("M")) {
    return `${prefix}${Math.round(currentNumber)}${suffix}`;
  } else if (value.includes("%")) {
    return `${prefix}${Math.round(currentNumber)}${suffix}`;
  }

  return `${prefix}${Math.round(currentNumber)}${suffix}`;
}

export function AnimatedMetricCard({
  label,
  value,
  duration = 2000,
  delay = 0,
}: AnimatedMetricCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState("0");

  const targetNumber = extractNumber(value);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: duration,
    bounce: 0.1,
  });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        motionValue.set(targetNumber);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isInView, targetNumber, delay, motionValue]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(formatValue(value, latest));
    });
    return unsubscribe;
  }, [springValue, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{
        duration: 0.6,
        delay: delay / 1000,
      }}
    >
      <Card className="hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/30 bg-gradient-to-br from-background to-muted/30">
        <CardContent className="pt-6 text-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-2 min-h-[2.5rem] flex items-center justify-center">
            {displayValue}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
