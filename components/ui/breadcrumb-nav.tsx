"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { BreadcrumbStructuredData } from "@/components/seo/structured-data";

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
  // Prepare structured data items (include home + items)
  const structuredDataItems = [
    { name: "Home", url: "https://work.randyellis.design/" },
    ...items
      .filter((item) => item.href) // Only include items with href
      .map((item) => ({
        name: item.label,
        url: item.href!.startsWith("http") 
          ? item.href! 
          : `https://work.randyellis.design${item.href}`,
      })),
  ];

  return (
    <>
      <BreadcrumbStructuredData items={structuredDataItems} />
      <nav
      aria-label="Breadcrumb"
      className={cn(
        "mb-6 flex items-center space-x-1 text-sm text-zinc-500 dark:text-zinc-400",
        className,
      )}
    >
      <Link
        href="https://work.randyellis.design"
        className="rounded p-1 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
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
              className="rounded px-1 py-0.5 transition-colors hover:text-zinc-700 dark:hover:text-zinc-200"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                "px-1 py-0.5",
                item.current && "font-medium text-zinc-900 dark:text-zinc-100",
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
