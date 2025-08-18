"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogTrigger({
  children,
  className,
  style,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.div
      ref={triggerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("cursor-pointer", className)}
      style={style}
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.div>
  );
}

MorphingDialogTrigger.displayName = "MorphingDialogTrigger";
