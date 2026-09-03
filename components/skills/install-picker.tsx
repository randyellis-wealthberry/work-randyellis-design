"use client";

import { useCallback, useMemo, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import {
  AGENT_COUNT,
  POPULAR_AGENTS,
  SKILL_AGENTS,
  type SkillAgent,
} from "@/lib/data/skill-agents";
import { cn } from "@/lib/utils";

const REPO = "randyellis-wealthberry/skills";
const AGENTS_TABLE_URL =
  "https://github.com/vercel-labs/skills#supported-agents";

/**
 * Five rows, 28 columns — about 221px at `text-xs`, measured at 7.89px/char
 * for U+2588 in this mono stack rather than estimated. The budget is 317px:
 * a 375px viewport less the terminal's padding. An earlier 44-column version
 * overflowed by 30px and made a phone drag the terminal sideways to finish
 * reading the banner.
 *
 * This is the one thing here that must never wrap — the command and output
 * lines below wrap instead, so the art alone sets the terminal's minimum
 * width. Generated from a fixed-width letterform map, so the rows cannot
 * drift out of alignment when the word changes.
 */
const WORD_ART = [
  "████ █  █ ███ █    █    ████",
  "█    █ █   █  █    █    █   ",
  "███  ██    █  █    █    ███ ",
  "   █ █ █   █  █    █       █",
  "████ █  █ ███ ████ ████ ████",
];

const SKILL_TOTAL = 4;

function commandFor(agent: SkillAgent | null, skill?: string) {
  let command = `npx skills@latest add ${REPO}`;
  if (skill) command += ` --skill ${skill}`;
  if (agent) command += ` -a ${agent.id}`;
  return command;
}

type InstallPickerProps = {
  /**
   * Install one named skill from the repo rather than the whole collection.
   * The /skill page uses this for the free core file; /skills leaves it unset.
   */
  skill?: string;
  /** How many skills the command installs, for the output line. */
  skillCount?: number;
  /** The banner art is the collection's; a single-file page turns it off. */
  showArt?: boolean;
};

export function InstallPicker({
  skill,
  skillCount = SKILL_TOTAL,
  showArt = true,
}: InstallPickerProps = {}) {
  const reduceMotion = useReducedMotion();
  const [selectedId, setSelectedId] = useState<string>("claude-code");
  // Typing runs once, on arrival. After the visitor starts picking agents the
  // command has to keep up with the chips — retyping 60 characters per click
  // would read as lag, not as polish.
  const [hasPicked, setHasPicked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const selected = useMemo(
    () => SKILL_AGENTS.find((a) => a.id === selectedId) ?? null,
    [selectedId],
  );
  const command = commandFor(selected, skill);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in insecure contexts and by some permission
      // policies. The command is selectable text either way, so a failed copy
      // costs the visitor nothing but the shortcut.
      setCopied(false);
    }
  }, [command]);

  const typeOut = !reduceMotion && !hasPicked;

  return (
    <div className="space-y-5">
      <Terminal
        className="max-h-none bg-zinc-950 dark:bg-zinc-900"
        actions={
          <button
            type="button"
            onClick={handleCopy}
            // The terminal is dark in BOTH themes, so this button is styled
            // light-on-dark with no `dark:` variants — a themed treatment
            // would go invisible here in light mode. The negative margin
            // cancels the 44px target so the chrome keeps its own height.
            className="-my-3 inline-flex min-h-[44px] cursor-pointer items-center rounded-md px-2.5 py-3 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-zinc-100 focus-visible:ring-2 focus-visible:ring-zinc-100 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 focus-visible:outline-none"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        }
      >
        {/* Decorative. A screen reader announcing 220 block-drawing characters
            would bury the heading that follows it, so the art is hidden and the
            section's own <h2> carries the meaning. */}
        {showArt && (
          <div aria-hidden="true" className="text-zinc-500 dark:text-zinc-600">
            {WORD_ART.map((row, i) => (
              <AnimatedSpan key={i} delay={i * 60} className="whitespace-pre">
                {row}
              </AnimatedSpan>
            ))}
          </div>
        )}

        <AnimatedSpan
          delay={showArt ? 360 : 0}
          className={showArt ? "mt-3 text-zinc-500" : "text-zinc-500"}
        >
          <span># {AGENT_COUNT} agents. One command.</span>
        </AnimatedSpan>

        <div className="mt-1 flex items-start gap-2">
          <span aria-hidden="true" className="text-green-400">
            $
          </span>
          {typeOut ? (
            <TypingAnimation
              duration={18}
              delay={420}
              className="wrap-anywhere whitespace-pre-wrap text-zinc-100"
            >
              {command}
            </TypingAnimation>
          ) : (
            <span className="text-sm wrap-anywhere whitespace-pre-wrap text-zinc-100">
              {command}
            </span>
          )}
        </div>

        <AnimatedSpan
          delay={typeOut ? 1800 : 0}
          className="mt-1 wrap-anywhere whitespace-pre-wrap text-zinc-400"
        >
          <span>
            <span className="text-green-400">✓</span> {skillCount}{" "}
            {skillCount === 1 ? "skill" : "skills"} →{" "}
            <span className="text-zinc-200">
              {selected ? selected.projectPath : ".agents/skills/"}
            </span>
          </span>
        </AnimatedSpan>
      </Terminal>

      {/* A group, not a bare row: the sr-only line below described these chips
          but no element referenced it, so assistive tech announced eleven
          unexplained toggles. aria-labelledby is what makes it a caption. */}
      <div
        role="group"
        aria-labelledby="agent-picker-label"
        className="flex flex-wrap items-center gap-2"
      >
        <span className="sr-only" id="agent-picker-label">
          Choose your agent to see its install command and path
        </span>
        {POPULAR_AGENTS.map((agent) => {
          const active = agent.id === selectedId;
          return (
            <button
              key={agent.id}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSelectedId(agent.id);
                setHasPicked(true);
              }}
              className={cn(
                // py-2.5 + min-h clears 44px without widening the chip, so the
                // row count at 375px is unchanged — this buys the target size
                // with height alone.
                "inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-3 py-2.5 text-sm transition-colors",
                "focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:outline-none dark:focus-visible:ring-zinc-100 dark:focus-visible:ring-offset-zinc-950",
                active
                  ? "border-zinc-900 bg-zinc-900 text-zinc-50 dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-zinc-500 dark:hover:text-zinc-100",
              )}
            >
              {agent.name}
            </button>
          );
        })}
      </div>

      <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        The bare command detects what you have installed, so the{" "}
        <code className="font-mono text-sm">-a</code> flag is only needed to
        force a specific target. Skills are plain{" "}
        <code className="font-mono text-sm">SKILL.md</code> markdown — they
        install into an agent, not into a model, so whichever LLM you point at
        them is your choice.
      </p>

      <div>
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          aria-expanded={showAll}
          className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          {showAll ? "Hide the full list" : `Show all ${AGENT_COUNT} agents`}
        </button>

        {showAll && (
          <div className="mt-4 overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Agent
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    <code className="font-mono">--agent</code>
                  </th>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Project path
                  </th>
                </tr>
              </thead>
              <tbody className="text-zinc-600 dark:text-zinc-400">
                {SKILL_AGENTS.map((agent) => (
                  <tr
                    key={agent.id}
                    className="border-b border-zinc-100 last:border-0 dark:border-zinc-900"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      {agent.name}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {agent.id}
                    </td>
                    <td className="px-3 py-2 font-mono text-xs whitespace-nowrap">
                      {agent.projectPath}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400">
        This list tracks the{" "}
        <a
          href={AGENTS_TABLE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          skills CLI
        </a>
        , which is the source of truth as it adds agents. Or copy any{" "}
        <code className="font-mono text-sm">skills/…</code> directory straight
        into whichever path your agent uses above.
      </p>
    </div>
  );
}
