"use client";

import React, { useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";
import useClickOutside from "@/hooks/useClickOutside";

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogContent({
  children,
  className,
  style,
}: MorphingDialogContentProps) {
  const { isOpen, setIsOpen, uniqueId } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      aria-labelledby={`motion-ui-morphing-dialog-title-${uniqueId}`}
      aria-describedby={`motion-ui-morphing-dialog-description-${uniqueId}`}
    >
      {children}
    </motion.div>
  );
}