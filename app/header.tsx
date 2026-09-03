"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";
import UtilityBar from "@/components/ui/utility-bar";
import { HeaderBookingButton } from "@/components/ui/header-booking-button";

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
        <nav className="-ml-4 hidden pt-4 lg:flex lg:items-center lg:gap-4">
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
            AI Skills
          </Link>
          <Link
            href="/blog"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Blog
          </Link>

          {/* Primary CTA — right end of the nav row on desktop. */}
          <HeaderBookingButton className="ml-auto shrink-0" />
        </nav>

        <div className="flex items-start justify-between gap-4 pt-8 sm:pt-24">
          <div>
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

          {/* Below lg the nav row is hidden and the fixed hamburger owns the
              top-right corner, so the CTA sits beside the name instead. */}
          <HeaderBookingButton className="shrink-0 lg:hidden" />
        </div>
      </header>
    </>
  );
}
