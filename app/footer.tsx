"use client";
import Link from "next/link";
import { TextLoop } from "@/components/ui/text-loop";
import { FooterThemeToggle } from "@/components/ui/simple-theme-toggle";
import { GhostedCoin } from "@/components/ui/ghosted-coin";

// Derived rather than hardcoded — the footer year was still 2025 in August 2026.
const COPYRIGHT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <Link href="/">
          <TextLoop className="text-xs text-zinc-500 dark:text-zinc-400">
            <span>© {COPYRIGHT_YEAR} Randy Ellis.</span>
            <span>Built with Pride and Passion.</span>
          </TextLoop>
        </Link>
        <div className="flex items-center space-x-4 text-xs text-zinc-500 dark:text-zinc-400">
          <a
            href="/blog"
            className="text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            Blog
          </a>
          <GhostedCoin />
          <FooterThemeToggle />
        </div>
      </div>
    </footer>
  );
}
