"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          500
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Something went wrong!
        </h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          We encountered an error while processing your request.
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
