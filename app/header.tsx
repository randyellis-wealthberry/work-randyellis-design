"use client";
import { TextEffect } from "@/components/ui/text-effect";
import Link from "next/link";
import UtilityBar from "@/components/ui/utility-bar";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/blog", label: "Blog" },
] as const;

export function Header() {
  return (
    <>
      <UtilityBar />
      <header
        className="mb-6 flex flex-col sm:mb-8 lg:mb-12"
        role="banner"
        data-testid="main-header"
      >
        {/* Navigation — own row, flush-left with content edge. Shown at every
            breakpoint: it used to be lg:-only, which hid every link on phones
            and tablets since there is no separate mobile menu. Tight spacing
            below lg keeps all five on one line at 360px. */}
        <nav className="-ml-2 flex items-center gap-0 pt-4 lg:-ml-4 lg:gap-12">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex min-h-[44px] items-center rounded-md px-2 py-3 text-sm font-medium text-zinc-600 no-underline transition-colors hover:bg-zinc-100 hover:text-zinc-900 lg:px-4 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              style={{ textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
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
            className="whitespace-nowrap text-zinc-600 dark:text-zinc-500"
            delay={0.5}
          >
            Design-led, end to end.
          </TextEffect>
        </div>
      </header>
    </>
  );
}
