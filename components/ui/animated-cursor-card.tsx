"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cursor } from "@/components/core/cursor";
import { cn } from "@/lib/utils";
import Link from "next/link";

const MouseIcon = ({
  color = "#22c55e",
  ...props
}: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={26}
      height={31}
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill={color}
          fillRule="evenodd"
          stroke="#fff"
          strokeLinecap="square"
          strokeWidth={2}
          d="M21.993 14.425 2.549 2.935l4.444 23.108 4.653-10.002z"
          clipRule="evenodd"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill={color} d="M0 0h26v31H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};

interface AnimatedCursorCardProps {
  title: string;
  label: string;
  url: string;
  gradient: string;
  pattern?: string;
  icon?: string;
  openInNewTab?: boolean;
  className?: string;
}

export function AnimatedCursorCard({
  title,
  label,
  url,
  gradient,
  pattern,
  icon,
  openInNewTab = false,
  className,
}: AnimatedCursorCardProps) {
  const isExternal = url.startsWith("http");

  const cardContent = (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl p-8",
        "flex min-h-[200px] flex-col justify-between",
        "transition-all duration-300",
        "hover:scale-105 hover:shadow-2xl",
        "abstract-card cursor-pointer",
        className,
      )}
      style={{
        background: gradient,
      }}
    >
      {/* Pattern overlay */}
      {pattern && (
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: pattern }}
        />
      )}

      {/* Cursor interaction */}
      <Cursor
        attachToParent
        variants={{
          initial: { scale: 0.3, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          exit: { scale: 0.3, opacity: 0 },
        }}
        transition={{
          ease: "easeInOut",
          duration: 0.15,
        }}
        className="top-4 left-12"
      >
        <div className="flex items-start gap-2">
          <MouseIcon className="h-6 w-6" />
          <div className="cursor-label mt-1 ml-2 rounded-md bg-green-500 px-3 py-1 text-sm font-medium text-white shadow-lg">
            {label}
          </div>
        </div>
      </Cursor>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      </div>

      {/* Hover gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 100%)",
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );

  if (isExternal || openInNewTab) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        tabIndex={0}
        aria-label={`${title} - ${label}`}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link
      href={url}
      className="block"
      tabIndex={0}
      aria-label={`${title} - ${label}`}
    >
      {cardContent}
    </Link>
  );
}
