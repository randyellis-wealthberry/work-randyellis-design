"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";

export function Header() {
  return (
    <header className="mb-12 sm:mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="font-medium text-black dark:text-white">
          Randy Ellis
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-zinc-600 dark:text-zinc-500"
          delay={0.5}
        >
          Generative AI & Product Design Engineer
        </TextEffect>
      </div>

      <nav className="flex items-center gap-4 sm:gap-6 md:gap-8">
        <Link
          href="/"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-1 min-h-[44px] flex items-center"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-1 min-h-[44px] flex items-center"
        >
          About
        </Link>
        <Link
          href="/projects"
          className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors py-2 px-1 min-h-[44px] flex items-center"
        >
          Projects
        </Link>
      </nav>
    </header>
  );
}
