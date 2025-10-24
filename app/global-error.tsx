"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-semibold">
              Something went wrong!
            </h2>
            <button
              onClick={() => reset()}
              className="rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
