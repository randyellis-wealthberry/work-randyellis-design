"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";
import UtilityBar from "@/components/ui/utility-bar";

export function Header() {
  return (
    <>
      <UtilityBar />
      <header
        className="mb-6 flex flex-col sm:mb-8 lg:mb-12"
        role="banner"
        data-testid="main-header"
      >
        {/* Desktop Navigation — own row, flush-left with content edge */}
        <nav className="-ml-4 hidden pt-4 lg:flex lg:items-center lg:gap-12">
          <Link
            href="/"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            About
          </Link>
          <Link
            href="/services"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Services
          </Link>
          <Link
            href="/projects"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Projects
          </Link>
          <Link
            href="/skills"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Skills
          </Link>
          <Link
            href="/blog"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Blog
          </Link>
        </nav>

        <div className="pt-8 sm:pt-24">
          <Link
            href="/"
            className="font-medium whitespace-nowrap text-zinc-900 dark:text-white"
          >
            Randy Ellis
          </Link>
          <TextEffect
            as="p"
            preset="fade"
            per="char"
            className="whitespace-nowrap text-zinc-600 dark:text-zinc-400"
            delay={0.5}
          >
            Design-led, end to end.
          </TextEffect>
        </div>
      </header>
    </>
  );
}
