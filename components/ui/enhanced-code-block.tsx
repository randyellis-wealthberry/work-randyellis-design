"use client";

import React, { useState, useCallback } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type CodeBlockProps = {
  language: string;
  filename?: string;
  highlightLines?: number[];
  variant?: "default" | "compact" | "column";
  showLineNumbers?: boolean;
  copyButton?: boolean;
  maxHeight?: number;
  theme?: "default" | "minimal";
  className?: string;
} & (
  | {
      code: string;
      tabs?: never;
    }
  | {
      code?: never;
      tabs: Array<{
        name: string;
        code: string;
        language?: string;
        highlightLines?: number[];
      }>;
    }
);

const variantStyles = {
  default: {
    container: "rounded-lg bg-slate-900 p-4 font-mono text-sm",
    header: "flex justify-between items-center py-2",
    filename: "text-xs text-zinc-400",
    copyButton:
      "flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors",
    tabs: "flex overflow-x-auto",
    tab: "px-3 py-2 text-xs transition-colors",
  },
  compact: {
    container: "rounded-lg bg-slate-900 p-2 font-mono text-xs",
    header: "flex justify-between items-center py-1",
    filename: "text-xs text-zinc-400",
    copyButton:
      "flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors",
    tabs: "flex overflow-x-auto",
    tab: "px-2 py-1 text-xs transition-colors",
  },
  column: {
    container: "rounded-lg bg-slate-900 p-3 font-mono text-xs",
    header: "flex justify-between items-center py-1.5",
    filename: "text-xs text-zinc-400 truncate max-w-[60%]",
    copyButton:
      "flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors shrink-0",
    tabs: "flex overflow-x-auto scrollbar-hide",
    tab: "px-2 py-1.5 text-xs transition-colors whitespace-nowrap",
  },
};

const themeStyles = {
  default: atomDark,
  minimal: {
    ...atomDark,
    'pre[class*="language-"]': {
      ...atomDark['pre[class*="language-"]'],
      background: "transparent",
    },
    'code[class*="language-"]': {
      ...atomDark['code[class*="language-"]'],
      background: "transparent",
    },
  },
};

export const EnhancedCodeBlock = ({
  language,
  filename,
  code,
  tabs = [],
  highlightLines = [],
  variant = "default",
  showLineNumbers = true,
  copyButton = true,
  maxHeight,
  theme = "default",
  className,
}: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabsExist = tabs.length > 0;
  const styles = variantStyles[variant];

  const copyToClipboard = useCallback(async () => {
    const textToCopy = tabsExist ? tabs[activeTab].code : code;
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    }
  }, [tabsExist, tabs, activeTab, code]);

  const activeCode = tabsExist ? tabs[activeTab].code : code;
  const activeLanguage = tabsExist
    ? tabs[activeTab].language || language
    : language;
  const activeHighlightLines = tabsExist
    ? tabs[activeTab].highlightLines || highlightLines
    : highlightLines;

  return (
    <div
      className={cn(
        "relative w-full",
        styles.container,
        // Responsive container queries
        "@container/code",
        // 2-column layout optimizations
        variant === "column" && "max-w-full overflow-hidden",
        className,
      )}
      style={{
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        overflowY: maxHeight ? "auto" : undefined,
      }}
    >
      <div className="flex flex-col gap-2">
        {/* Tabs */}
        {tabsExist && (
          <div className={styles.tabs}>
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={cn(
                  styles.tab,
                  activeTab === index
                    ? "border-b border-blue-400 text-white"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        )}

        {/* Header with filename and copy button */}
        {!tabsExist && (filename || copyButton) && (
          <div className={styles.header}>
            {filename && (
              <div className={styles.filename} title={filename}>
                {filename}
              </div>
            )}
            {copyButton && (
              <button
                onClick={copyToClipboard}
                className={styles.copyButton}
                title="Copy to clipboard"
                aria-label="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <IconCheck size={14} />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <IconCopy size={14} />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Copy button for tabs (positioned in tab area) */}
        {tabsExist && copyButton && (
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={copyToClipboard}
              className={cn(
                styles.copyButton,
                "rounded bg-slate-800 px-2 py-1",
              )}
              title="Copy to clipboard"
              aria-label="Copy code to clipboard"
            >
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
            </button>
          </div>
        )}
      </div>

      {/* Code content */}
      <SyntaxHighlighter
        language={activeLanguage}
        style={themeStyles[theme]}
        customStyle={{
          margin: 0,
          padding: 0,
          background: "transparent",
          fontSize:
            variant === "compact"
              ? "0.75rem"
              : variant === "column"
                ? "clamp(0.7rem, 1.5vw, 0.8rem)"
                : "0.875rem",
          lineHeight: 1.5,
          // Responsive adjustments
          overflowX: "auto",
          maxWidth: "100%",
        }}
        wrapLines={true}
        showLineNumbers={showLineNumbers}
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: activeHighlightLines.includes(lineNumber)
              ? "rgba(59, 130, 246, 0.15)" // Blue highlight with transparency
              : "transparent",
            display: "block",
            width: "100%",
            paddingLeft: variant === "compact" ? "0.5rem" : "1rem",
            paddingRight: variant === "compact" ? "0.5rem" : "1rem",
          },
        })}
        lineNumberStyle={{
          minWidth: variant === "compact" ? "2em" : "2.5em",
          paddingRight: "1em",
          color: "#6b7280",
          fontSize: variant === "compact" ? "0.7rem" : "0.8rem",
          userSelect: "none",
        }}
        PreTag="div"
      >
        {String(activeCode || "")}
      </SyntaxHighlighter>
    </div>
  );
};

// Convenience component for simple usage
export const CodeBlock = EnhancedCodeBlock;
