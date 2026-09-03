"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface DoubleChevronProps {
  index: number;
  dotColor: string;
}

const DoubleChevron = ({ index, dotColor }: DoubleChevronProps) => {
  const base = index * 0.12;
  const dots = [
    { cx: 2, cy: 2, d: 0 },
    { cx: 5, cy: 5, d: 0.05 },
    { cx: 8, cy: 8, d: 0.1 },
    { cx: 5, cy: 11, d: 0.15 },
    { cx: 2, cy: 14, d: 0.2 },
    { cx: 6, cy: 2, d: 0.05 },
    { cx: 9, cy: 5, d: 0.1 },
    { cx: 12, cy: 8, d: 0.15 },
    { cx: 9, cy: 11, d: 0.2 },
    { cx: 6, cy: 14, d: 0.25 },
  ];

  return (
    <svg
      width="14"
      height="16"
      viewBox="0 0 14 16"
      aria-hidden="true"
      focusable="false"
      className="shrink-0 overflow-visible"
    >
      <g fill={dotColor}>
        {dots.map((p, i) => (
          <circle
            key={i}
            cx={p.cx}
            cy={p.cy}
            r="1"
            className="bd-dot"
            style={{ animationDelay: `${base + p.d}s` }}
          />
        ))}
      </g>
    </svg>
  );
};

interface AntiMetalSurfaceProps {
  content: React.ReactNode;
  accentFrom: string;
  accentTo: string;
  dotColor: string;
}

/**
 * The shell classes and the inner surface are shared by the button and the
 * link, so the two cannot drift apart: whichever element a call site needs,
 * it gets the same metal.
 */
const SHELL =
  "group/btn focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex h-11 w-36 overflow-hidden rounded-xl transition-transform focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98] bg-[linear-gradient(180deg,#1a1a1a_0%,#0a0a0a_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_12px_rgba(0,0,0,0.18)] dark:bg-[linear-gradient(180deg,#ffffff_0%,#ededed_100%)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_4px_12px_rgba(0,0,0,0.35)]";

function AntiMetalSurface({
  content,
  accentFrom,
  accentTo,
  dotColor,
}: AntiMetalSurfaceProps) {
  return (
    <>
      <style>{`
        @keyframes bd-dot-wave {
          0%, 70%, 100% { opacity: 0.25; transform: scale(0.85); }
          35% { opacity: 1; transform: scale(1); }
        }
        .bd-dot {
          transform-box: fill-box;
          transform-origin: center;
          animation: bd-dot-wave 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .bd-dot { animation: none; opacity: 1; }
        }
      `}</style>

      <span className="absolute inset-y-0 right-4 flex items-center text-[14px] font-medium tracking-tight text-white dark:text-[#0a0a0a]">
        {content}
      </span>

      <span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 z-10 flex w-9 items-center justify-start gap-2.5 overflow-hidden rounded-md pr-2.5 pl-3 transition-[width,gap] duration-200 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover/btn:w-[calc(100%-0.5rem)]"
        style={{
          background: `linear-gradient(180deg, ${accentFrom} 0%, ${accentTo} 100%)`,
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)",
        }}
      >
        <DoubleChevron index={0} dotColor={dotColor} />
        <DoubleChevron index={1} dotColor={dotColor} />
        <DoubleChevron index={2} dotColor={dotColor} />
        <DoubleChevron index={3} dotColor={dotColor} />
        <DoubleChevron index={4} dotColor={dotColor} />
      </span>
    </>
  );
}

const DEFAULTS = {
  accentFrom: "#d6f54a",
  accentTo: "#c5ea2c",
  dotColor: "#0f0f0f",
} as const;

export interface AntiMetalButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: React.ReactNode;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
}

export const AntiMetalButton = React.forwardRef<
  HTMLButtonElement,
  AntiMetalButtonProps
>(
  (
    {
      className,
      children,
      label,
      accentFrom = DEFAULTS.accentFrom,
      accentTo = DEFAULTS.accentTo,
      dotColor = DEFAULTS.dotColor,
      ...props
    },
    ref,
  ) => {
    const content = label ?? children ?? "Book a demo";

    return (
      <button ref={ref} className={cn(SHELL, className)} {...props}>
        <AntiMetalSurface
          content={content}
          accentFrom={accentFrom}
          accentTo={accentTo}
          dotColor={dotColor}
        />
      </button>
    );
  },
);

AntiMetalButton.displayName = "AntiMetalButton";

export interface AntiMetalLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  label?: React.ReactNode;
  accentFrom?: string;
  accentTo?: string;
  dotColor?: string;
}

/**
 * The same metal as a real link. A navigation target rendered as a `<button>`
 * loses middle-click, open-in-new-tab, and the link role that tells assistive
 * tech where it goes, so a CTA that leads to a page is an anchor.
 */
export const AntiMetalLink = React.forwardRef<
  HTMLAnchorElement,
  AntiMetalLinkProps
>(
  (
    {
      href,
      className,
      children,
      label,
      accentFrom = DEFAULTS.accentFrom,
      accentTo = DEFAULTS.accentTo,
      dotColor = DEFAULTS.dotColor,
      ...props
    },
    ref,
  ) => {
    const content = label ?? children;

    return (
      <Link ref={ref} href={href} className={cn(SHELL, className)} {...props}>
        <AntiMetalSurface
          content={content}
          accentFrom={accentFrom}
          accentTo={accentTo}
          dotColor={dotColor}
        />
      </Link>
    );
  },
);

AntiMetalLink.displayName = "AntiMetalLink";

export default AntiMetalButton;
