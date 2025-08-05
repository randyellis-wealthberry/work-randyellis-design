"use client";

import { useEffect, useRef, useCallback } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active: boolean;
  restoreFocus?: boolean;
  onEscape?: () => void;
  initialFocus?: HTMLElement | null;
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

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    const focusableElements = getFocusableElements();
    const firstElement = initialFocus || focusableElements[0];
    // const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element
    if (firstElement) {
      firstElement.focus();
    }

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

      // Restore focus to previously focused element
      if (restoreFocus && previousActiveElementRef.current) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          previousActiveElementRef.current?.focus();
        }, 0);
      }
    };
  }, [active, getFocusableElements, initialFocus, onEscape, restoreFocus]);

  // If not active, render children without wrapper
  if (!active) {
    return <>{children}</>;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      data-focus-trap="true"
    >
      {children}
    </div>
  );
}
