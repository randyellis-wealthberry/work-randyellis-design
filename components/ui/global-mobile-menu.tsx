"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { XIcon, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useMobileMenu } from "@/context/mobile-menu-context";
import { Button } from "@/components/ui/button";

export function GlobalMobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();
  const { theme, setTheme } = useTheme();

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen, closeMobileMenu]);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavigationClick = () => {
    closeMobileMenu();
  };

  return (
    <>
      {/* Fixed Mobile Menu Button - Top Right Corner */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMobileMenu}
          className="h-11 w-11 border border-zinc-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
        >
          <MenuIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className="fixed inset-0 flex items-center justify-center bg-white transition-opacity duration-300 ease-in-out dark:bg-zinc-950"
            id="mobile-menu"
          >
            {/* Close Button - Top Right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={closeMobileMenu}
              className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full border border-zinc-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
              aria-label="Close menu"
            >
              <XIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
            </Button>

            {/* Centered Navigation Links */}
            <nav
              className="flex flex-col items-center justify-center space-y-8 px-8"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                href="https://work.randyellis.design"
                onClick={handleNavigationClick}
                className="text-4xl font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Home
              </Link>

              <Link
                href="/about"
                onClick={handleNavigationClick}
                className="text-4xl font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                About
              </Link>

              <Link
                href="/projects"
                onClick={handleNavigationClick}
                className="text-4xl font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-100 dark:hover:text-zinc-400 sm:text-5xl md:text-6xl lg:text-7xl"
              >
                Projects
              </Link>
            </nav>

            {/* Bottom Theme Toggle */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleThemeToggle}
                className="h-14 px-6 text-base font-medium border-zinc-200 bg-white/90 backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
                aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
              >
                {theme === "light" ? (
                  <>
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                      />
                    </svg>
                    Dark Mode
                  </>
                ) : (
                  <>
                    <svg
                      className="mr-3 h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                    Light Mode
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
