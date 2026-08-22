"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";

export type MorphingDialogTriggerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * What the trigger announces. Without it the button takes its name from
   * whatever it wraps, which is right when that is an image with real alt text
   * and wrong when it is a bare thumbnail.
   */
  label?: string;
  /** How far the trigger grows on hover. 1 disables the effect. */
  hoverScale?: number;
};

/**
 * The control that opens the dialog.
 *
 * It is a real `<button>`. It used to be a `motion.div` with an `onClick`,
 * which meant the dialog could only be opened with a pointer: no tab stop, no
 * Enter or Space, and nothing for a screen reader to announce. Everything the
 * lightbox contains was therefore unreachable without a mouse.
 *
 * `aria-haspopup="dialog"` and `aria-expanded` say what the button does and
 * what state it is in, so the relationship is legible before it is activated.
 */
export function MorphingDialogTrigger({
  children,
  className,
  style,
  label,
  hoverScale = 1.02,
}: MorphingDialogTriggerProps) {
  const { isOpen, setIsOpen, uniqueId, triggerRef } = useMorphingDialog();

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      layoutId={`dialog-${uniqueId}`}
      className={cn(
        "block w-full cursor-pointer rounded-xl text-left focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:focus-visible:ring-white",
        className,
      )}
      style={style}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-label={label}
      onClick={() => setIsOpen(true)}
      whileHover={{ scale: hoverScale }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
}

MorphingDialogTrigger.displayName = "MorphingDialogTrigger";
