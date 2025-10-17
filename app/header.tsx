"use client";
import { useState } from "react";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";
import UtilityBar from "@/components/ui/utility-bar";
import { MobileMenu } from "@/components/ui/mobile-menu";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <>
      <UtilityBar />
      <header
        className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:mb-12"
        role="banner"
        data-testid="main-header"
      >
        <div className="flex items-center justify-between pt-8 sm:pt-24">
          <div>
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

          {/* Mobile/Tablet Menu Button */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onOpenChange={setIsMobileMenuOpen}
          />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:flex-row lg:items-center lg:gap-8 xl:gap-16">
          <Link
            href="https://work.randyellis.design"
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
            href="/projects"
            className="flex min-h-[44px] items-center rounded-md px-4 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            style={{ textDecoration: "none" }}
          >
            Projects
          </Link>
        </nav>
      </header>
    </>
  );
}
