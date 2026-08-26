/**
 * Every agent the `skills` CLI can install into, from the supported-agents
 * table in vercel-labs/skills.
 *
 * The reason this list exists at all: the single `npx skills add` command
 * already works everywhere, so the page needs to *show* that rather than
 * assert it. A visitor on Cursor should see the Cursor path, not be told to
 * trust that it works.
 *
 * Transcribed from the CLI's own README table rather than typed by hand, so
 * the ids match what `--agent` actually accepts. It will drift as the CLI
 * adds agents; the page links the upstream table as the source of truth, so
 * a stale entry here degrades to out-of-date rather than wrong.
 */
export type SkillAgent = {
  /** Display name, as the CLI's table writes it. */
  name: string;
  /** The value `--agent` accepts. */
  id: string;
  /** Where skills land when installed into a project. */
  projectPath: string;
  /** Where they land with `-g`. Null where the agent is project-only. */
  globalPath: string | null;
};

export const SKILL_AGENTS: readonly SkillAgent[] = [
  {
    name: "AdaL",
    id: "adal",
    projectPath: ".adal/skills/",
    globalPath: "~/.adal/skills/",
  },
  {
    name: "AiderDesk",
    id: "aider-desk",
    projectPath: ".aider-desk/skills/",
    globalPath: "~/.aider-desk/skills/",
  },
  {
    name: "Amp",
    id: "amp",
    projectPath: ".agents/skills/",
    globalPath: "~/.config/agents/skills/",
  },
  {
    name: "Antigravity",
    id: "antigravity",
    projectPath: ".agents/skills/",
    globalPath: "~/.gemini/antigravity/skills/",
  },
  {
    name: "Antigravity CLI",
    id: "antigravity-cli",
    projectPath: ".agents/skills/",
    globalPath: "~/.gemini/antigravity-cli/skills/",
  },
  {
    name: "AstrBot",
    id: "astrbot",
    projectPath: "data/skills/",
    globalPath: "~/.astrbot/data/skills/",
  },
  {
    name: "Augment",
    id: "augment",
    projectPath: ".augment/skills/",
    globalPath: "~/.augment/skills/",
  },
  {
    name: "Autohand Code CLI",
    id: "autohand-code",
    projectPath: ".autohand/skills/",
    globalPath: "~/.autohand/skills/",
  },
  {
    name: "Claude Code",
    id: "claude-code",
    projectPath: ".claude/skills/",
    globalPath: "~/.claude/skills/",
  },
  {
    name: "Cline",
    id: "cline",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "Code Studio",
    id: "codestudio",
    projectPath: ".codestudio/skills/",
    globalPath: "~/.codestudio/skills/",
  },
  {
    name: "CodeArts Agent",
    id: "codearts-agent",
    projectPath: ".codeartsdoer/skills/",
    globalPath: "~/.codeartsdoer/skills/",
  },
  {
    name: "CodeBuddy",
    id: "codebuddy",
    projectPath: ".codebuddy/skills/",
    globalPath: "~/.codebuddy/skills/",
  },
  {
    name: "Codemaker",
    id: "codemaker",
    projectPath: ".codemaker/skills/",
    globalPath: "~/.codemaker/skills/",
  },
  {
    name: "Codex",
    id: "codex",
    projectPath: ".agents/skills/",
    globalPath: "~/.codex/skills/",
  },
  {
    name: "Command Code",
    id: "command-code",
    projectPath: ".commandcode/skills/",
    globalPath: "~/.commandcode/skills/",
  },
  {
    name: "Continue",
    id: "continue",
    projectPath: ".continue/skills/",
    globalPath: "~/.continue/skills/",
  },
  {
    name: "Cortex Code",
    id: "cortex",
    projectPath: ".cortex/skills/",
    globalPath: "~/.snowflake/cortex/skills/",
  },
  {
    name: "Crush",
    id: "crush",
    projectPath: ".crush/skills/",
    globalPath: "~/.config/crush/skills/",
  },
  {
    name: "Cursor",
    id: "cursor",
    projectPath: ".agents/skills/",
    globalPath: "~/.cursor/skills/",
  },
  {
    name: "Deep Agents",
    id: "deepagents",
    projectPath: ".agents/skills/",
    globalPath: "~/.deepagents/agent/skills/",
  },
  {
    name: "Devin for Terminal",
    id: "devin",
    projectPath: ".devin/skills/",
    globalPath: "~/.config/devin/skills/",
  },
  {
    name: "Dexto",
    id: "dexto",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "Droid",
    id: "droid",
    projectPath: ".factory/skills/",
    globalPath: "~/.factory/skills/",
  },
  {
    name: "Eve",
    id: "eve",
    projectPath: "agent/skills/",
    globalPath: null,
  },
  {
    name: "Firebender",
    id: "firebender",
    projectPath: ".agents/skills/",
    globalPath: "~/.firebender/skills/",
  },
  {
    name: "ForgeCode",
    id: "forgecode",
    projectPath: ".forge/skills/",
    globalPath: "~/.forge/skills/",
  },
  {
    name: "Gemini CLI",
    id: "gemini-cli",
    projectPath: ".agents/skills/",
    globalPath: "~/.gemini/skills/",
  },
  {
    name: "GitHub Copilot",
    id: "github-copilot",
    projectPath: ".agents/skills/",
    globalPath: "~/.copilot/skills/",
  },
  {
    name: "Goose",
    id: "goose",
    projectPath: ".goose/skills/",
    globalPath: "~/.config/goose/skills/",
  },
  {
    name: "Grok Build",
    id: "grok",
    projectPath: ".grok/skills/",
    globalPath: "~/.grok/skills/",
  },
  {
    name: "Hermes Agent",
    id: "hermes-agent",
    projectPath: ".hermes/skills/",
    globalPath: "~/.hermes/skills/",
  },
  {
    name: "IBM Bob",
    id: "bob",
    projectPath: ".bob/skills/",
    globalPath: "~/.bob/skills/",
  },
  {
    name: "iFlow CLI",
    id: "iflow-cli",
    projectPath: ".iflow/skills/",
    globalPath: "~/.iflow/skills/",
  },
  {
    name: "inference.sh",
    id: "inference-sh",
    projectPath: ".inferencesh/skills/",
    globalPath: "~/.inferencesh/skills/",
  },
  {
    name: "Jazz",
    id: "jazz",
    projectPath: ".jazz/skills/",
    globalPath: "~/.jazz/skills/",
  },
  {
    name: "Junie",
    id: "junie",
    projectPath: ".junie/skills/",
    globalPath: "~/.junie/skills/",
  },
  {
    name: "Kilo Code",
    id: "kilo",
    projectPath: ".kilocode/skills/",
    globalPath: "~/.kilocode/skills/",
  },
  {
    name: "Kimchi",
    id: "kimchi",
    projectPath: ".kimchi/skills/",
    globalPath: "~/.config/kimchi/harness/skills/",
  },
  {
    name: "Kimi Code CLI",
    id: "kimi-code-cli",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "Kiro CLI",
    id: "kiro-cli",
    projectPath: ".kiro/skills/",
    globalPath: "~/.kiro/skills/",
  },
  {
    name: "Kode",
    id: "kode",
    projectPath: ".kode/skills/",
    globalPath: "~/.kode/skills/",
  },
  {
    name: "Lingma",
    id: "lingma",
    projectPath: ".lingma/skills/",
    globalPath: "~/.lingma/skills/",
  },
  {
    name: "Loaf",
    id: "loaf",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "MCPJam",
    id: "mcpjam",
    projectPath: ".mcpjam/skills/",
    globalPath: "~/.mcpjam/skills/",
  },
  {
    name: "MiniMax Code",
    id: "minimax-code",
    projectPath: ".minimax/skills/",
    globalPath: "~/.minimax/skills/",
  },
  {
    name: "Mistral Vibe",
    id: "mistral-vibe",
    projectPath: ".vibe/skills/",
    globalPath: "~/.vibe/skills/",
  },
  {
    name: "Moxby",
    id: "moxby",
    projectPath: ".moxby/skills/",
    globalPath: "~/.moxby/skills/",
  },
  {
    name: "Mux",
    id: "mux",
    projectPath: ".mux/skills/",
    globalPath: "~/.mux/skills/",
  },
  {
    name: "Neovate",
    id: "neovate",
    projectPath: ".neovate/skills/",
    globalPath: "~/.neovate/skills/",
  },
  {
    name: "Ona",
    id: "ona",
    projectPath: ".ona/skills/",
    globalPath: "~/.ona/skills/",
  },
  {
    name: "OpenClaw",
    id: "openclaw",
    projectPath: "skills/",
    globalPath: "~/.openclaw/skills/",
  },
  {
    name: "OpenCode",
    id: "opencode",
    projectPath: ".agents/skills/",
    globalPath: "~/.config/opencode/skills/",
  },
  {
    name: "OpenHands",
    id: "openhands",
    projectPath: ".openhands/skills/",
    globalPath: "~/.openhands/skills/",
  },
  {
    name: "Pi",
    id: "pi",
    projectPath: ".pi/skills/",
    globalPath: "~/.pi/agent/skills/",
  },
  {
    name: "Pochi",
    id: "pochi",
    projectPath: ".pochi/skills/",
    globalPath: "~/.pochi/skills/",
  },
  {
    name: "Posit Assistant",
    id: "posit-assistant",
    projectPath: ".posit/assistant/skills/",
    globalPath: "~/.posit/assistant/skills/",
  },
  {
    name: "PromptScript",
    id: "promptscript",
    projectPath: ".agents/skills/",
    globalPath: null,
  },
  {
    name: "Qoder",
    id: "qoder",
    projectPath: ".qoder/skills/",
    globalPath: "~/.qoder/skills/",
  },
  {
    name: "Qoder CN",
    id: "qoder-cn",
    projectPath: ".qoder/skills/",
    globalPath: "~/.qoder-cn/skills/",
  },
  {
    name: "Qwen Code",
    id: "qwen-code",
    projectPath: ".qwen/skills/",
    globalPath: "~/.qwen/skills/",
  },
  {
    name: "Reasonix",
    id: "reasonix",
    projectPath: ".reasonix/skills/",
    globalPath: "~/.reasonix/skills/",
  },
  {
    name: "Replit",
    id: "replit",
    projectPath: ".agents/skills/",
    globalPath: "~/.config/agents/skills/",
  },
  {
    name: "Roo Code",
    id: "roo",
    projectPath: ".roo/skills/",
    globalPath: "~/.roo/skills/",
  },
  {
    name: "Rovo Dev",
    id: "rovodev",
    projectPath: ".rovodev/skills/",
    globalPath: "~/.rovodev/skills/",
  },
  {
    name: "Tabnine CLI",
    id: "tabnine-cli",
    projectPath: ".tabnine/agent/skills/",
    globalPath: "~/.tabnine/agent/skills/",
  },
  {
    name: "Terramind",
    id: "terramind",
    projectPath: ".terramind/skills/",
    globalPath: "~/.terramind/skills/",
  },
  {
    name: "Tinycloud",
    id: "tinycloud",
    projectPath: ".tinycloud/skills/",
    globalPath: "~/.tinycloud/skills/",
  },
  {
    name: "Trae",
    id: "trae",
    projectPath: ".trae/skills/",
    globalPath: "~/.trae/skills/",
  },
  {
    name: "Trae CN",
    id: "trae-cn",
    projectPath: ".trae/skills/",
    globalPath: "~/.trae-cn/skills/",
  },
  {
    name: "Universal",
    id: "universal",
    projectPath: ".agents/skills/",
    globalPath: "~/.config/agents/skills/",
  },
  {
    name: "Warp",
    id: "warp",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "Windsurf",
    id: "windsurf",
    projectPath: ".windsurf/skills/",
    globalPath: "~/.codeium/windsurf/skills/",
  },
  {
    name: "ZCode",
    id: "zcode",
    projectPath: ".zcode/skills/",
    globalPath: "~/.zcode/skills/",
  },
  {
    name: "Zed",
    id: "zed",
    projectPath: ".agents/skills/",
    globalPath: "~/.agents/skills/",
  },
  {
    name: "Zencoder",
    id: "zencoder",
    projectPath: ".zencoder/skills/",
    globalPath: "~/.zencoder/skills/",
  },
  {
    name: "Zenflow",
    id: "zenflow",
    projectPath: ".zencoder/skills/",
    globalPath: "~/.zencoder/skills/",
  },
];

/**
 * The agents surfaced as chips, in the order they appear. Chosen for reach
 * rather than preference — these are the ones a visitor is most likely to
 * already have open. Everything else stays one disclosure away.
 */
export const POPULAR_AGENT_IDS: readonly string[] = [
  "claude-code",
  "cursor",
  "codex",
  "github-copilot",
  "windsurf",
  "zed",
  "gemini-cli",
  "opencode",
  "cline",
  "amp",
  "goose",
];

/** Total installable agents — derived, so it can never disagree with the list. */
export const AGENT_COUNT = SKILL_AGENTS.length;

export function findAgent(id: string): SkillAgent | undefined {
  return SKILL_AGENTS.find((a) => a.id === id);
}

export const POPULAR_AGENTS: readonly SkillAgent[] = POPULAR_AGENT_IDS.map(
  (id) => {
    const agent = findAgent(id);
    if (!agent) {
      throw new Error(`POPULAR_AGENT_IDS names an unknown agent: ${id}`);
    }
    return agent;
  },
);
