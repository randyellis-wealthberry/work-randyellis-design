"use client";

import React, { createContext, useContext, useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

type TextOpacityEnum = "none" | "soft" | "medium";
type ViewTypeEnum = "word" | "letter";

type TextGradientScrollType = {
  text: string;
  type?: ViewTypeEnum;
  className?: string;
  textOpacity?: TextOpacityEnum;
};

type LetterType = {
  children: React.ReactNode | string;
  progress: MotionValue<number>;
  range: number[];
};

type WordType = {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: number[];
};

type CharType = {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: number[];
};

type TextGradientScrollContextType = {
  textOpacity?: TextOpacityEnum;
  type?: ViewTypeEnum;
};

const TextGradientScrollContext = createContext<TextGradientScrollContextType>(
  {},
);

function useGradientScroll() {
  const context = useContext(TextGradientScrollContext);
  return context;
}

function TextGradientScroll({
  text,
  className,
  type = "letter",
  // "medium" is the default because it is the only tier that clears the
  // contrast floor for body copy at rest (5.00:1 on Paper, 7.73:1 on Ink Deep).
  // "soft" sits at roughly 3.3:1 on white — reserve it for large display type
  // or a tinted ground, and "none" only where the text is decorative.
  textOpacity = "medium",
}: TextGradientScrollType) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const words = text.split(" ");

  return (
    <TextGradientScrollContext.Provider value={{ textOpacity, type }}>
      <p
        ref={ref}
        data-testid="text-gradient-scroll"
        className={cn("relative m-0 flex flex-wrap", className)}
      >
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return type === "word" ? (
            <Word key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Word>
          ) : (
            <Letter key={i} progress={scrollYProgress} range={[start, end]}>
              {word}
            </Letter>
          );
        })}
      </p>
    </TextGradientScrollContext.Provider>
  );
}

export { TextGradientScroll };

const Word = ({ children, progress, range }: WordType) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { textOpacity } = useGradientScroll();

  return (
    <span className="relative me-1 mt-2">
      {/* The understudy holds the structure at progress 0, so it has to be
          legible on its own — the scroll darkens already-readable text rather
          than revealing text that was invisible. It also honours the
          `textOpacity` prop, which this branch used to ignore in favour of a
          hardcoded 0.1. */}
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity == "none",
          "opacity-60": textOpacity == "soft",
          "opacity-75": textOpacity == "medium",
        })}
      >
        {children}
      </span>
      <motion.span style={{ transition: "all .5s", opacity: opacity }}>
        {children}
      </motion.span>
    </span>
  );
};

const Letter = ({ children, progress, range }: LetterType) => {
  if (typeof children === "string") {
    const amount = range[1] - range[0];
    const step = amount / children.length;

    return (
      <span className="relative me-1 mt-2">
        {children.split("").map((char: string, i: number) => {
          const start = range[0] + i * step;
          const end = range[0] + (i + 1) * step;
          return (
            <Char key={`c_${i}`} progress={progress} range={[start, end]}>
              {char}
            </Char>
          );
        })}
      </span>
    );
  }
};

const Char = ({ children, progress, range }: CharType) => {
  const opacity = useTransform(progress, range, [0, 1]);
  const { textOpacity } = useGradientScroll();

  return (
    <span>
      <span
        className={cn("absolute", {
          "opacity-0": textOpacity == "none",
          "opacity-60": textOpacity == "soft",
          "opacity-75": textOpacity == "medium",
        })}
      >
        {children}
      </span>
      <motion.span
        style={{
          transition: "all .5s",
          opacity: opacity,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
};
