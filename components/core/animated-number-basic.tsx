"use client";
import { useEffect, useState } from "react";
import { AnimatedNumber } from "@/components/core/animated-number";

export function AnimatedNumberBasic() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);
  const [value3, setValue3] = useState(0);
  const [value4, setValue4] = useState(0);

  useEffect(() => {
    setTimeout(() => setValue1(2.5), 0);
    setTimeout(() => setValue2(6), 200);
    setTimeout(() => setValue3(50), 400);
    setTimeout(() => setValue4(800), 600);
  }, []);

  return (
    <div className="w-full">
      <h3 className="mb-5 text-lg font-medium">Career Highlights and Impact</h3>
      <div className="grid w-full grid-cols-2 items-end gap-6 md:grid-cols-4">
        <div className="flex flex-col items-center py-1">
          <div className="mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-5 w-5 fill-transparent stroke-zinc-800 stroke-[1.5] dark:stroke-zinc-50"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
          </div>
          <div className="flex h-8 items-baseline justify-center">
            <AnimatedNumber
              className="font-mono text-2xl leading-none font-light text-zinc-800 tabular-nums dark:text-zinc-50"
              springOptions={{
                bounce: 0,
                duration: 2000,
              }}
              value={value1}
            />
            <span className="ml-0 font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50">
              M
            </span>
          </div>
          <p className="mt-1 flex h-6 items-end justify-center text-center text-sm leading-tight font-medium text-zinc-500 dark:text-zinc-400">
            Users Impacted
          </p>
        </div>

        <div className="flex flex-col items-center py-1">
          <div className="mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-5 w-5 fill-transparent stroke-zinc-800 stroke-[1.5] dark:stroke-zinc-50"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
          </div>
          <div className="flex h-8 items-baseline justify-center">
            <AnimatedNumber
              className="font-mono text-2xl leading-none font-light text-zinc-800 tabular-nums dark:text-zinc-50"
              springOptions={{
                bounce: 0,
                duration: 2000,
              }}
              value={value2}
            />
          </div>
          <p className="mt-1 flex h-6 items-end justify-center text-center text-sm leading-tight font-medium text-zinc-500 dark:text-zinc-400">
            Design Awards
          </p>
        </div>

        <div className="flex flex-col items-center py-1">
          <div className="mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-5 w-5 fill-transparent stroke-zinc-800 stroke-[1.5] dark:stroke-zinc-50"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
          </div>
          <div className="flex h-8 items-baseline justify-center">
            <span className="mr-0 font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50">
              $
            </span>
            <AnimatedNumber
              className="font-mono text-2xl leading-none font-light text-zinc-800 tabular-nums dark:text-zinc-50"
              springOptions={{
                bounce: 0,
                duration: 2000,
              }}
              value={value3}
            />
            <span className="ml-0 font-mono text-2xl font-light text-zinc-800 dark:text-zinc-50">
              M
            </span>
          </div>
          <p className="mt-1 flex h-6 items-end justify-center text-center text-sm leading-tight font-medium text-zinc-500 dark:text-zinc-400">
            in product value
          </p>
        </div>

        <div className="flex flex-col items-center py-1">
          <div className="mb-2 flex h-6 w-6 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              className="h-5 w-5 fill-transparent stroke-zinc-800 stroke-[1.5] dark:stroke-zinc-50"
            >
              <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
            </svg>
          </div>
          <div className="flex h-8 items-baseline justify-center">
            <AnimatedNumber
              className="font-mono text-2xl leading-none font-light text-zinc-800 tabular-nums dark:text-zinc-50"
              springOptions={{
                bounce: 0,
                duration: 2000,
              }}
              value={value4}
            />
          </div>
          <p className="mt-1 flex h-6 items-end justify-center text-center text-sm leading-tight font-medium text-zinc-500 dark:text-zinc-400">
            Designers Mentored
          </p>
        </div>
      </div>
    </div>
  );
}
