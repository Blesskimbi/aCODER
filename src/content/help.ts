/**
 * Help centre for /help and /help/[slug].
 *
 * Each article is a task-shaped answer assembled from the repo's own
 * user guides, and links back to the guide it came from so a reader can
 * check it. Nothing here is invented; where the repo is silent or
 * contradicts itself, the article says so.
 */

export interface HelpArticle {
  slug: string;
  title: string;
  /** One-line answer, shown on the index. */
  summary: string;
  category: "Setup" | "Using A-Coder" | "Models" | "Safety" | "Troubleshooting";
  /** Guide in docs/user-guide this is drawn from. */
  guide: string;
  /** Rendered as an ordered list when steps, prose when body. */
  steps?: string[];
  body?: string[];
  /** Caveats worth surfacing rather than burying. */
  caveat?: string;
  related?: string[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    slug: "install-a-coder",
    title: "Install A-Coder",
    summary: "One command on macOS, Linux or Windows, with checksums verified for you.",
    category: "Setup",
    guide: "getting-started.md",
    steps: [
      "Run the install script for your platform, or download an installer from the releases page.",
      "The script verifies the SHA-256 sidecar published with every release before installing anything.",
      "On macOS, drag the app to /Applications. Builds are unsigned, so clear the quarantine attribute before first launch: sudo xattr -d com.apple.quarantine \"/Applications/A-Coder.app\".",
      "On first launch, import your settings, keybindings and extensions from VS Code, Cursor or Windsurf.",
    ],
    caveat:
      "Pass --user (or -UserSetup on PowerShell) to install without sudo, and --version to pin a specific release. --dry-run shows what would happen without doing it.",
    related: ["connect-a-model", "migrate-from-vs-code"],
  },
  {
    slug: "connect-a-model",
    title: "Connect a model provider",
    summary: "Add a cloud key or point at a local server; local models are detected for you.",
    category: "Setup",
    guide: "providers-and-models.md",
    steps: [
      "Open Settings and go to Manage Models.",
      "For a cloud provider, paste your API key. A link to that provider's key page sits under the field.",
      "For a local provider, confirm the endpoint — the defaults are pre-filled — and A-Coder detects whatever you have running.",
      "Enable the models you want. Providers that list many start hidden so you turn on only what you will use.",
      "Optionally assign a model per feature in Settings → Features.",
    ],
    caveat:
      "You hold the account and the key. A-Coder sends it only to the provider it belongs to, and you can revoke it without involving the project.",
    related: ["pick-a-model-per-feature", "run-fully-offline"],
  },
  {
    slug: "pick-a-model-per-feature",
    title: "Use a different model for each feature",
    summary: "Chat, autocomplete, apply, commit messages and vision can each run their own model.",
    category: "Models",
    guide: "getting-started.md",
    body: [
      "Seven features take their own model: Chat, Quick Edit, Autocomplete, Apply, Commit Messages, Vision and the Smart Tool Picker.",
      "Leaving one unset is fine — A-Coder falls back to any enabled model. Set one explicitly when a feature wants something different from chat, which in practice means a small fast model for autocomplete and a stronger one for agent work.",
      "Autocomplete is the clearest case: it fires constantly and needs fill-in-the-middle support, so a cheap FIM-capable model there saves both money and latency.",
    ],
    related: ["connect-a-model"],
  },
  {
    slug: "run-fully-offline",
    title: "Run without anything leaving your machine",
    summary: "Point at a local runtime and no code, prompt or diff crosses the network.",
    category: "Safety",
    guide: "providers-and-models.md",
    body: [
      "A-Coder dispatches model requests from your machine straight to the endpoint you configured. There is no A-Coder relay in the path, because there is no A-Coder server in the desktop product at all.",
      "Choose Ollama, LM Studio, vLLM, llama.cpp or any OpenAI-compatible server and the endpoint is local, so nothing leaves the machine.",
      "Models are auto-detected from local endpoints, so there is no list to maintain by hand.",
    ],
    caveat:
      "Two provider options are not local despite sitting near the others: Ollama Cloud and the hosted A-Coder provider both send requests off your machine. Pick a genuinely local runtime if that matters.",
    related: ["connect-a-model", "control-what-the-agent-can-do"],
  },
  {
    slug: "control-what-the-agent-can-do",
    title: "Control what the agent is allowed to do",
    summary: "Nine approval categories; everything outside them is read-only and auto-approved.",
    category: "Safety",
    guide: "tool-approval-and-terminal.md",
    body: [
      "Tools are grouped into approval categories: edits, terminal, code execution, skills, image generation, repo, forms, quizzes and MCP tools. Those prompt. Everything else — reading, searching, outlining, planning, teaching — auto-approves, because it cannot change your project.",
      "You can auto-approve a whole category once you trust it, and gate terminal commands further with explicit allow and deny patterns.",
      "Two asymmetries are worth knowing. Opening a terminal is gated but running a command in one you already approved is not. And generate_image prompts while generate_video does not, because only image generation is treated as a paid external call.",
    ],
    caveat:
      "Auto-approving MCP tools also covers Composio and ACP calls, including ones made inside subagents. It is the broadest switch on the page.",
    related: ["run-fully-offline", "use-plan-before-agent"],
  },
  {
    slug: "use-plan-before-agent",
    title: "Review a plan before any code changes",
    summary: "Plan mode reads but cannot write. Approve the plan, then switch to Agent.",
    category: "Using A-Coder",
    guide: "chat-modes.md",
    body: [
      "Plan mode gives the model read access to your codebase and nothing else — it cannot edit files or run commands. What it produces is reviewable: a todo list, or an implementation plan with steps, complexity, affected files and dependencies, opened in a preview tab.",
      "Approve the plan and Agent mode executes it one step at a time, respecting the dependencies between steps.",
      "The docs recommend this split for anything non-trivial. It separates thinking from acting, which is where most agent mistakes come from.",
    ],
    related: ["control-what-the-agent-can-do"],
  },
  {
    slug: "fix-a-failed-edit",
    title: "An edit failed to apply",
    summary: "Exact-match editing fails loudly rather than changing the wrong line.",
    category: "Troubleshooting",
    guide: "tools.md",
    body: [
      "edit_file requires its target text to match exactly and to be unique in the file. If the text is not found, or appears more than once, the edit fails rather than guessing.",
      "This is deliberate. A fuzzy match that silently edits the wrong occurrence is far more expensive to find than an edit that refuses to run.",
      "When a match fails, A-Coder returns similar blocks so the model can retry with the right text. Usually it corrects itself on the next turn.",
      "For changes spanning files, edit_files pre-validates every target before writing anything, so a partial failure cannot leave half the change applied.",
    ],
    caveat:
      "If edits keep failing on a large file, the model is likely working from a stale read. Ask it to re-read the file first.",
    related: ["control-what-the-agent-can-do"],
  },
  {
    slug: "long-conversation-ran-out-of-context",
    title: "A long conversation is losing earlier detail",
    summary: "Three mechanisms manage a finite context window; one of them is opt-in.",
    category: "Troubleshooting",
    guide: "context-management.md",
    body: [
      "A rolling window keeps recent messages while older ones leave the active context, and summarisation condenses that history rather than dropping it outright.",
      "TOON compression compacts structured tool results — directory listings, lint output, large MCP results. It is off by default; turn on enableToolResultTOON to use it.",
      "TOON is applied only where it saves at least 10%, so enabling it does not make small results worse. Measured savings run roughly 30–50% on directory listings, 40–60% on lint errors and 30–70% on large structured MCP results.",
      "Starting a fresh thread for a genuinely new task is still the cheapest fix — threads are independent and you can run several at once.",
    ],
    related: ["pick-a-model-per-feature"],
  },
  {
    slug: "migrate-from-vs-code",
    title: "Bring your settings over from another editor",
    summary: "Settings, keybindings and extensions import from VS Code, Cursor or Windsurf.",
    category: "Setup",
    guide: "keyboard-shortcuts.md",
    body: [
      "A-Coder is built on VS Code's open-source core, so your editor knowledge transfers unchanged, and the extension gallery points at the Visual Studio Marketplace.",
      "Import runs on first launch, and is available afterwards from Settings → System → Migration. It covers settings, keybindings and extensions.",
      "Your keybindings land in keybindings.json exactly as they would in VS Code, and you can rebind A-Coder's own commands from the Keyboard Shortcuts editor.",
    ],
    caveat:
      "The README names Cursor and Windsurf alongside VS Code, and the migration panel lists all three. The VS Code path is the best evidenced of the three in the repo's own docs.",
    related: ["install-a-coder", "keyboard-shortcuts"],
  },
  {
    slug: "keyboard-shortcuts",
    title: "The shortcuts worth learning first",
    summary: "Four core bindings, plus diff navigation and slash commands.",
    category: "Using A-Coder",
    guide: "keyboard-shortcuts.md",
    body: [
      "Ctrl+K opens Quick Edit on the selection. Ctrl+L adds the selection, or the current file, to chat as a context chip. Ctrl+Shift+L starts a new thread. Ctrl+Shift+A opens the Agent Manager. Tab accepts an autocomplete suggestion.",
      "On macOS, read Ctrl as Cmd throughout.",
      "In the chat input: Enter sends and queues if the model is busy, a double-tap of Enter within 500 ms force-sends mid-response, Escape aborts, and the arrow keys walk back through your input history.",
      "Accepting and rejecting diffs auto-advances to the next one, and there are separate bindings for a whole file and for every file at once.",
    ],
    caveat:
      "The repo's own docs disagree about Ctrl+L: the shortcut reference calls it \"add selection to chat\", while the getting-started guide uses it to open the sidebar. The dedicated reference is the one to trust.",
    related: ["use-plan-before-agent"],
  },
  {
    slug: "enable-remote-control",
    title: "Drive A-Coder from another device",
    summary: "A built-in REST and WebSocket server, off by default and localhost-bound.",
    category: "Using A-Coder",
    guide: "mobile-api.md",
    steps: [
      "Open Settings → API & Mobile and enable the API server. It listens on port 3737 by default.",
      "Generate a token. Tokens look like acoder_<random> and go in an Authorization: Bearer header, or as a token query parameter for WebSocket.",
      "Connect a client. Threads, workspace files, planning and settings are all reachable, and the WebSocket streams live response state.",
      "To reach it from outside your machine, run a Cloudflare Tunnel and paste the hostname into the Tunnel URL setting.",
    ],
    caveat:
      "A token is a key to your editor — it can send messages, read files and approve tool calls. A tunnel makes that reachable from the public internet, so use a strong token, rotate it, and restrict the hostname in Cloudflare.",
    related: ["control-what-the-agent-can-do"],
  },
  {
    slug: "learn-mode-basics",
    title: "Learn to code inside the editor",
    summary: "Pick a level and the model teaches, sets exercises, and marks your work.",
    category: "Using A-Coder",
    guide: "learn-mode.md",
    body: [
      "Switch the chat mode to Learn and choose a level: Beginner, Intermediate or Advanced. The choice is remembered across sessions.",
      "The tutor explains code line by line, teaches a concept from scratch with an analogy and an example, sets exercises in four formats, and marks your answers without giving them away when you are wrong.",
      "Hints escalate across four levels, from a nudge to the solution, one level per request — so asking for help does not immediately end the exercise.",
      "Progress is tracked locally: lessons completed, exercises solved, quizzes taken, time spent, daily streaks and unlockable badges.",
    ],
    caveat:
      "Every teaching tool is auto-approved. Learning never stops at a permission prompt.",
    related: ["use-plan-before-agent"],
  },
];

export const getArticle = (slug: string) =>
  HELP_ARTICLES.find((a) => a.slug === slug);

export const HELP_CATEGORIES = [
  "Setup",
  "Using A-Coder",
  "Models",
  "Safety",
  "Troubleshooting",
] as const;
