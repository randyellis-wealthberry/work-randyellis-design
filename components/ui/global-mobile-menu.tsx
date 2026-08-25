"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { XIcon, MenuIcon, Sun, Moon, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { useMobileMenu } from "@/context/mobile-menu-context";
import { Button } from "@/components/ui/button";
import { FocusTrap } from "@/components/ui/focus-trap";
import { MobileMenuSearch } from "@/components/ui/mobile-menu-search";
import { useRecentPages } from "@/hooks/use-recent-pages";
import { buildSearchIndex, SITE_PAGES } from "@/lib/site-search";
import type { SearchResult } from "@/lib/site-search";
import { trackEvent, trackThemeToggle } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const MENU_ID = "mobile-menu";
const TITLE_ID = "mobile-menu-title";

/** Swipe down (or right) further than this closes the menu. */
const SWIPE_CLOSE_DISTANCE = 120;
/** …or fling faster than this, however short. */
const SWIPE_CLOSE_VELOCITY = 800;

const linkClass =
  "text-4xl font-semibold transition-colors sm:text-5xl md:text-6xl active:scale-[0.98] rounded-lg px-2 -mx-2 outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/20 dark:focus-visible:ring-white/30";

function isActivePath(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalMobileMenu() {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } =
    useMobileMenu();
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  // Resolve a route to a title using the search index — same data the search
  // box uses, so "recent" and "search" never disagree about a page's name.
  const lookupTitle = useCallback((href: string) => {
    const hit = buildSearchIndex().find((r) => r.href === href);
    return hit ? hit.title : null;
  }, []);
  const recentPages = useRecentPages(lookupTitle);

  // Body scroll lock while open
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  // Close on route change (e.g. browser back while open)
  useEffect(() => {
    if (isMobileMenuOpen) closeMobileMenu();
    // Only when the path changes — not when the menu opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const open = () => {
    toggleMobileMenu();
    trackEvent("mobile_menu_open", "navigation", pathname ?? undefined);
  };

  const close = useCallback(
    (reason: string) => {
      closeMobileMenu();
      trackEvent("mobile_menu_close", "navigation", reason);
    },
    [closeMobileMenu],
  );

  const closeOnEscape = useCallback(() => close("escape"), [close]);

  const handleNavigate = (label: string, href: string) => {
    trackEvent("mobile_menu_navigate", "navigation", label, undefined, {
      href,
    });
    closeMobileMenu();
  };

  const handleSearchNavigate = (result: SearchResult) => {
    trackEvent(
      "mobile_menu_search_select",
      "navigation",
      result.type,
      undefined,
      {
        href: result.href,
      },
    );
    closeMobileMenu();
  };

  const handleSearch = (query: string, count: number) => {
    // Only the shape of the query — length and hit count — never its text.
    if (query.trim().length >= 3) {
      trackEvent("mobile_menu_search", "navigation", undefined, count, {
        query_length: query.trim().length,
      });
    }
  };

  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const handleThemeToggle = () => {
    setTheme(nextTheme);
    trackThemeToggle(nextTheme);
  };

  const onPanelDragEnd = (_: unknown, info: PanInfo) => {
    const { offset, velocity } = info;
    if (
      offset.y > SWIPE_CLOSE_DISTANCE ||
      velocity.y > SWIPE_CLOSE_VELOCITY ||
      offset.x > SWIPE_CLOSE_DISTANCE ||
      velocity.x > SWIPE_CLOSE_VELOCITY
    ) {
      close("swipe");
    }
  };

  const panelMotion = useMemo(
    () =>
      reduceMotion
        ? {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
          }
        : {
            initial: { opacity: 0, y: 24, scale: 0.98 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 24, scale: 0.98 },
          },
    [reduceMotion],
  );

  const listMotion = {
    hidden: {},
    visible: {
      transition: reduceMotion
        ? {}
        : { staggerChildren: 0.06, delayChildren: 0.08 },
    },
  };
  const itemMotion = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Fixed trigger — top right, mobile/tablet only */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={open}
          className="h-11 w-11 border border-zinc-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          aria-controls={MENU_ID}
          aria-haspopup="dialog"
        >
          <MenuIcon
            className="h-6 w-6 text-zinc-600 dark:text-zinc-400"
            aria-hidden="true"
          />
        </Button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
              onClick={() => close("backdrop")}
              aria-hidden="true"
            />

            {/* Panel — draggable so a swipe down or right dismisses it */}
            <FocusTrap
              active={isMobileMenuOpen}
              onEscape={closeOnEscape}
              id={MENU_ID}
              aria-labelledby={TITLE_ID}
            >
              <motion.div
                className="fixed inset-0 flex flex-col overflow-y-auto overscroll-contain bg-white dark:bg-zinc-950"
                style={{ willChange: "transform, opacity" }}
                {...panelMotion}
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: [0.22, 1, 0.36, 1],
                }}
                drag={reduceMotion ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.25}
                dragMomentum={false}
                onDragEnd={onPanelDragEnd}
              >
                <h2 id={TITLE_ID} className="sr-only">
                  Site menu
                </h2>

                {/* Grab handle — signals the swipe-to-close affordance */}
                <div
                  className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-zinc-300 dark:bg-zinc-700"
                  aria-hidden="true"
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => close("button")}
                  className="absolute top-4 right-4 z-10 h-12 w-12 rounded-full border border-zinc-200 bg-white/90 shadow-lg backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
                  aria-label="Close menu"
                >
                  <XIcon
                    className="h-6 w-6 text-zinc-600 dark:text-zinc-400"
                    aria-hidden="true"
                  />
                </Button>

                {/* Search */}
                <div className="mx-auto mt-16 w-full max-w-md px-6">
                  <MobileMenuSearch
                    onNavigate={handleSearchNavigate}
                    onSearch={handleSearch}
                  />
                </div>

                {/* Primary navigation */}
                <motion.nav
                  className="flex flex-1 flex-col items-center justify-center gap-6 px-8 py-10"
                  aria-label="Main navigation"
                  variants={listMotion}
                  initial="hidden"
                  animate="visible"
                >
                  {SITE_PAGES.map((page) => {
                    const active = isActivePath(pathname, page.href);
                    return (
                      <motion.div key={page.href} variants={itemMotion}>
                        <Link
                          href={page.href}
                          onClick={() => handleNavigate(page.title, page.href)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            linkClass,
                            active
                              ? "text-zinc-900 underline decoration-orange-500 decoration-4 underline-offset-8 dark:text-zinc-100"
                              : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100",
                          )}
                        >
                          {page.title}
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                {/* Recent pages */}
                {recentPages.length > 0 && (
                  <div className="mx-auto w-full max-w-md px-6 pb-4">
                    {/* Centred to the sheet, like the nav links and the theme
                        button. `max-w-md` centres this block but not its
                        contents, so above 448px the label and chips drifted to
                        the block's left edge while everything else in the menu
                        stayed on the centre line. */}
                    <p className="mb-2 flex items-center justify-center gap-1.5 text-xs font-medium tracking-wide text-zinc-500 uppercase dark:text-zinc-400">
                      <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                      Recently viewed
                    </p>
                    <ul className="flex flex-wrap justify-center gap-2">
                      {recentPages.map((p) => (
                        <li key={p.href}>
                          <Link
                            href={p.href}
                            onClick={() =>
                              handleNavigate(`recent:${p.title}`, p.href)
                            }
                            className="inline-flex h-9 items-center rounded-full border border-zinc-200 bg-white/90 px-3 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Theme toggle */}
                <div className="flex justify-center px-6 pb-8">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleThemeToggle}
                    className="h-14 border-zinc-200 bg-white/90 px-6 text-base font-medium backdrop-blur-sm hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/90 dark:hover:bg-zinc-800"
                    aria-label={`Switch to ${nextTheme} theme`}
                  >
                    {resolvedTheme === "dark" ? (
                      <Sun className="mr-3 h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Moon className="mr-3 h-5 w-5" aria-hidden="true" />
                    )}
                    {resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>

                {/* Easter egg — animated dot */}
                <motion.a
                  href="https://randyellis.design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-8 left-8 h-3 w-3 cursor-pointer rounded-full bg-gradient-to-br from-orange-400 to-pink-500 shadow-lg transition-shadow hover:shadow-xl hover:shadow-orange-500/50 dark:from-orange-500 dark:to-pink-600 dark:hover:shadow-orange-400/50"
                  animate={
                    reduceMotion
                      ? { opacity: 0.7 }
                      : { scale: [0.8, 1, 0.8], opacity: [0.4, 0.7, 0.4] }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{ scale: 1.2, opacity: 1 }}
                  aria-label="Visit Randy Ellis personal website"
                />
              </motion.div>
            </FocusTrap>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
