"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { XIcon, MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileMenu({ isOpen, onOpenChange }: MobileMenuProps) {
  const { theme, setTheme } = useTheme();

  // Handle body scroll lock when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpenChange]);

  const closeMenu = () => onOpenChange(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavigationClick = () => {
    closeMenu();
  };

  return (
    <>
      {/* Mobile Menu Button - Visible only on mobile/tablet */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onOpenChange(true)}
          className="h-11 w-11"
          aria-label="Open menu"
          aria-expanded={isOpen}
        >
          <MenuIcon className="h-6 w-6 text-zinc-600 dark:text-zinc-400" />
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Panel */}
          <div
            className="fixed top-0 right-0 h-full w-full max-w-sm translate-x-0 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-zinc-950"
            id="mobile-menu"
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 p-4 dark:border-zinc-800">
              <h2
                id="mobile-menu-title"
                className="text-lg font-semibold text-zinc-900 dark:text-zinc-100"
              >
                Menu
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                className="h-10 w-10"
                aria-label="Close menu"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation Links */}
            <nav
              className="flex flex-col space-y-2 p-4"
              role="navigation"
              aria-label="Main navigation"
            >
              <Link
                href="https://work.randyellis.design"
                onClick={handleNavigationClick}
                className="group flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Home
                <span className="ml-auto text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
                  →
                </span>
              </Link>

              <Link
                href="/about"
                onClick={handleNavigationClick}
                className="group flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                About
                <span className="ml-auto text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
                  →
                </span>
              </Link>

              <Link
                href="/projects"
                onClick={handleNavigationClick}
                className="group flex min-h-[44px] items-center rounded-lg px-4 py-3 text-base font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              >
                Projects
                <span className="ml-auto text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-zinc-600">
                  →
                </span>
              </Link>
            </nav>

            {/* Theme Toggle Section */}
            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Theme
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="h-10 px-3"
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                >
                  {theme === "light" ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
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
                      Dark
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
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
                      Light
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-auto border-t border-zinc-200 p-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                © 2024 Randy Ellis
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
