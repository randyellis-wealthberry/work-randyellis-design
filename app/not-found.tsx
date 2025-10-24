import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          404
        </h1>
        <h2 className="mb-4 text-2xl font-semibold text-zinc-700 dark:text-zinc-300">
          Page Not Found
        </h2>
        <p className="mb-8 text-zinc-600 dark:text-zinc-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
