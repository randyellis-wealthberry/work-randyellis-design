"use client";

import { useCallback, useState } from "react";
import { InstallPicker } from "@/components/skills/install-picker";
import { trackEvent } from "@/lib/analytics";
import { WEBSITE_URL } from "@/lib/constants";

export type CoreFileFacts = {
  name: string;
  version: string;
  updated: string;
  license: string;
  lineCount: number;
  /** The opening of the file, cut at a heading. */
  excerpt: string;
};

export const CORE_FILE_URL = `${WEBSITE_URL}/skill.md`;

/** One command that works without the CLI: fetch the file into place. */
export function curlCommand(name: string): string {
  return `curl -fsSL ${CORE_FILE_URL} -o .claude/skills/${name}/SKILL.md --create-dirs`;
}

const TEXT_LINK =
  "-my-3 inline-flex min-h-[44px] w-fit items-center gap-1.5 py-3 text-base font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:text-white dark:decoration-zinc-700 dark:hover:decoration-zinc-100 dark:focus-visible:ring-white";

/**
 * The free file: how to install it, then what it reads like.
 *
 * The excerpt is the real file, not a rendering of it. A SKILL.md is markdown
 * an agent reads, and showing it as the text it is tells a visitor more about
 * what they are installing than a styled version would. The whole file is one
 * link away and is what the excerpt is cut from, so the two cannot disagree.
 */
export function CoreFile({ core }: { core: CoreFileFacts }) {
  const [copied, setCopied] = useState(false);
  const curl = curlCommand(core.name);

  const copyCurl = useCallback(async () => {
    trackEvent("skill_install_copy", "skill", "curl");
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [curl]);

  return (
    <div className="space-y-10">
      <InstallPicker skill={core.name} skillCount={1} showArt={false} />

      <div>
        <h3 className="text-base font-medium text-zinc-900 dark:text-white">
          Or fetch the file directly
        </h3>
        <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
          No CLI, no account. The file is served at its own address, so one
          request puts it where Claude Code looks. Change the path for another
          agent.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
          <pre className="min-w-0 flex-1 overflow-x-auto rounded-lg bg-zinc-950 p-4 font-mono text-xs leading-relaxed text-zinc-100 dark:bg-zinc-900">
            <code>{curl}</code>
          </pre>
          <button
            type="button"
            onClick={copyCurl}
            className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center rounded-lg border border-zinc-300 px-4 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:outline-none dark:border-zinc-700 dark:text-white dark:hover:border-zinc-600 dark:hover:bg-zinc-900 dark:focus-visible:ring-white"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <figure>
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <span className="text-base font-medium text-zinc-900 dark:text-white">
            What the file reads like
          </span>
          <span className="text-xs text-zinc-500 tabular-nums dark:text-zinc-400">
            {core.lineCount} lines · {core.license} · v{core.version} · updated{" "}
            {core.updated}
          </span>
        </figcaption>
        <pre className="mt-3 max-h-[28rem] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
          <code>{core.excerpt}</code>
        </pre>
        <div className="mt-4">
          <a href="/skill.md" className={TEXT_LINK}>
            Read the whole file
          </a>
        </div>
      </figure>
    </div>
  );
}
