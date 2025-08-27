"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";
import UtilityBar from "@/components/ui/utility-bar";

export function Header() {
  return (
    <>
      <UtilityBar />
      <header
        className="mb-12 flex flex-col-reverse gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
        role="banner"
        data-testid="main-header"
      >
        <div className="pt-8 sm:pt-24">
          <Link
            href="https://work.randyellis.design"
            className="font-medium whitespace-nowrap text-black dark:text-white"
          >
            Randy Ellis
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="whitespace-nowrap text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Generative AI & Product Design Engineer
          </TextEffect>
        </div>

        <nav className="flex flex-col gap-2 pt-0 sm:flex-row sm:items-center sm:gap-8 md:gap-10 lg:gap-16">
          <Link
            href="https://work.randyellis.design"
            className="flex min-h-[44px] items-center rounded-md px-0 py-2 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:px-4 sm:py-3 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="flex min-h-[44px] items-center rounded-md px-0 py-2 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:px-4 sm:py-3 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            About
          </Link>
          <Link
            href="/projects"
            className="flex min-h-[44px] items-center rounded-md px-0 py-2 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 sm:px-4 sm:py-3 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Projects
          </Link>
        </nav>
      </header>
    </>
  );
}
