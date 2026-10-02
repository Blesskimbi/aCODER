/**
 * Feature groups for /features.
 *
 * Sourced from docs/user-guide/tools.md, interface-tour.md,
 * context-management.md and the repo README. Tool names are the real
 * tool identifiers the agent calls.
 */

export interface FeatureItem {
  name: string;
  body: string;
  /** Real tool identifier or setting key, where one exists. */
  ref?: string;
}

export interface FeatureGroup {
  id: string;
  title: string;
  blurb: string;
  /** Docs guide this group is drawn from. */
  guide: string;
  items: FeatureItem[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    id: "context",
    title: "Reading your codebase",
    blurb:
      "Every tool in this group is auto-approved — it can look but not touch. Read-only tools run in parallel, so gathering context is one round trip rather than ten.",
    guide: "tools.md",
    items: [
      {
        name: "Read with ranges and pagination",
        body: "Files come back with line-number prefixes, and files over 1 MB paginate rather than blowing the context window.",
        ref: "read_file",
      },
      {
        name: "Outline before reading",
        body: "Imports, classes, functions and signatures with line numbers — no bodies. The cheap prelude to a targeted read.",
        ref: "outline_file",
      },
      {
        name: "Directory listing and trees",
        body: "Immediate children, paginated, or a recursive tree diagram of a subtree.",
        ref: "ls_dir · get_dir_tree",
      },
      {
        name: "Three kinds of search",
        body: "Path-only search, full-text content search with regex, and search within a single file returning line numbers.",
        ref: "search_pathnames_only · search_for_files · search_in_file",
      },
      {
        name: "Lint errors as a feedback loop",
        body: "The agent reads diagnostics for a file it just edited and corrects itself, rather than handing you a broken edit.",
        ref: "read_lint_errors",
      },
      {
        name: "Semantic search",
        body: "Morph warpGrep answers a question like “where do we handle X” better than keyword grep can. Requires a Morph key.",
        ref: "fast_context · codebase_search",
      },
    ],
  },
  {
    id: "editing",
    title: "Changing code",
    blurb:
      "Edits are deliberately strict. The agent must match text exactly and uniquely, so it cannot quietly change the wrong occurrence.",
    guide: "tools.md",
    items: [
      {
        name: "Exact-match editing",
        body: "edit_file replaces the first exact match of old_string, and fails if the text is absent or appears more than once. When it misses, A-Coder shows similar blocks so the model can retry — a little more model effort for a lot more safety.",
        ref: "edit_file",
      },
      {
        name: "Atomic multi-file edits",
        body: "One to three edits across files, with every target string pre-validated as present and unique before anything is written. There is no partial state.",
        ref: "edit_files",
      },
      {
        name: "Inline diffs you accept or reject",
        body: "Changes land as diff zones in the editor with a command bar. Accept and reject auto-advance to the next diff, and there are keybindings for whole files and whole workspaces.",
        ref: "inline-diffs.md",
      },
      {
        name: "Quick Edit",
        body: "Ctrl+K opens an inline edit bar on the selection. Describe the change and the model rewrites that selection in place.",
        ref: "Ctrl+K",
      },
      {
        name: "Autocomplete",
        body: "Inline fill-in-the-middle completions as ghost text. Tab accepts. Needs a FIM-capable model, which can be a different, smaller one than chat uses.",
        ref: "Tab",
      },
      {
        name: "Fast Apply",
        body: "With Morph enabled, rewrite_file applies an edit through Morph rather than overwriting wholesale — better at preserving the surrounding code.",
        ref: "enableMorphFastApply",
      },
    ],
  },
  {
    id: "terminal",
    title: "Terminal and execution",
    blurb:
      "Opening a terminal and running a fresh command are gated. Running inside a terminal you already approved is not — the gate is on creating the capability, not on every command after it.",
    guide: "tool-approval-and-terminal.md",
    items: [
      {
        name: "Temporary and persistent terminals",
        body: "A command runs in a hidden temporary terminal, or in a long-lived one you can keep writing to. Timeouts are honoured.",
        ref: "run_command · open_persistent_terminal",
      },
      {
        name: "Non-blocking status checks",
        body: "The agent can wait on a long command or poll its status without blocking the conversation.",
        ref: "wait · check_terminal_status",
      },
      {
        name: "Sandboxed code execution",
        body: "run_code executes TypeScript or JavaScript in a sandbox that can call back into the tool layer, under a hard five-minute cap.",
        ref: "run_code",
      },
      {
        name: "Allow and deny patterns",
        body: "Beyond the category gate, terminal commands can be filtered by explicit allow and deny patterns, so an agent cannot run something you never permitted.",
        ref: "tool-approval-and-terminal.md",
      },
    ],
  },
  {
    id: "planning",
    title: "Planning and delegation",
    blurb:
      "Long work is structured rather than improvised: a plan you can read and approve, then stepwise execution that respects dependencies.",
    guide: "agent-manager.md",
    items: [
      {
        name: "Todo lists with dependencies",
        body: "Structured tasks with IDs, statuses and dependency links, visible as the agent works through them.",
        ref: "create_todo · update_todo",
      },
      {
        name: "Approvable implementation plans",
        body: "A plan with steps, complexity, affected files and dependencies opens in a preview tab. You approve it, then it executes one step at a time.",
        ref: "create_implementation_plan",
      },
      {
        name: "Five subagent types",
        body: "general does the work; code-reviewer, architect and researcher are read-only; test-runner runs builds and reports failures without fixing them. Each gets an isolated context and returns only a summary.",
        ref: "run_subagent",
      },
      {
        name: "Background delegation",
        body: "Hand a long task off in the background and keep chatting. The result arrives as a notification when it finishes.",
        ref: "run_subagent",
      },
      {
        name: "Agent Manager",
        body: "A separate window aggregating threads, workspaces and dashboards — with an opt-in, localhost-only multi-workspace view when you run several projects at once.",
        ref: "Ctrl+Shift+A",
      },
    ],
  },
  {
    id: "context-window",
    title: "Making context last",
    blurb:
      "Three mechanisms keep a long conversation inside a finite context window without silently losing what matters.",
    guide: "context-management.md",
    items: [
      {
        name: "TOON compression",
        body: "Token-Oriented Object Notation compacts structured tool results. It is opt-in, and applied only where it actually saves at least 10%. Measured: roughly 30–50% on directory listings, 40–60% on lint errors, 30–70% on large structured MCP results.",
        ref: "enableToolResultTOON",
      },
      {
        name: "Rolling window",
        body: "Recent messages are preserved while older ones fall out of the active window.",
        ref: "ContextCompressionService",
      },
      {
        name: "Summarisation",
        body: "History is condensed rather than truncated, so earlier decisions survive in compressed form.",
        ref: "context-management.md",
      },
    ],
  },
  {
    id: "git",
    title: "Git and source control",
    blurb:
      "The parts of version control worth automating, with the destructive parts still gated.",
    guide: "git-and-scm.md",
    items: [
      {
        name: "AI commit messages",
        body: "One click from the Source Control input box, or from the command palette. It reads the staged diff.",
        ref: "A-Coder: Generate Commit Message",
      },
      {
        name: "Repo tools",
        body: "With Morph Repo Storage on, the agent gets git operations as tools. Mutating ones — commit, push, checkout, branch — need approval; status and log do not.",
        ref: "repo_*",
      },
      {
        name: "Semantic history search",
        body: "Search across an indexed repo by meaning, scoped to a branch, commit or set of directories.",
        ref: "codebase_search",
      },
    ],
  },
  {
    id: "multimodal",
    title: "Beyond text",
    blurb:
      "Images in, images and audio out, with the paid call gated and the cheap one not.",
    guide: "vision.md",
    items: [
      {
        name: "Vision",
        body: "Drag, drop or paste PNG, JPEG, GIF or WebP into chat. Useful for debugging a UI from a screenshot.",
        ref: "vision.md",
      },
      {
        name: "Image and video generation",
        body: "generate_image goes through an OpenAI-compatible endpoint and needs approval, because it is a paid external call. generate_video is auto-approved.",
        ref: "generate_image · generate_video",
      },
      {
        name: "Voice in and out",
        body: "Dictate with speech-to-text, or have answers read back with text-to-speech.",
        ref: "voice.md",
      },
      {
        name: "Generative UI",
        body: "The agent can render an interactive form to collect structured input, or a quiz with scoring and per-question explanations.",
        ref: "render_form · create_quiz",
      },
    ],
  },
  {
    id: "editor",
    title: "The editor underneath",
    blurb:
      "A-Coder is VS Code with an AI layer, so the parts you already rely on are unchanged.",
    guide: "interface-tour.md",
    items: [
      {
        name: "Your extensions work",
        body: "The gallery points at the Visual Studio Marketplace, so extensions, themes, profiles and keybindings carry over.",
      },
      {
        name: "Per-project instructions",
        body: "Drop a .a-coder-rules file in a workspace root and it loads as model instructions whenever that project opens — repo conventions without repeating yourself.",
        ref: ".a-coder-rules",
      },
      {
        name: "Global instructions",
        body: "System-wide coding standards that apply across every workspace.",
        ref: "aiInstructions",
      },
      {
        name: "Slash commands",
        body: "Start the input with a slash for search, summarize, fix, clear, continue and explain.",
        ref: "/",
      },
    ],
  },
];

/** Approval categories, from tools.md. Everything else auto-approves. */
export const APPROVAL_CATEGORIES: Array<{ name: string; covers: string }> = [
  { name: "edits", covers: "Create, delete, rewrite and edit files and folders; walkthrough writes" },
  { name: "terminal", covers: "run_command, and opening or killing a persistent terminal" },
  { name: "code execution", covers: "run_code, skill scripts, skill benchmarks" },
  { name: "skills", covers: "Installing and uninstalling skills" },
  { name: "image generation", covers: "generate_image" },
  { name: "repo", covers: "Mutating Morph repo operations: init, clone, add, commit, push, pull, checkout, branch" },
  { name: "forms", covers: "render_form" },
  { name: "quizzes", covers: "create_quiz" },
  { name: "MCP tools", covers: "All external tool calls — MCP, Composio and ACP" },
];
