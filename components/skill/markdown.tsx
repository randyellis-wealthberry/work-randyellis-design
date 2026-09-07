"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Markdown from the catalog, rendered in the site's vocabulary.
 *
 * The previews and samples are the public face of files that are themselves
 * markdown, so they are stored as markdown and rendered here rather than
 * transcribed into JSX. Every element maps onto an existing voice: tables
 * are the Results Table (hairlines, no outer border, no radius), quotes are
 * the left-rule quote, headings are the Subhead. Nothing here introduces a
 * fourth heading size or a card.
 */
const components: Components = {
  h1: ({ children }) => (
    <p className="mt-6 text-base font-medium text-zinc-900 first:mt-0 dark:text-white">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <p className="mt-6 text-base font-medium text-zinc-900 first:mt-0 dark:text-white">
      {children}
    </p>
  ),
  h3: ({ children }) => (
    <p className="mt-6 text-base font-medium text-zinc-900 first:mt-0 dark:text-white">
      {children}
    </p>
  ),
  p: ({ children }) => (
    <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-zinc-600 first:mt-0 dark:text-zinc-400">
      {children}
    </p>
  ),
  strong: ({ children }) => (
    <strong className="font-medium text-zinc-900 dark:text-white">
      {children}
    </strong>
  ),
  em: ({ children }) => <em>{children}</em>,
  a: ({ children, href }) => (
    <a
      href={href}
      className="underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-900 dark:decoration-zinc-700 dark:hover:decoration-zinc-100"
    >
      {children}
    </a>
  ),
  code: ({ children }) => (
    <code className="font-mono text-[0.9em] text-zinc-900 dark:text-zinc-100">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mt-3 overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100 dark:bg-zinc-900">
      {children}
    </pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mt-3 max-w-[62ch] border-l-2 border-zinc-300 pl-5 text-base leading-relaxed text-zinc-700 dark:border-zinc-600 dark:text-zinc-300 [&>p]:text-inherit">
      {children}
    </blockquote>
  ),
  ul: ({ children }) => (
    <ul className="mt-3 max-w-[70ch] list-disc space-y-1.5 pl-5 text-base leading-relaxed text-zinc-600 marker:text-zinc-400 dark:text-zinc-400 dark:marker:text-zinc-600">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="mt-3 max-w-[70ch] list-decimal space-y-1.5 pl-5 text-base leading-relaxed text-zinc-600 marker:text-zinc-500 dark:text-zinc-400">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="[&>p]:mt-0">{children}</li>,
  hr: () => <hr className="my-6 border-zinc-200 dark:border-zinc-800" />,
  table: ({ children }) => (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-zinc-300 text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
      {children}
    </thead>
  ),
  tbody: ({ children }) => (
    <tbody className="text-zinc-600 dark:text-zinc-400">{children}</tbody>
  ),
  tr: ({ children }) => (
    <tr className="border-b border-zinc-200 align-top last:border-0 dark:border-zinc-800">
      {children}
    </tr>
  ),
  th: ({ children }) => (
    <th scope="col" className="py-2 pr-4 font-medium tracking-[0.02em]">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="py-2.5 pr-4 leading-relaxed [&:first-child]:font-medium [&:first-child]:text-zinc-900 dark:[&:first-child]:text-white">
      {children}
    </td>
  ),
};

export function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
}
