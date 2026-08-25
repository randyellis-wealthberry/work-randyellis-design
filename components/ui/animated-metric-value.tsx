"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, type SpringOptions } from "motion/react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";
import { parseMetricValue } from "@/lib/utils/parseMetricValue";
import { cn } from "@/lib/utils";

export interface AnimatedMetricValueProps {
  /** Raw metric string, e.g. "40%", "2.5K+", "$50M", "On-site". */
  value: string;
  className?: string;
  springOptions?: SpringOptions;
  /** Delay (ms) before the count-up starts once the value is in view. */
  delay?: number;
}

/**
 * Counts a metric up from 0 when it scrolls into view, keeping any prefix
 * ("$") and suffix ("%", "K+", "M") as static text around the number.
 * Non-numeric values ("On-site") render as plain text — no fake count-up.
 *
 * The true figure is what renders first, so the served HTML never states "$0M"
 * to a crawler or to a reader without JavaScript. The count-up is armed only
 * while the metric is still below the fold, where dropping it to zero is
 * invisible; a metric already on screen at mount keeps its real value rather
 * than flashing back to zero.
 */
export function AnimatedMetricValue({
  value,
  className,
  springOptions = { bounce: 0, duration: 1800 },
  delay = 0,
}: AnimatedMetricValueProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });
  const { number, prefix, suffix } = parseMetricValue(value);
  // "2.5M+" must not count up to 3M+. Hold whatever precision the source
  // figure was written with.
  const decimals = (value.match(/\d\.(\d+)/)?.[1] ?? "").length;
  const prefersReduced = useReducedMotion();
  const [current, setCurrent] = useState(number);
  const phase = useRef<"idle" | "armed" | "done">("idle");

  useEffect(() => {
    if (phase.current === "done") return;

    if (phase.current === "idle") {
      // Already on screen at mount, or motion is unwelcome: keep the real
      // figure. Zeroing a visible number would read as a glitch, not a reveal.
      if (isInView || prefersReduced) {
        phase.current = "done";
        return;
      }
      phase.current = "armed";
      setCurrent(0);
      return;
    }

    if (!isInView) return;
    phase.current = "done";
    const timer = setTimeout(() => setCurrent(number), delay);
    return () => clearTimeout(timer);
  }, [isInView, number, delay, prefersReduced]);

  const isNumeric = /[\d.]/.test(value);

  return (
    <span
      ref={ref}
      className={cn("inline-flex items-baseline tabular-nums", className)}
      aria-label={value}
    >
      {isNumeric ? (
        <>
          {prefix && <span aria-hidden="true">{prefix}</span>}
          <AnimatedNumber
            value={current}
            springOptions={springOptions}
            decimals={decimals}
          />
          {suffix && <span aria-hidden="true">{suffix}</span>}
        </>
      ) : (
        value
      )}
    </span>
  );
}
