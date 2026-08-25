"use client";

import { useMemo, memo } from "react";
import {
  SectionLabel,
  SECTION,
} from "@/components/case-study/case-study-template";
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

/**
 * The sprint's high-fidelity screens. This is a figure band inside a case
 * study, so it opens exactly like every other section on the page: one rule at
 * full contrast, a label, and hairlines under the content. Nothing here
 * animates on entrance — the page runs a single scroll timeline in the margin,
 * and a second one competing with it is what this section used to be.
 */
const WireframesSectionComponent = ({
  wireframes = wireframesData,
  className = "",
}: WireframesSectionProps) => {
  const memoizedWireframes = useMemo(() => wireframes ?? [], [wireframes]);

  if (memoizedWireframes.length === 0) {
    return (
      <section
        id="wireframes"
        data-testid="wireframes-section"
        aria-labelledby="wireframes-title"
        className={`${SECTION} ${className}`}
      >
        <SectionLabel id="wireframes-title">
          High-fidelity wireframes
        </SectionLabel>
        <p className="mt-6 max-w-[62ch] text-base text-zinc-600 dark:text-zinc-400">
          No wireframes available at this time.
        </p>
      </section>
    );
  }

  return (
    <section
      id="wireframes"
      data-testid="wireframes-section"
      aria-labelledby="wireframes-title"
      className={`${SECTION} ${className}`}
    >
      <SectionLabel id="wireframes-title">
        High-fidelity wireframes
      </SectionLabel>
      <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        The key flows as they were prototyped in the sprint — the screens that
        went into usability testing, not cleaned-up versions drawn afterwards.
      </p>
      <p className="sr-only">
        {memoizedWireframes.length} wireframes showcasing the design process and
        user interface layouts
      </p>

      <div
        data-testid="wireframes-grid"
        className="mt-10 grid grid-cols-1 gap-x-16 gap-y-12 md:grid-cols-2"
      >
        {memoizedWireframes.map((wireframe) => (
          <WireframeCard key={wireframe.id} wireframe={wireframe} />
        ))}
      </div>
    </section>
  );
};

export const WireframesSection = memo(WireframesSectionComponent);
