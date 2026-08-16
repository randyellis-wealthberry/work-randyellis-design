"use client";

import { useEffect, useRef, useCallback } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
  initialFocus?: HTMLElement | null;
  /** Forwarded to the dialog element so a trigger's aria-controls can target it. */
  id?: string;
  /** Accessible name for the dialog — pass one of these; a dialog must be labelled. */
  "aria-labelledby"?: string;
  "aria-label"?: string;
  className?: string;
}

/**
 * FocusTrap component for managing keyboard focus within a container
 * Implements WCAG 2.4.3 Focus Order and 2.1.2 No Keyboard Trap guidelines
 *
 * @param children - Content to render within the focus trap
 * @param active - Whether the focus trap is active
 * @param restoreFocus - Whether to restore focus when trap is deactivated
 * @param onEscape - Callback when Escape key is pressed
 * @param initialFocus - Element to focus initially (defaults to first focusable)
 */
export function FocusTrap({
  children,
  active,
  restoreFocus = true,
  onEscape,
  initialFocus,
  id,
  "aria-labelledby": ariaLabelledBy,
  "aria-label": ariaLabel,
  className,
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelectors = [
      "button:not([disabled])",
      "[href]",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(
      containerRef.current.querySelectorAll(focusableSelectors),
    ).filter((element) => {
      // Additional check for visibility
      const htmlElement = element as HTMLElement;
      return (
        htmlElement.offsetWidth > 0 ||
        htmlElement.offsetHeight > 0 ||
        htmlElement.getClientRects().length > 0
      );
    }) as HTMLElement[];
  }, []);

  // Capture the opener and move focus in — ONLY on the transition to active.
  // This used to live in the keydown effect below, whose deps include
  // `onEscape`; a caller passing an inline arrow re-ran it every render, so
  // "previous element" got overwritten with whatever was focused *inside* the
  // trap and focus was never returned to the trigger on close.
  // Focus in on activation, restore on deactivation *or* unmount.
  //
  // Two traps avoided here:
  // 1. Callers inside <AnimatePresence> never see `active` flip to false —
  //    the exiting subtree is frozen with its last props and then unmounted —
  //    so restore must also run from the effect cleanup.
  // 2. React StrictMode double-invokes effects in dev, so a naive cleanup
  //    restore fires on the *simulated* unmount and yanks focus back to the
  //    trigger right after focus was moved inside. The timeout below checks
  //    whether the trap is (re)mounted before touching focus, and capture is
  //    skipped when focus is already inside the container.
  const isMountedActiveRef = useRef(false);
  useEffect(() => {
    if (!active) return;

    const focusIsInside = containerRef.current?.contains(
      document.activeElement,
    );
    if (!focusIsInside) {
      previousActiveElementRef.current = document.activeElement as HTMLElement;
      const firstElement = initialFocus || getFocusableElements()[0];
      if (firstElement) {
        firstElement.focus();
      }
    }
    isMountedActiveRef.current = true;

    return () => {
      isMountedActiveRef.current = false;
      const target = previousActiveElementRef.current;
      if (restoreFocus && target) {
        // Small delay so any exit animation / unmount settles first, and so a
        // StrictMode remount can veto the restore.
        setTimeout(() => {
          if (!isMountedActiveRef.current && document.contains(target)) {
            target.focus();
          }
        }, 0);
      }
    };
  }, [active, getFocusableElements, initialFocus, restoreFocus]);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === "Escape") {
        e.preventDefault();
        onEscape?.();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === "Tab") {
        const currentFocusableElements = getFocusableElements();
        const currentFirstElement = currentFocusableElements[0];
        const currentLastElement =
          currentFocusableElements[currentFocusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === currentFirstElement) {
            e.preventDefault();
            currentLastElement?.focus();
          }
        } else {
          // Tab (forward)
          if (document.activeElement === currentLastElement) {
            e.preventDefault();
            currentFirstElement?.focus();
          }
        }
      }
    };

    // Attach event listener to document to catch all keyboard events
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, getFocusableElements, onEscape]);

  // If not active, render children without wrapper
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-label={ariaLabel}
      className={className}
      data-focus-trap="true"
    >
      {children}
    </div>
  );
}
