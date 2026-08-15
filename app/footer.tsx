"use client";
import Link from "next/link";
import { TextLoop } from "@/components/ui/text-loop";
import { FooterThemeToggle } from "@/components/ui/simple-theme-toggle";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <Link href="/">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2025 Randy Ellis.</span>
            <span>Built with Pride and Passion.</span>
          </TextLoop>
        </Link>
        <div className="flex items-center space-x-4 text-xs text-zinc-400">
          <a
            href="/blog"
            className="text-zinc-400 transition-colors hover:text-zinc-600 dark:hover:text-zinc-300"
          >
            Blog
          </a>
          <FooterThemeToggle />
        </div>
      </div>
    </footer>
  );
}
