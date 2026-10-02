/**
 * Comparison rows for /compare.
 *
 * Rules, carried over from the home-page Comparison section:
 *
 * 1. Only publicly verifiable, stable facts are asserted.
 * 2. Nothing is claimed about another product's data handling —
 *    those cells say "See their policy" rather than guessing.
 * 3. No pricing figures for other products. They change constantly and
 *    a stale price is worse than no price.
 *
 * The A-Coder column is sourced from the repo. See PRODUCT_NOTES.md §9.
 */

export type Cell = true | false | string;

export const COMPARE_COLUMNS = [
  "A-Coder",
  "Cursor",
  "Windsurf",
  "VS Code + Copilot",
] as const;

export interface CompareRow {
  label: string;
  cells: Cell[];
  note?: string;
}

export interface CompareGroup {
  title: string;
  rows: CompareRow[];
}

export const COMPARE_GROUPS: CompareGroup[] = [
  {
    title: "Licence and cost",
    rows: [
      {
        label: "Open-source licence",
        cells: ["Apache-2.0", false, false, "Editor MIT · Copilot proprietary"],
        note: "A-Coder's LICENSE.txt is Apache-2.0, and GitHub reports the same.",
      },
      {
        label: "Cost of the editor itself",
        cells: ["Free", "Paid plans", "Paid plans", "Editor free · Copilot paid"],
      },
      {
        label: "Source available to inspect",
        cells: [true, false, false, "Editor only"],
        note: "Whether you can read how the tool handles your code, not just be told.",
      },
      {
        label: "Forkable for in-house changes",
        cells: [true, false, false, "Editor only"],
      },
    ],
  },
  {
    title: "Models and keys",
    rows: [
      {
        label: "Bring your own API key",
        cells: [true, "Partial", "Partial", false],
      },
      {
        label: "Cloud providers supported",
        cells: ["13", "Several", "Several", "Bundled"],
        note: "Counted from the provider list in the repo's docs.",
      },
      {
        label: "Local models as a first-class option",
        cells: ["6 runtimes", false, false, false],
        note: "Ollama, LM Studio, vLLM, llama.cpp, LiteLLM and any OpenAI-compatible server.",
      },
      {
        label: "Per-feature model choice",
        cells: ["7 features", false, false, false],
        note: "Chat, Quick Edit, Autocomplete, Apply, Commit Messages, Vision and the tool picker each take their own model.",
      },
      {
        label: "Per-model capability overrides",
        cells: [true, false, false, false],
        note: "Context window, tool-calling dialect, FIM support, reasoning budget and more.",
      },
    ],
  },
  {
    title: "Where your code goes",
    rows: [
      {
        label: "Requests go straight to the provider",
        cells: [true, "See their policy", "See their policy", "See their policy"],
        note: "The desktop product has no server of its own to relay through.",
      },
      {
        label: "Can run with nothing leaving the machine",
        cells: [true, false, false, false],
      },
      {
        label: "Per-tool permission gates",
        cells: ["9 categories", "Partial", "Partial", "Partial"],
      },
      {
        label: "Terminal allow and deny patterns",
        cells: [true, "Partial", "Partial", false],
      },
    ],
  },
  {
    title: "Agent behaviour",
    rows: [
      {
        label: "Read-only planning mode",
        cells: [true, "Partial", "Partial", false],
        note: "A mode that can read the codebase but is structurally unable to edit it.",
      },
      {
        label: "Approvable plans executed stepwise",
        cells: [true, false, false, false],
      },
      {
        label: "Typed subagents",
        cells: ["5 types", "Partial", false, false],
      },
      {
        label: "Exact-match editing",
        cells: [true, "Partial", "Partial", "Partial"],
        note: "An edit that cannot find a unique match fails rather than guessing.",
      },
      {
        label: "Bounded agent loops",
        cells: ["50 iterations", "Unstated", "Unstated", "Unstated"],
      },
    ],
  },
  {
    title: "Extending it",
    rows: [
      {
        label: "Built on VS Code",
        cells: [true, true, true, true],
      },
      {
        label: "VS Code extensions and themes",
        cells: [true, true, true, true],
      },
      {
        label: "MCP servers",
        cells: [true, true, true, true],
      },
      {
        label: "ACP agent servers",
        cells: [true, false, false, false],
      },
      {
        label: "Markdown skill packages",
        cells: [true, false, false, false],
      },
      {
        label: "Remote control over REST and WebSocket",
        cells: [true, false, false, false],
      },
    ],
  },
  {
    title: "Learning",
    rows: [
      {
        label: "Built-in tutoring mode",
        cells: [true, false, false, false],
      },
      {
        label: "Exercises marked in the editor",
        cells: ["4 types", false, false, false],
      },
      {
        label: "Progressive hints",
        cells: ["4 levels", false, false, false],
      },
      {
        label: "Ambient coaching while you work",
        cells: [true, false, false, false],
      },
    ],
  },
];
