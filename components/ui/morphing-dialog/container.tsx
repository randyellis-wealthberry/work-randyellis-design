"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { createPortal } from "react-dom";
import { XIcon } from "lucide-react";
import { useMorphingDialog } from "@/hooks/useMorphingDialog";

export type MorphingDialogContainerProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function MorphingDialogContainer({
  children,
}: MorphingDialogContainerProps) {
  const { isOpen, uniqueId } = useMorphingDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence initial={false} mode="sync">
      {isOpen && (
        <>
          <motion.div
            key={`backdrop-${uniqueId}`}
            className="fixed inset-0 h-full w-full bg-white/40 backdrop-blur-sm dark:bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export type MorphingDialogCloseProps = {
  children?: React.ReactNode;
  className?: string;
};

export function MorphingDialogClose({
  children,
  className,
}: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(false)}
      className={className}
      aria-label="Close dialog"
    >
      {children ?? <XIcon className="h-5 w-5" />}
    </button>
  );
}

MorphingDialogContainer.displayName = "MorphingDialogContainer";
MorphingDialogClose.displayName = "MorphingDialogClose";
