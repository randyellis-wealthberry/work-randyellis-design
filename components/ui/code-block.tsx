"use client";

import { useState, useEffect } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackCodeBlockCopy } from "@/lib/analytics";
import { usePathname } from "next/navigation";

// Dynamic import function for sugar-high
const getHighlighter = async () => {
  try {
    const { highlight } = await import("sugar-high");
    return highlight;
  } catch (error) {
    console.warn("Failed to load sugar-high:", error);
    return null;
  }
};

interface CodeBlockProps {
  children: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ children, language, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);

      // Track code copy interaction
      const blogSlug = pathname?.includes("/blog/")
        ? pathname.split("/blog/")[1]?.split("/")[0]
        : undefined;
      const lineCount = children.split("\n").length;

      trackCodeBlockCopy(language || "code", blogSlug, lineCount);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Get highlighted code HTML with dynamic import
  const [codeHTML, setCodeHTML] = useState(children);

  useEffect(() => {
    const highlightCode = async () => {
      const highlighter = await getHighlighter();
      if (highlighter) {
        try {
          setCodeHTML(highlighter(children));
        } catch (error) {
          console.warn("Sugar-high highlighting failed:", error);
          setCodeHTML(children);
        }
      }
    };
    highlightCode();
  }, [children]);

  if (!mounted) {
    // Return a simple pre/code block during SSR
    return (
      <div className="group relative">
        <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
          <pre className="overflow-x-auto p-4">
            <code dangerouslySetInnerHTML={{ __html: codeHTML }} />
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header with language label and copy button */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-100 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-800/50">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            {language || "code"}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-zinc-200 px-2 py-1 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            aria-label={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Code content */}
        <pre className="overflow-x-auto p-4">
          <code
            className="text-sm"
            dangerouslySetInnerHTML={{ __html: codeHTML }}
          />
        </pre>
      </div>
    </div>
  );
}

// Inline code component (for backtick code)
export function InlineCode({ children }: { children: string }) {
  const [codeHTML, setCodeHTML] = useState(children);

  useEffect(() => {
    const highlightCode = async () => {
      const highlighter = await getHighlighter();
      if (highlighter) {
        try {
          setCodeHTML(highlighter(children));
        } catch (error) {
          console.warn("Sugar-high highlighting failed:", error);
          setCodeHTML(children);
        }
      }
    };
    highlightCode();
  }, [children]);

  return (
    <code
      className="rounded bg-zinc-100 px-1.5 py-0.5 text-sm dark:bg-zinc-800"
      dangerouslySetInnerHTML={{ __html: codeHTML }}
    />
  );
}
