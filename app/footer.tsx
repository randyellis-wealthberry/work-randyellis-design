"use client";
import { TextLoop } from "@/components/ui/text-loop";
import { FooterThemeToggle } from "@/components/ui/simple-theme-toggle";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <a href="https://work.randyellis.design">
          <TextLoop className="text-xs text-zinc-500">
            <span>© 2025 Randy Ellis.</span>
            <span>Built with Pride and Passion.</span>
          </TextLoop>
        </a>
        <div className="flex items-center space-x-4 text-xs text-zinc-400">
          <FooterThemeToggle />
        </div>
      </div>
    </footer>
  );
}
