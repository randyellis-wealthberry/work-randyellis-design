"use client";

import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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

  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={transition || { duration: 0.2, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          <div className="pb-2 pt-2">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
