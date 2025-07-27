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
}

export function AnimatedMetricCard({
  label,
  value,
  animationDelay = 0,
  springOptions = { bounce: 0, duration: 2000 },
  className,
}: AnimatedMetricCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const { number, prefix, suffix } = parseMetricValue(value);

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
          "hover:shadow-lg transition-all duration-300 border-muted hover:border-primary/30 bg-gradient-to-br from-background to-muted/30 h-full",
          className,
        )}
      >
        <CardContent className="pt-6 pb-6 text-center h-full flex flex-col justify-center">
          <div className="text-2xl md:text-3xl font-bold text-primary mb-3 min-h-[3rem] flex items-center justify-center">
            {prefix && <span className="mr-1">{prefix}</span>}
            <AnimatedNumber
              value={isInView ? number : 0}
              springOptions={springOptions}
              className="tabular-nums"
            />
            {suffix && <span className="ml-1">{suffix}</span>}
          </div>
          <div className="text-sm text-muted-foreground font-medium leading-tight min-h-[2.5rem] flex items-center justify-center px-2">
            {label}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
