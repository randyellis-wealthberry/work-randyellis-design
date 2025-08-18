"use client";

import * as React from "react";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type TestResultStatus = "pending" | "error" | "success";

export interface TestResult {
  id: string;
  title: string;
  message: string;
  status: TestResultStatus;
  timestamp: Date;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: string | Record<string, any>;
}

interface TestResultsProps {
  results: TestResult[];
  className?: string;
}

interface TestResultItemProps {
  result: TestResult;
}

const StatusIcon = ({ status }: { status: TestResultStatus }) => {
  switch (status) {
    case "pending":
      return (
        <div
          className="flex h-5 w-5 items-center justify-center"
          role="img"
          aria-label="Pending status"
        >
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
        </div>
      );
    case "error":
      return (
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white"
          role="img"
          aria-label="Error status"
        >
          <span className="text-xs leading-none font-bold">✕</span>
        </div>
      );
    case "success":
      return (
        <div
          className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white"
          role="img"
          aria-label="Success status"
        >
          <span className="text-xs leading-none font-bold">✓</span>
        </div>
      );
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: TestResultStatus }) => {
  const variants = {
    pending: "bg-orange-100 text-orange-800 border-orange-200",
    error: "bg-red-100 text-red-800 border-red-200",
    success: "bg-green-100 text-green-800 border-green-200",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium uppercase", variants[status])}
    >
      {status}
    </Badge>
  );
};

const TestResultItem = React.memo(({ result }: TestResultItemProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const hasDetails = result.details !== undefined;

  const borderColors = {
    pending: "border-l-orange-500",
    error: "border-l-red-500",
    success: "border-l-green-500",
  };

  const formatTimestamp = React.useCallback((date: Date) => {
    // Handle invalid dates
    if (!date || isNaN(date.getTime())) {
      return "Invalid date";
    }
    return new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(date);
  }, []);

  const formatDetails = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (details: string | Record<string, any>) => {
      if (typeof details === "string") {
        return { content: details, isJson: false };
      }
      try {
        const jsonString = JSON.stringify(details, null, 2);
        return { content: jsonString, isJson: true };
      } catch {
        return {
          content:
            "Unable to display details (circular reference or invalid data)",
          isJson: false,
        };
      }
    },
    [],
  );

  const JsonHighlighter = React.memo(({ content }: { content: string }) => {
    const highlightJson = (jsonStr: string) => {
      return jsonStr
        .replace(
          /(".*?")\s*:/g,
          '<span class="text-blue-600 font-medium">$1</span>:',
        )
        .replace(/:\s*(".*?")/g, ': <span class="text-green-600">$1</span>')
        .replace(
          /:\s*(true|false|null)/g,
          ': <span class="text-purple-600">$1</span>',
        )
        .replace(
          /:\s*(-?\d+\.?\d*)/g,
          ': <span class="text-orange-600">$1</span>',
        );
    };

    return (
      <pre
        className="max-h-96 overflow-auto text-xs whitespace-pre-wrap text-gray-800"
        dangerouslySetInnerHTML={{ __html: highlightJson(content) }}
      />
    );
  });

  JsonHighlighter.displayName = "JsonHighlighter";

  const handleToggle = React.useCallback(
    (event: React.MouseEvent | React.KeyboardEvent) => {
      event.preventDefault();
      setIsExpanded((prev) => !prev);
    },
    [],
  );

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        handleToggle(event);
      }
    },
    [handleToggle],
  );

  return (
    <div
      className={cn(
        "border-l-4 bg-white p-4 shadow-sm",
        borderColors[result.status],
      )}
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={result.status} />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-gray-900">{result.title}</h3>
              <StatusBadge status={result.status} />
            </div>
          </div>

          <p className="text-sm text-gray-600">{result.message}</p>

          <p className="text-xs text-gray-500">
            {formatTimestamp(result.timestamp)}
          </p>

          {hasDetails && (
            <button
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              className="flex items-center gap-1 rounded-sm text-sm text-blue-600 transition-colors hover:text-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              aria-expanded={isExpanded}
              aria-label={`${isExpanded ? "Hide" : "Show"} details for ${result.title}`}
            >
              {isExpanded ? (
                <ChevronDownIcon
                  className="h-4 w-4"
                  data-lucide="chevron-down"
                />
              ) : (
                <ChevronRightIcon
                  className="h-4 w-4"
                  data-lucide="chevron-right"
                />
              )}
              View Details
            </button>
          )}
        </div>
      </div>

      {hasDetails && isExpanded && (
        <div
          className="mt-4 ml-8"
          role="region"
          aria-label="Additional details"
        >
          <div className="rounded-md bg-gray-50 p-3">
            {(() => {
              const formatted = formatDetails(result.details!);
              return formatted.isJson ? (
                <JsonHighlighter content={formatted.content} />
              ) : (
                <pre className="max-h-96 overflow-auto text-xs whitespace-pre-wrap text-gray-800">
                  {formatted.content}
                </pre>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
});

TestResultItem.displayName = "TestResultItem";

export const TestResults = React.memo(
  ({ results, className }: TestResultsProps) => {
    // Handle empty results
    if (!results || results.length === 0) {
      return (
        <div className={cn("space-y-4", className)}>
          <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
          <div className="py-8 text-center text-gray-500">
            No test results available
          </div>
        </div>
      );
    }

    return (
      <div className={cn("space-y-4", className)}>
        <h2 className="text-2xl font-bold text-gray-900">Test Results</h2>
        <div className="space-y-0 overflow-hidden rounded-lg border border-gray-200">
          {results.map((result, index) => (
            <div
              key={result.id}
              className={cn(
                index !== results.length - 1 && "border-b border-gray-200",
              )}
            >
              <TestResultItem result={result} />
            </div>
          ))}
        </div>
      </div>
    );
  },
);

TestResults.displayName = "TestResults";

export default TestResults;
