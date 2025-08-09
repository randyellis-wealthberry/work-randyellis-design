"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex items-center space-x-1 text-sm text-zinc-500 dark:text-zinc-400 mb-6",
        className,
      )}
    >
      <Link
        href="https://work.randyellis.design"
        className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors p-1 rounded"
        aria-label="Home"
      >
        <Home className="h-4 w-4" />
      </Link>

      {items.map((item, index) => (
        <div key={index} className="flex items-center space-x-1">
          <ChevronRight className="h-3 w-3 text-zinc-400" />
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors px-1 py-0.5 rounded"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "px-1 py-0.5",
                item.current && "text-zinc-900 dark:text-zinc-100 font-medium",
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
