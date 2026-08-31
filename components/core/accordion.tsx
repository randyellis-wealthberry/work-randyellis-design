"use client";

import { createContext, useContext, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type AccordionContextType = {
  openItems: Set<string>;
  toggleItem: (value: string) => void;
  transition?: object;
};

const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within an Accordion");
  }
  return context;
}

type AccordionProps = {
  children: React.ReactNode;
  className?: string;
  transition?: object;
  type?: "single" | "multiple";
  defaultValue?: string | string[];
};

export function Accordion({
  children,
  className,
  transition,
  type = "single",
  defaultValue,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (defaultValue) {
      if (Array.isArray(defaultValue)) {
        return new Set(defaultValue);
      }
      return new Set([defaultValue]);
    }
    return new Set();
  });

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        if (type === "single") {
          newSet.clear();
        }
        newSet.add(value);
      }
      return newSet;
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, transition }}>
      <div className={cn(className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

type AccordionItemProps = {
  value: string;
  children: React.ReactNode;
  className?: string;
};

const AccordionItemContext = createContext<string>("");

export function AccordionItem({
  value,
  children,
  className,
}: AccordionItemProps) {
  return (
    <AccordionItemContext.Provider value={value}>
      <div className={cn(className)} data-value={value}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export function AccordionTrigger({
  children,
  className,
}: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  const value = useContext(AccordionItemContext);
  const isExpanded = openItems.has(value);

  return (
    <button
      className={cn("group", className)}
      onClick={() => toggleItem(value)}
      data-expanded={isExpanded}
      aria-expanded={isExpanded}
    >
      {children}
    </button>
  );
}

type AccordionContentProps = {
  children: React.ReactNode;
  className?: string;
};

export function AccordionContent({
  children,
  className,
}: AccordionContentProps) {
  const { openItems, transition } = useAccordion();
  const value = useContext(AccordionItemContext);
  const isExpanded = openItems.has(value);

  // Collapsed content stays mounted (height-collapsed, inert) so it exists in
  // the server HTML — AI crawlers don't run JS, and unmounting collapsed items
  // removed the FAQ answers and the blog archive's post links from the page
  // they were written for (Phase 13, T-01).
  return (
    <motion.div
      initial={false}
      animate={{
        height: isExpanded ? "auto" : 0,
        opacity: isExpanded ? 1 : 0,
      }}
      transition={transition || { duration: 0.2 }}
      className={cn("overflow-hidden", className)}
      aria-hidden={!isExpanded}
      inert={!isExpanded}
    >
      <div className="pt-2 pb-2">{children}</div>
    </motion.div>
  );
}
