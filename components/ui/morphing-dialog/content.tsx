"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";
import useClickOutside from "@/hooks/useClickOutside";

export type MorphingDialogContentProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /**
   * The dialog's accessible name, for callers that do not render a
   * `MorphingDialogTitle`. Without one of the two, the dialog opens unnamed.
   */
  label?: string;
};

/** Everything inside the dialog that a Tab can land on. */
const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MorphingDialogContent({
  children,
  className,
  style,
  label,
}: MorphingDialogContentProps) {
  const { isOpen, setIsOpen, uniqueId, triggerRef } = useMorphingDialog();
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef as React.RefObject<HTMLElement>, () => {
    if (isOpen) {
      setIsOpen(false);
    }
  });

  /**
   * Focus goes in when the dialog opens and comes back to the trigger when it
   * closes, and Tab cycles inside rather than walking off into the page behind.
   * `aria-modal` hides that page from a screen reader but does nothing about
   * the tab order, so without this a keyboard user opens the dialog and then
   * tabs into content they cannot see.
   */
  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const container = containerRef.current;
    container?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab" || !container) return;

      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      const first = focusable[0] ?? container;
      const last = focusable[focusable.length - 1] ?? container;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Returning focus is the half people forget: without it the next Tab
      // starts from the top of the document, not from what you just closed.
      trigger?.focus();
    };
  }, [isOpen, setIsOpen, triggerRef]);

  return (
    <motion.div
      ref={containerRef}
      layoutId={`dialog-${uniqueId}`}
      className={cn("overflow-hidden", className)}
      style={style}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label={label}
      // Only point at the title when the caller has no explicit name to give:
      // an id that nothing renders leaves the dialog anonymous.
      aria-labelledby={
        label ? undefined : `motion-ui-morphing-dialog-title-${uniqueId}`
      }
    >
      {children}
    </motion.div>
  );
}

MorphingDialogContent.displayName = "MorphingDialogContent";
