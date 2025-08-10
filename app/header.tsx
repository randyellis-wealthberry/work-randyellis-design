"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";

export function Header() {
  return (
    <header className="mb-12 sm:mb-10 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
      <div className="pt-8 sm:pt-24">
        <Link
          href="https://work.randyellis.design"
          className="font-medium text-black dark:text-white whitespace-nowrap"
        >
          Randy Ellis
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500 whitespace-nowrap"
          delay={0.5}
        >
          Generative AI & Product Design Engineer
        </TextEffect>
      </div>

      <nav className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 md:gap-10 lg:gap-16 pt-20 sm:pt-0">
        <Link
          href="https://work.randyellis.design"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-0 sm:py-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 no-underline"
          style={{ textDecoration: "none" }}
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-0 sm:py-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 no-underline"
          style={{ textDecoration: "none" }}
        >
          About
        </Link>
        <Link
          href="/projects"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-0 sm:py-3 sm:px-4 min-h-[44px] flex items-center rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 no-underline"
          style={{ textDecoration: "none" }}
        >
          Projects
        </Link>
      </nav>
    </header>
  );
}
